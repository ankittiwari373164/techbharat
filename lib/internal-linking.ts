export function addInternalLinks(
  html: string,
  currentSlug: string,
  allArticles: any[]
): string {
  if (!html) return html

  try {
    let linkCount = 0
    const MAX_LINKS = 3

    // Split into tags and text
    const parts = html.split(/(<[^>]+>)/g)

    let insideParagraph = false

    return parts.map((part) => {
      // Detect paragraph start/end
      if (part.match(/^<p/i)) {
        insideParagraph = true
        return part
      }

      if (part.match(/^<\/p/i)) {
        insideParagraph = false
        return part
      }

      // Skip ALL non-paragraph content
      if (!insideParagraph) return part

      // Skip tags
      if (part.startsWith('<')) return part

      if (linkCount >= MAX_LINKS) return part

      let text = part

      for (const a of allArticles) {
        if (linkCount >= MAX_LINKS) break
        if (!a.slug || a.slug === currentSlug) continue
        if (!a.title) continue

        // SAFE keyword (no broken words)
        const words = a.title.split(' ').filter((w: string) => w.length > 5)
        if (!words.length) continue

        const keyword = words[0].toLowerCase()

        const regex = new RegExp(`\\b${keyword}\\b`, 'i')

        if (!regex.test(text)) continue

        // Prevent double links
        if (text.includes(`href="/${a.slug}"`)) continue

        text = text.replace(regex, (match) => {
          linkCount++

          return `<a href="/${a.slug}" class="internal-link text-[#1a3a5c] font-semibold hover:text-[#d4220a] underline decoration-dotted" rel="internal">${match}</a>`
        })
      }

      return text
    }).join('')

  } catch (err) {
    console.error('Internal link error:', err)
    return html
  }
}