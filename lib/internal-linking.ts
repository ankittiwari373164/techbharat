export function addInternalLinks(
  html: string,
  currentSlug: string,
  articles: any[]
): string {
  if (!html) return html

  let linkCount = 0
  const MAX_LINKS = 4

  try {
    // ✅ Filter ONLY real articles (NO guides / NO pillar pages)
    const validArticles = articles.filter(a =>
      a.slug &&
      a.slug !== currentSlug &&
      a.title &&
      (
        a.type === 'news' || a.type === 'article' || !a.type // fallback support
      ) &&
      !a.slug.includes('best-') &&
      !a.slug.includes('guide') &&
      !a.slug.includes('compare')
    )

    // ✅ Split HTML safely (avoid breaking tags)
    const parts = html.split(/(<[^>]+>)/g)

    return parts.map((part) => {
      // 🚫 Skip HTML tags
      if (part.startsWith('<')) return part

      // 🚫 Skip small text chunks
      if (part.length < 20) return part

      if (linkCount >= MAX_LINKS) return part

      let updated = part

      for (const a of validArticles) {
        if (linkCount >= MAX_LINKS) break

        // ✅ Strong keyword (first 2 meaningful words)
        const words = a.title
          .split(' ')
          .filter((w: string) => w.length > 5)

        if (!words.length) continue

        const keyword = words.slice(0, 2).join(' ')

        // ✅ Safe regex (word boundary)
        const regex = new RegExp(`\\b${keyword}\\b`, 'i')

        if (!regex.test(updated)) continue

        // ✅ Replace only once per article
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
    console.error('Internal linking error:', err)
    return html // ✅ fallback (never break page)
  }
}