// app/admin/login/layout.tsx
// Explicit layout for login — no auth needed (middleware allows it through)
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}