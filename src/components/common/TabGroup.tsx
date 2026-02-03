interface Tab {
  id: string
  label: string
}

interface TabGroupProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function TabGroup({ tabs, activeTab, onChange }: TabGroupProps) {
  return (
    <div className="flex bg-navy-800 rounded-lg p-1 border border-navy-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex-1 py-2 px-4 rounded-md text-sm font-medium
            transition-colors duration-200
            ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-navy-700'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
