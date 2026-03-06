import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

const COOKIE_NAME = '__tb_admin'

function isValidToken(token: string): boolean {
  try {
    const decoded = decodeURIComponent(token)
    if (!decoded.startsWith('TBOK:')) return false
    const exp = parseInt(decoded.slice(5), 10)
    return !isNaN(exp) && Date.now() < exp
  } catch { return false }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || ''

  // Skip auth check for login page
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token || !isValidToken(token)) {
    redirect('/admin/login')
  }

  return <>{children}</>
}