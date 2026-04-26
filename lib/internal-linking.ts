import { JSDOM } from 'jsdom'

export function addInternalLinks(
  html: string,
  currentSlug: string,
  allArticles: any[]
): string {
  if (!html) return html

  try {
    const dom = new JSDOM(html)
    const document = dom.window.document

    let linkCount = 0
    const MAX_LINKS = 3

    // Walk only TEXT nodes
    const walker = document.createTreeWalker(
      document.body,
      dom.window.NodeFilter.SHOW_TEXT
    )

    let node: any

    while ((node = walker.nextNode())) {
      if (linkCount >= MAX_LINKS) break

      const parent = node.parentElement
      if (!parent) continue

      // 🚫 Skip unsafe areas
      if (
        parent.closest('a') ||
        parent.closest('script') ||
        parent.closest('style') ||
        parent.closest('h1,h2,h3,h4,h5,h6')
      ) {
        continue
      }

      let text = node.nodeValue
      if (!text || text.trim().length < 20) continue

      for (const a of allArticles) {
        if (linkCount >= MAX_LINKS) break
        if (!a.slug || a.slug === currentSlug) continue
        if (!a.title) continue

        const words = a.title.split(' ').filter((w: string) => w.length > 5)
        if (!words.length) continue

        const keyword = words[0]

        const regex = new RegExp(`\\b${keyword}\\b`, 'i')

        if (!regex.test(text)) continue

        // Create safe anchor
        const link = document.createElement('a')
        link.href = `/${a.slug}`
        link.textContent = keyword
        link.className =
          'internal-link text-[#1a3a5c] font-semibold hover:text-[#d4220a] underline decoration-dotted'
        link.setAttribute('rel', 'internal')

        const parts = text.split(regex)
        const fragment = document.createDocumentFragment()

        fragment.appendChild(document.createTextNode(parts[0]))
        fragment.appendChild(link)
        fragment.appendChild(document.createTextNode(parts[1] || ''))

        parent.replaceChild(fragment, node)

        linkCount++
        break
      }
    }

    return document.body.innerHTML
  } catch (err) {
    console.error('Internal linking error:', err)
    return html
  }
}