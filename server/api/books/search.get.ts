/**
 * Server-side proxy for Google Books search API.
 * Keeps the API key on the server — never exposed to the browser.
 *
 * GET /api/books/search?q=...&startIndex=0&maxResults=20
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)

  const q = query.q as string | undefined
  if (!q || q.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required query parameter: q',
    })
  }

  const startIndex = parseInt(query.startIndex as string) || 0
  const maxResults = Math.min(parseInt(query.maxResults as string) || 20, 40)

  const url = new URL('https://www.googleapis.com/books/v1/volumes')
  url.searchParams.set('q', q)
  url.searchParams.set('startIndex', String(startIndex))
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('key', config.googleBooksApiKey as string)

  try {
    const data = await $fetch(url.toString())
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage: error?.statusMessage || 'Failed to fetch from Google Books API',
    })
  }
})
