import { useNavigate } from 'react-router-dom'
import { ProfileStep } from '../components/onboarding'

export function Onboarding() {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate('/home', { replace: true })
  }

  return <ProfileStep onNext={handleComplete} />
}
