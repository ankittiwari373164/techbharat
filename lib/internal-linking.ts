export function addInternalLinks(
  html: string,
  currentSlug: string,
  allArticles: any[]
): string {
  if (!html || typeof html !== 'string') return html

  try {
    let linkCount = 0
    const MAX_LINKS = 3

    // Split into HTML tags + text
    const parts = html.split(/(<[^>]+>)/g)

    return parts
      .map((part) => {
        // Skip HTML tags completely
        if (part.startsWith('<')) return part

        if (linkCount >= MAX_LINKS) return part

        let text = part

        for (const a of allArticles) {
          if (linkCount >= MAX_LINKS) break
          if (!a.slug || a.slug === currentSlug) continue
          if (!a.title) continue

          // Extract safe keyword
          const keyword = a.title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(' ')
            .find((w: string) => w.length > 5)

          if (!keyword) continue

          const regex = new RegExp(`\\b(${keyword})\\b`, 'i')

          if (!regex.test(text)) continue

          // Prevent double linking
          if (text.includes(`href="/${a.slug}"`)) continue

          text = text.replace(regex, (match) => {
            linkCount++

            return `<a href="/${a.slug}" 
              class="internal-link text-[#1a3a5c] font-semibold hover:text-[#d4220a] underline decoration-dotted"
              rel="internal">${match}</a>`
          })
        }

        return text
      })
      .join('')
  } catch (err) {
    console.error('Internal linking error:', err)
    return html
  }
}