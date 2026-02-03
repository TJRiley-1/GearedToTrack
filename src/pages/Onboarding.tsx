import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileStep, DataSharingStep } from '../components/onboarding'

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const handleProfileComplete = () => {
    setStep(2)
  }

  const handleDataSharingComplete = () => {
    navigate('/home', { replace: true })
  }

  const handleBack = () => {
    setStep(1)
  }

  if (step === 1) {
    return <ProfileStep onNext={handleProfileComplete} />
  }

  return (
    <DataSharingStep
      onComplete={handleDataSharingComplete}
      onBack={handleBack}
    />
  )
}
