import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppLayout, PageHeader } from '../components/layout'
import { TabGroup, Select, Button } from '../components/common'
import { LapTimesList, AddLapTimeModal, PacingCalculator } from '../components/laptimes'
import { EVENT_TYPES } from '../types'

const tabs = [
  { id: 'sessions', label: 'Sessions' },
  { id: 'pacing', label: 'Pacing' },
]

export function Times() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'sessions'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [eventFilter, setEventFilter] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tabs.some((t) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

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
          activeTab === 'sessions' ? (
            <Button onClick={() => setIsAddModalOpen(true)}>
              + New Session
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-4">
        <TabGroup tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === 'sessions' && (
          <>
            <Select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              options={eventOptions}
            />
            <LapTimesList
              eventTypeFilter={eventFilter || undefined}
              onAddClick={() => setIsAddModalOpen(true)}
            />
          </>
        )}

        {activeTab === 'pacing' && <PacingCalculator />}
      </div>

      <AddLapTimeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </AppLayout>
  )
}
