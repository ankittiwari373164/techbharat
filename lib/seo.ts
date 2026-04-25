const PILLAR_LINKS = [
  { keyword: 'best smartphones', url: '/best-smartphones-india' },
  { keyword: 'buying guide', url: '/smartphone-buying-guide-india' },
  { keyword: 'camera phones', url: '/best-camera-phones-india' },
  { keyword: '5g phones', url: '/best-5g-phones-india' },
  { keyword: 'phone comparison', url: '/phone-comparison-guide-india' },
]

export function injectInternalLinks(content: string) {
  if (!content) return ''

  let updated = content

  for (const link of PILLAR_LINKS) {
    const regex = new RegExp(`\\b(${link.keyword})\\b`, 'i')

    if (regex.test(updated)) {
      updated = updated.replace(
        regex,
        `<a href="${link.url}" class="text-[#d4220a] font-semibold hover:underline">$1</a>`
      )
    }
  }

  return updated
}