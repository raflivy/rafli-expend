'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Plus, 
  FileText, 
  Settings, 
  LogOut,
  X
} from 'lucide-react'
import AddExpenseForm from '@/components/forms/AddExpenseForm'

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
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
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Dashboard Button */}
            <button
              onClick={() => router.push('/dashboard')}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                pathname === '/dashboard' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Dashboard</span>
            </button>

            {/* Add Button (Center) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </motion.button>

            {/* Reports Button */}
            <button
              onClick={() => router.push('/reports')}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                pathname === '/reports' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Laporan</span>
            </button>
          </div>
        </div>
      </nav>

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
        )}
      </AnimatePresence>
    </div>
  )
}
