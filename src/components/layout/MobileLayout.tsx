'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Plus, 
  Settings, 
  LogOut,
  X,
  Lock,
  Save,
  BarChart3
} from 'lucide-react'
import AddExpenseForm from '@/components/forms/AddExpenseForm'

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleExpenseSuccess = () => {
    // Refresh page data or trigger re-fetch
    window.location.reload()
  }
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg('Password baru dan konfirmasi tidak sama')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })
      
      if (response.ok) {
        alert('Password berhasil diubah!')
        setShowPasswordModal(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const data = await response.json()
        setErrorMsg(data.error || 'Gagal mengubah password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setErrorMsg('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>      {/* Main Content */}
      <main className="max-w-md mx-auto pb-32">
        {children}
      </main>      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 z-50">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-3">
            <div className="flex items-center justify-around">
              {/* Dashboard/Home Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className="relative flex flex-col items-center py-3 px-4 transition-all"
              >
                {/* Benjolan setengah lingkaran di atas */}
                {pathname === '/dashboard' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-6 w-8 h-4 bg-blue-500 rounded-b-full"
                  />
                )}
                <Home className={`w-6 h-6 mb-1 transition-colors ${
                  pathname === '/dashboard' ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <span className={`text-xs font-medium transition-colors ${
                  pathname === '/dashboard' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  Home
                </span>
              </button>

              {/* Add Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="relative flex flex-col items-center py-3 px-4 transition-all"
              >
                {/* Benjolan setengah lingkaran di atas untuk Add */}
                {showAddModal && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-6 w-8 h-4 bg-green-500 rounded-b-full"
                  />
                )}
                <div className="bg-blue-500 p-2 rounded-full mb-1">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-500">
                  Add
                </span>
              </button>

              {/* Reports */}
              <button
                onClick={() => router.push('/reports')}
                className="relative flex flex-col items-center py-3 px-4 transition-all"
              >
                {/* Benjolan setengah lingkaran di atas */}
                {pathname === '/reports' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-6 w-8 h-4 bg-green-500 rounded-b-full"
                  />
                )}
                <BarChart3 className={`w-6 h-6 mb-1 transition-colors ${
                  pathname === '/reports' ? 'text-green-500' : 'text-gray-400'
                }`} />
                <span className={`text-xs font-medium transition-colors ${
                  pathname === '/reports' ? 'text-green-500' : 'text-gray-400'
                }`}>
                  Report
                </span>
              </button>
            </div>

            {/* Settings moved to separate icon in top right corner */}
            <button
              onClick={() => setShowSettings(true)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>      </nav>

      {/* Add Expense Modal */}
      <AddExpenseForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleExpenseSuccess}
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full max-w-md mx-auto bg-white rounded-t-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Pengaturan</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                  <div className="space-y-4">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center space-x-3 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Ganti Password</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full max-w-md mx-auto bg-white rounded-t-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handlePasswordChange} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Ganti Password</h2>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {errorMsg}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
