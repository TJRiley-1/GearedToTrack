import { EmptyState, Loading, Button } from '../common'
import { useLapSessions, useDeleteLapSession } from '../../hooks'
import { LapSessionCard } from './LapSessionCard'

interface LapTimesListProps {
  eventTypeFilter?: string
  onAddClick: () => void
}

export function LapTimesList({ eventTypeFilter, onAddClick }: LapTimesListProps) {
  const { data: sessions, isLoading } = useLapSessions(eventTypeFilter)
  const deleteLapSession = useDeleteLapSession()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return
    try {
      await deleteLapSession.mutateAsync(id)
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <Loading text="Loading sessions..." />
      </div>
    )
  }

  if (!sessions?.length) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title={eventTypeFilter ? `No ${eventTypeFilter} sessions` : 'No lap times yet'}
        description="Record your first session to start tracking your progress"
        action={
          <Button onClick={onAddClick}>Add Lap Time</Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <LapSessionCard
          key={session.id}
          session={session}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
