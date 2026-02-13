import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout, PageHeader } from '../components/layout'
import { Card, Button, Modal } from '../components/common'
import { UserCard, BikeSetup, DataSharingSettings } from '../components/profile'
import { useAuthStore } from '../store/authStore'
import { APP_VERSION } from '../version'

export function Profile() {
  const navigate = useNavigate()
  const { signOut } = useAuthStore()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSigningOut(false)
      setShowSignOutConfirm(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader title="Profile" />

      <div className="space-y-6">
        <UserCard />
        <BikeSetup />
        <DataSharingSettings />

        {/* About Section */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">About</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Version</span>
              <span className="text-white">{APP_VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Website</span>
              <a
                href="https://www.gearedtotrack.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                gearedtotrack.co.uk
              </a>
            </div>
          </div>
        </Card>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10"
          onClick={() => setShowSignOutConfirm(true)}
        >
          Sign Out
        </Button>
      </div>

      {/* Sign Out Confirmation */}
      <Modal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        title="Sign Out"
        size="sm"
      >
        <p className="text-gray-300 mb-6">Are you sure you want to sign out?</p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowSignOutConfirm(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSignOut}
            isLoading={isSigningOut}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            Sign Out
          </Button>
        </div>
      </Modal>
    </AppLayout>
  )
}
