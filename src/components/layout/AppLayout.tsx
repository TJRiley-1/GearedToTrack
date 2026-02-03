import { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-navy-900">
      <main className="pb-20 px-4 pt-6 max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
