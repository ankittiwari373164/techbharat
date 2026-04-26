export function addInternalLinks(
  html: string,
  currentSlug: string,
  allArticles: any[]
): string {
  if (!html || typeof html !== 'string') return html

  try {
    let output = html
    let count = 0
    const MAX = 3

    for (const a of allArticles) {
      if (count >= MAX) break
      if (!a.slug || a.slug === currentSlug) continue
      if (!a.title) continue

      const words = a.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(' ')
        .filter((w: string) => w.length > 5)

      if (!words.length) continue

      const keyword = words[0]

      const regex = new RegExp(`\\b(${keyword})\\b`, 'i')

      if (!regex.test(output)) continue

      output = output.replace(regex, (match) => {
        return `<a href="/${a.slug}" 
          class="internal-link text-[#1a3a5c] font-semibold hover:text-[#d4220a] underline decoration-dotted"
          rel="internal">${match}</a>`
      })

      count++
    }

    return output
  } catch {
    return html
  }
}