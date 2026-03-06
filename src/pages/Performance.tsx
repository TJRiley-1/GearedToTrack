import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppLayout, PageHeader } from '../components/layout'
import { TabGroup } from '../components/common'
import { PBTimeline, BCStandardsTab, PowerEstimator, TrainingCalendar, CommunityBenchmarks } from '../components/performance'

const tabs = [
  { id: 'bests', label: 'PBs' },
  { id: 'power', label: 'Power' },
  { id: 'standards', label: 'Standards' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'community', label: 'Community' },
]

export function Performance() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'bests'
  const [activeTab, setActiveTab] = useState(initialTab)

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

  return (
    <AppLayout>
      <PageHeader
        title="Performance"
        subtitle="Analytics, standards & training insights"
      />

      <div className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4">
          <TabGroup tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        </div>

        {activeTab === 'bests' && <PBTimeline />}
        {activeTab === 'power' && <PowerEstimator />}
        {activeTab === 'standards' && <BCStandardsTab />}
        {activeTab === 'calendar' && <TrainingCalendar />}
        {activeTab === 'community' && <CommunityBenchmarks />}
      </div>
    </AppLayout>
  )
}
