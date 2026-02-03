import { AppLayout, PageHeader } from '../components/layout'
import { ProgressCard, QuickActions } from '../components/home'
import { useAuthStore } from '../store/authStore'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Home() {
  const { profile } = useAuthStore()
  const greeting = getGreeting()
  const firstName = profile?.name?.split(' ')[0] || 'Cyclist'

  return (
    <AppLayout>
      <PageHeader
        title={`${greeting}, ${firstName}`}
        subtitle="Ready to track your progress?"
      />

      <div className="space-y-6">
        <ProgressCard />
        <QuickActions />
      </div>
    </AppLayout>
  )
}
