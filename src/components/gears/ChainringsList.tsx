import { useState } from 'react'
import { Card, Button, EmptyState, Loading } from '../common'
import { useChainrings, useDeleteChainring, useUpdateChainring } from '../../hooks'
import { AddChainringModal } from './AddChainringModal'
import type { Chainring } from '../../types'

interface ChainringsListProps {
  showAddModal?: boolean
  onCloseAddModal?: () => void
}

export function ChainringsList({ showAddModal = false, onCloseAddModal }: ChainringsListProps) {
  const { data: chainrings, isLoading } = useChainrings()
  const deleteChainring = useDeleteChainring()
  const updateChainring = useUpdateChainring()
  const [isAddModalOpen, setIsAddModalOpen] = useState(showAddModal)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chainring?')) return
    setDeletingId(id)
    try {
      await deleteChainring.mutateAsync(id)
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleFavorite = async (chainring: Chainring) => {
    try {
      await updateChainring.mutateAsync({
        id: chainring.id,
        is_favorite: !chainring.is_favorite,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    onCloseAddModal?.()
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <Loading text="Loading chainrings..." />
      </div>
    )
  }

  if (!chainrings?.length) {
    return (
      <>
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
          title="No chainrings yet"
          description="Add your first chainring to start calculating gear ratios"
          action={
            <Button onClick={() => setIsAddModalOpen(true)}>Add Chainring</Button>
          }
        />
        <AddChainringModal
          isOpen={isAddModalOpen || showAddModal}
          onClose={handleCloseModal}
        />
      </>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">{chainrings.length} chainring{chainrings.length !== 1 ? 's' : ''}</p>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            Add
          </Button>
        </div>

        {chainrings.map((chainring) => (
          <Card key={chainring.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleFavorite(chainring)}
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill={chainring.is_favorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
              <div>
                <p className="text-white font-semibold">{chainring.teeth}T</p>
                {chainring.brand && (
                  <p className="text-gray-400 text-sm">{chainring.brand}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(chainring.id)}
              disabled={deletingId === chainring.id}
              className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </Card>
        ))}
      </div>

      <AddChainringModal
        isOpen={isAddModalOpen || showAddModal}
        onClose={handleCloseModal}
      />
    </>
  )
}
