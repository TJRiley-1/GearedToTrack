import { useState } from 'react'
import { EmptyState, Button, ConfirmModal, Card } from '../common'
import { useLapSessions, useDeleteLapSession } from '../../hooks'
import { useToastStore } from '../../store/toastStore'
import { LapSessionCard } from './LapSessionCard'

interface LapTimesListProps {
  eventTypeFilter?: string
  onAddClick: () => void
}

export function LapTimesList({ eventTypeFilter, onAddClick }: LapTimesListProps) {
  const { data: sessions, isLoading } = useLapSessions(eventTypeFilter)
  const deleteLapSession = useDeleteLapSession()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const addToast = useToastStore((s) => s.addToast)

  const handleDelete = async (id: string) => {
    try {
      await deleteLapSession.mutateAsync(id)
      addToast('Session deleted')
    } catch (err) {
      console.error(err)
      addToast('Failed to delete session', 'error')
    } finally {
      setConfirmDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-navy-700 rounded w-32" />
              <div className="h-4 bg-navy-700 rounded w-20" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-4 bg-navy-700 rounded" />
              <div className="h-4 bg-navy-700 rounded" />
              <div className="h-4 bg-navy-700 rounded" />
            </div>
          </Card>
        ))}
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
        tips={['Enter times as SS.mmm or M:SS.mmm', 'Add gear info to track which setup works best']}
        action={
          <Button onClick={onAddClick}>Add Lap Time</Button>
        }
      />
    )
  }

  return (
    <>
      <div className="space-y-4">
        {sessions.map((session) => (
          <LapSessionCard
            key={session.id}
            session={session}
            onDelete={(id) => setConfirmDeleteId(id)}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Delete Session"
        message="Are you sure you want to delete this session? All lap times will be removed."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteLapSession.isPending}
      />
    </>
  )
}
