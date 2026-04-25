import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug

  // ✅ Skip if no slug
  if (!slug) {
    return NextResponse.next()
  }

  // ✅ MAIN RULE: redirect ALL /article/* → /*
  const target = `/${slug}`

  // ✅ Prevent infinite redirect loop
  const currentPath = new URL(req.url).pathname
  if (currentPath === target) {
    return NextResponse.next()
  }

  // ✅ 301 permanent redirect
  return NextResponse.redirect(new URL(target, req.url), 301)
}