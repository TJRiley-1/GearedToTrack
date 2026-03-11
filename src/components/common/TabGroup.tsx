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
  const useGrid = tabs.length > 4

  return (
    <div
      className={`bg-navy-800 rounded-lg p-1 border border-navy-700 ${
        useGrid ? 'grid grid-cols-3 gap-1' : 'flex'
      }`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            ${useGrid ? '' : 'flex-1'} py-2 px-3 rounded-md text-sm font-medium
            transition-colors duration-200 whitespace-nowrap text-center
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
