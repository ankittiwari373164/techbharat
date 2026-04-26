export function addInternalLinks(
  html: string,
  currentSlug: string,
  articles: any[]
): string {
  if (!html) return html

  let linkCount = 0
  const MAX_LINKS = 4

  try {
    // ✅ ONLY REAL ARTICLES (no guides / no pillar pages)
    const validArticles = articles.filter(a =>
      a.slug &&
      a.slug !== currentSlug &&
      a.title &&
      a.slug.split('-').length > 5 && // real articles only
      !a.slug.includes('best-') &&
      !a.slug.includes('guide') &&
      !a.slug.includes('compare')
    )

    // ✅ Safe HTML split (prevents breaking tags)
    const parts = html.split(/(<[^>]+>)/g)

    return parts.map((part) => {
      // 🚫 Skip HTML tags
      if (part.startsWith('<')) return part

      if (linkCount >= MAX_LINKS) return part
      if (part.length < 20) return part

      let updated = part

      for (const a of validArticles) {
        if (linkCount >= MAX_LINKS) break

        // ✅ Use strong single keyword (better matching)
        const words = a.title
          .split(' ')
          .filter((w: string) => w.length > 4)

        if (!words.length) continue

        const keyword = words[0]

        const regex = new RegExp(`\\b${keyword}\\b`, 'i')

        if (!regex.test(updated)) continue

        updated = updated.replace(regex, (match) => {
          linkCount++

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