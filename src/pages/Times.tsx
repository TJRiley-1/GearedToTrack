import { useState } from 'react'
import { AppLayout, PageHeader } from '../components/layout'
import { Select, Button } from '../components/common'
import { LapTimesList, AddLapTimeModal } from '../components/laptimes'
import { EVENT_TYPES } from '../types'

export function Times() {
  const [eventFilter, setEventFilter] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const eventOptions = [
    { value: '', label: 'All Events' },
    ...EVENT_TYPES.map((type) => ({ value: type, label: type })),
  ]

  return (
    <AppLayout>
      <PageHeader
        title="Lap Times"
        subtitle="Track your velodrome performance"
        action={
          <Button onClick={() => setIsAddModalOpen(true)}>
            + New Session
          </Button>
        }
      />

      <div className="space-y-4">
        <Select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          options={eventOptions}
        />

        <LapTimesList
          eventTypeFilter={eventFilter || undefined}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <AddLapTimeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </AppLayout>
  )
}
