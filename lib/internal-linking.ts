export function addInternalLinks(
  html: string,
  currentSlug: string,
  articles: any[]
): string {
  if (!html) return html

  let linkCount = 0
  const MAX_LINKS = 3

  try {
    // ✅ Split by tags (safe boundary)
    const parts = html.split(/(<[^>]+>)/g)

    return parts.map((part) => {
      // 🚫 Skip HTML tags
      if (part.startsWith('<')) return part

      if (linkCount >= MAX_LINKS) return part
      if (part.length < 40) return part

      let updated = part

      for (const a of articles) {
        if (linkCount >= MAX_LINKS) break
        if (!a.slug || a.slug === currentSlug) continue
        if (!a.title) continue

        // Extract strong keyword
        const words = a.title
          .split(' ')
          .filter((w: string) => w.length > 5)

        if (!words.length) continue

        const keyword = words[0]

        const regex = new RegExp(`\\b${keyword}\\b`, 'i')

        if (!regex.test(updated)) continue

        updated = updated.replace(regex, (match) => {
          linkCount++
          return `<a href="/${a.slug}"
            class="internal-link text-[#1a3a5c] font-semibold hover:text-[#d4220a] underline decoration-dotted"
            rel="internal">${match}</a>`
        })

        break
      }

      return updated
    }).join('')
  } catch (err) {
    console.error('Internal link error:', err)
    return html
  }
}