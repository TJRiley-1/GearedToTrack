import { useState } from 'react'
import { Modal, Input, Button } from '../common'
import { useAddSprocket } from '../../hooks'

interface AddSprocketModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddSprocketModal({ isOpen, onClose }: AddSprocketModalProps) {
  const [teeth, setTeeth] = useState('')
  const [brand, setBrand] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [error, setError] = useState('')

  const addSprocket = useAddSprocket()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const teethNum = parseInt(teeth, 10)
    if (!teethNum || teethNum < 10 || teethNum > 25) {
      setError('Please enter a valid number of teeth (10-25)')
      return
    }

    try {
      await addSprocket.mutateAsync({
        teeth: teethNum,
        brand: brand.trim() || null,
        purchase_date: purchaseDate || null,
      })
      handleClose()
    } catch (err) {
      setError('Failed to add sprocket. Please try again.')
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Sprocket">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Teeth"
          type="number"
          min="10"
          max="25"
          value={teeth}
          onChange={(e) => setTeeth(e.target.value)}
          placeholder="e.g., 14"
          required
        />

        <Input
          label="Brand (optional)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g., Shimano, SRAM"
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
          <Button type="submit" isLoading={addSprocket.isPending} className="flex-1">
            Add Sprocket
          </Button>
        </div>
      </form>
    </Modal>
  )
}
