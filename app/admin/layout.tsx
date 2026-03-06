// app/admin/layout.tsx
// Auth is handled by middleware.ts — this layout just provides
// a clean wrapper with no site Header/Footer
// The root layout reads x-pathname header and skips Header/Footer for /admin
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}