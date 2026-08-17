/**
 * TypeScript types for Google Books API responses.
 *
 * These mirror the real API shape — many fields are optional because
 * the API returns sparse data for some volumes.
 */

// ─── Raw API response types ────────────────────────────────────────

export interface GoogleBooksSearchResponse {
  kind: string
  totalItems: number
  items?: GoogleBooksVolume[]
}

export interface GoogleBooksVolume {
  kind: string
  id: string
  etag: string
  selfLink: string
  volumeInfo: VolumeInfo
  saleInfo?: SaleInfo
  accessInfo?: AccessInfo
}

export interface VolumeInfo {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: IndustryIdentifier[]
  readingModes?: { text: boolean; image: boolean }
  pageCount?: number
  printType?: string
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  maturityRating?: string
  allowAnonLogging?: boolean
  contentVersion?: string
  panelizationSummary?: { containsEpubBubbles: boolean; containsImageBubbles: boolean }
  imageLinks?: ImageLinks
  language?: string
  previewLink?: string
  infoLink?: string
  canonicalVolumeLink?: string
}

export interface ImageLinks {
  smallThumbnail?: string
  thumbnail?: string
  small?: string
  medium?: string
  large?: string
  extraLarge?: string
}

export interface IndustryIdentifier {
  type: string
  identifier: string
}

export interface SaleInfo {
  country?: string
  saleability?: string
  isEbook?: boolean
}

export interface AccessInfo {
  country?: string
  viewability?: string
  embeddable?: boolean
  publicDomain?: boolean
}

// ─── Normalized app-level type ─────────────────────────────────────

export interface Book {
  id: string
  title: string
  subtitle?: string
  authors: string[]
  publisher?: string
  publishedDate?: string
  publishYear?: string
  description?: string
  pageCount?: number
  categories: string[]
  averageRating?: number
  ratingsCount?: number
  imageLinks?: ImageLinks
  language?: string
  previewLink?: string
  infoLink?: string
}

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Normalizes a raw Google Books volume into our app-level Book type.
 * Defensively handles missing fields.
 */
export function normalizeVolume(volume: GoogleBooksVolume): Book {
  const info = volume.volumeInfo

  // Extract year from publishedDate which can be "2021", "2021-05", or "2021-05-15"
  const publishYear = info.publishedDate
    ? info.publishedDate.split('-')[0]
    : undefined

  return {
    id: volume.id,
    title: info.title,
    subtitle: info.subtitle,
    authors: info.authors ?? [],
    publisher: info.publisher,
    publishedDate: info.publishedDate,
    publishYear,
    description: info.description,
    pageCount: info.pageCount,
    categories: info.categories ?? [],
    averageRating: info.averageRating,
    ratingsCount: info.ratingsCount,
    imageLinks: upgradeImageLinks(info.imageLinks),
    language: info.language,
    previewLink: info.previewLink,
    infoLink: info.infoLink,
  }
}

/**
 * Google Books often returns HTTP thumbnail URLs.
 * Upgrade them to HTTPS to avoid mixed-content warnings.
 */
function upgradeImageLinks(links?: ImageLinks): ImageLinks | undefined {
  if (!links) return undefined

  const upgraded: ImageLinks = {}
  for (const [key, value] of Object.entries(links)) {
    if (typeof value === 'string') {
      upgraded[key as keyof ImageLinks] = value.replace(/^http:/, 'https:')
    }
  }
  return upgraded
}

/**
 * Returns the best available cover image URL for a given size preference.
 */
export type CoverSizePreference = 'small' | 'medium' | 'large'

export function getCoverUrl(
  imageLinks?: ImageLinks,
  preference: CoverSizePreference = 'medium'
): string | undefined {
  if (!imageLinks) return undefined

  const priorities: Record<CoverSizePreference, (keyof ImageLinks)[]> = {
    small: ['smallThumbnail', 'thumbnail', 'small', 'medium'],
    medium: ['medium', 'small', 'thumbnail', 'smallThumbnail', 'large'],
    large: ['large', 'extraLarge', 'medium', 'small', 'thumbnail'],
  }

  const preferenceList = priorities[preference] ?? []
  for (const key of preferenceList) {
    if (imageLinks[key]) return imageLinks[key]
  }

  return undefined
}
