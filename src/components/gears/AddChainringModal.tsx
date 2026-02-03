import { useState } from 'react'
import { Modal, Input, Button } from '../common'
import { useAddChainring } from '../../hooks'

interface AddChainringModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddChainringModal({ isOpen, onClose }: AddChainringModalProps) {
  const [teeth, setTeeth] = useState('')
  const [brand, setBrand] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [error, setError] = useState('')

  const addChainring = useAddChainring()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const teethNum = parseInt(teeth, 10)
    if (!teethNum || teethNum < 30 || teethNum > 70) {
      setError('Please enter a valid number of teeth (30-70)')
      return
    }

    try {
      await addChainring.mutateAsync({
        teeth: teethNum,
        brand: brand.trim() || null,
        purchase_date: purchaseDate || null,
      })
      handleClose()
    } catch (err) {
      setError('Failed to add chainring. Please try again.')
      console.error(err)
    }
  }

  const handleClose = () => {
    setTeeth('')
    setBrand('')
    setPurchaseDate('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Chainring">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Teeth"
          type="number"
          min="30"
          max="70"
          value={teeth}
          onChange={(e) => setTeeth(e.target.value)}
          placeholder="e.g., 51"
          required
        />

        <Input
          label="Brand (optional)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g., Sugino, AARN"
        />

        <Input
          label="Purchase Date (optional)"
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={addChainring.isPending} className="flex-1">
            Add Chainring
          </Button>
        </div>
      </form>
    </Modal>
  )
}
