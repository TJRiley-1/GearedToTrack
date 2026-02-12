import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppLayout, PageHeader } from '../components/layout'
import { TabGroup } from '../components/common'
import { RatiosTab, ChainringsList, SprocketsList, SpeedCadenceCalc } from '../components/gears'

const tabs = [
  { id: 'ratios', label: 'Ratios' },
  { id: 'chainrings', label: 'Chainrings' },
  { id: 'sprockets', label: 'Sprockets' },
  { id: 'calculator', label: 'Calculator' },
]

export function Gears() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'ratios'
  const showAdd = searchParams.get('action') === 'add'

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

  const handleCloseAddModal = () => {
    setSearchParams({ tab: activeTab })
  }

  return (
    <AppLayout>
      <PageHeader
        title="Gear Calculator"
        subtitle="Manage your chainrings and sprockets"
      />

      <div className="space-y-6">
        <TabGroup tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === 'ratios' && <RatiosTab />}
        {activeTab === 'chainrings' && (
          <ChainringsList showAddModal={showAdd} onCloseAddModal={handleCloseAddModal} />
        )}
        {activeTab === 'sprockets' && (
          <SprocketsList showAddModal={showAdd} onCloseAddModal={handleCloseAddModal} />
        )}
        {activeTab === 'calculator' && <SpeedCadenceCalc />}
      </div>
    </AppLayout>
  )
}
