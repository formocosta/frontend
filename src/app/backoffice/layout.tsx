import type { ReactNode } from 'react'

export default function BackofficeLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="backoffice-layout">
      {children}
    </div>
  )
}
