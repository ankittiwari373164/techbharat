import { JSDOM } from 'jsdom'

export function addInternalLinks(
  html: string,
  currentSlug: string,
  allArticles: any[]
): string {
  try {
    const dom = new JSDOM(html)
    const doc = dom.window.document

    const walker = doc.createTreeWalker(
      doc.body,
      dom.window.NodeFilter.SHOW_TEXT
    )

    let linkCount = 0
    const MAX_LINKS = 5

    let node: Node | null

    while ((node = walker.nextNode())) {
      if (linkCount >= MAX_LINKS) break

      const parent = node.parentElement
      if (!parent) continue

      if (parent.closest('a, script, style, h1, h2, h3')) continue

      const text = node.textContent || ''
      if (text.length < 40) continue

      for (const article of allArticles) {
        if (!article.slug || article.slug === currentSlug) continue

        const words = (article.title || '')
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .split(' ')
          .filter((w: string) => w.length > 5)

        const keyword = words[0]
        if (!keyword) continue

        const regex = new RegExp(`\\b${keyword}\\b`, 'i')

        if (regex.test(text)) {
          const replaced = text.replace(
            regex,
            `<a href="/${article.slug}" class="internal-link">${keyword}</a>`
          )

          const span = doc.createElement('span')
          span.innerHTML = replaced

          parent.replaceChild(span, node)

          linkCount++
          break
        }
      }
    }

    return doc.body.innerHTML
  } catch (err) {
    console.error('Internal link error:', err)
    return html
  }
}