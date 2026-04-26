export function addInternalLinks(
  html: string,
  currentSlug: string,
  articles: any[]
): string {
  if (!html) return html

  let linkCount = 0
  const MAX_LINKS = 4

  // ✅ Prevent duplicate keyword linking
  const usedKeywords = new Set<string>()

  try {
    // ✅ ONLY real articles (no guides / pillar pages)
    const validArticles = articles.filter(a =>
      a.slug &&
      a.slug !== currentSlug &&
      a.title &&
      a.slug.split('-').length > 5 && // real articles
      !a.slug.includes('best-') &&
      !a.slug.includes('guide') &&
      !a.slug.includes('compare')
    )

    // ✅ Safe HTML split (no tag breaking)
    const parts = html.split(/(<[^>]+>)/g)

    return parts.map((part) => {
      // 🚫 Skip HTML tags
      if (part.startsWith('<')) return part

      if (linkCount >= MAX_LINKS) return part
      if (part.length < 15) return part

      let updated = part

      for (const a of validArticles) {
        if (linkCount >= MAX_LINKS) break

        const words = a.title
          .split(' ')
          .filter((w: string) => w.length > 4)

        if (!words.length) continue

        // ✅ Better anchor (2-word phrase)
        let keyword = words.slice(0, 2).join(' ').toLowerCase()

        // ✅ Prevent duplicate anchor reuse
        if (usedKeywords.has(keyword)) continue

        let regex = new RegExp(`\\b${keyword}\\b`, 'i')

        // 🔁 Fallback to single word if needed
        if (!regex.test(updated)) {
          keyword = words[0].toLowerCase()
          if (usedKeywords.has(keyword)) continue

          regex = new RegExp(`\\b${keyword}\\b`, 'i')
          if (!regex.test(updated)) continue
        }

        // ✅ Replace only first match safely
        updated = updated.replace(regex, (match) => {
          linkCount++
          usedKeywords.add(keyword)

          return `<a href="/${a.slug}"
            style="color:#d4220a;font-weight:600;text-decoration:underline;"
            class="internal-link"
            rel="internal">${match}</a>`
        })

        break
      }

      return updated
    }).join('')
  } catch (err) {
    console.error('Internal linking error:', err)
    return html // ✅ never break page
  }
}