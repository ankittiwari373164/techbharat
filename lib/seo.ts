export function injectSmartLinks(
  html: string,
  currentSlug: string,
  articles: any[]
): string {
  if (!html || typeof html !== 'string') return html

  const MAX_LINKS = 5

  const lower = html.toLowerCase()

  // 1. Pick relevant articles (not random)
  const related = articles
    .filter(a => a.slug !== currentSlug)
    .filter(a => {
      const title = (a.title || '').toLowerCase()
      return lower.includes(title.split(' ')[0]) // loose relevance
    })
    .slice(0, 10)

  let linkCount = 0

  let output = html

  for (const a of related) {
    if (linkCount >= MAX_LINKS) break

    const words = a.title.split(' ').slice(0, 3).join(' ') // anchor phrase
    if (!words) continue

    const regex = new RegExp(`\\b(${words})\\b`, 'i')

    if (regex.test(output)) {
      output = output.replace(regex, `
        <a href="/${a.slug}" 
           class="text-blue-600 font-semibold underline decoration-2 hover:text-red-600">
          $1
        </a>
      `)
      linkCount++
    }
  }

  return output
}