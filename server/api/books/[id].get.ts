/**
 * Server-side proxy for Google Books volume detail API.
 * Keeps the API key on the server — never exposed to the browser.
 *
 * GET /api/books/:id
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameter: id',
    })
  }

  const url = new URL(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`)
  const apiKey = (config.googleBooksApiKey || process.env.GOOGLE_BOOKS_API_KEY || process.env.NUXT_GOOGLE_BOOKS_API_KEY || '') as string
  if (apiKey) {
    url.searchParams.set('key', apiKey)
  }

  try {
    const data = await $fetch(url.toString())
    return data
  } catch (error: any) {
    const statusCode = error?.statusCode || 502
    throw createError({
      statusCode: statusCode === 404 ? 404 : statusCode,
      statusMessage:
        statusCode === 404
          ? 'Volume not found'
          : error?.statusMessage || 'Failed to fetch from Google Books API',
    })
  }
})
