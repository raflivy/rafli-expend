'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, DollarSign } from 'lucide-react'

interface FundingSource {
  id: string
  name: string
  type: string
  icon?: string
}

export default function FundingSourceManager() {
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'cash',
    icon: ''
  })

  useEffect(() => {
    fetchFundingSources()
  }, [])

  const fetchFundingSources = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/funding-sources')
      if (response.ok) {
        const data = await response.json()
        setFundingSources(data)
      }
    } catch (error) {
      console.error('Error fetching funding sources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    setFormData({ name: '', type: 'cash', icon: '' })
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (source: FundingSource) => {
    setFormData({
      name: source.name,
      type: source.type,
      icon: source.icon || ''
    })
    setEditingId(source.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let response
      
      if (editingId) {
        // Update existing
        response = await fetch(`/api/funding-sources/${editingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
      } else {
        // Create new
        response = await fetch('/api/funding-sources', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
      }
      
      if (response.ok) {
        setShowForm(false)
        fetchFundingSources()
      } else {
        alert('Gagal menyimpan data')
      }
    } catch (error) {
      console.error('Error saving funding source:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus sumber dana ini?')) return
    
    try {
      const response = await fetch(`/api/funding-sources/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchFundingSources()
      } else {
        alert('Gagal menghapus data')
      }
    } catch (error) {
      console.error('Error deleting funding source:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Sumber Dana</h2>
        <button
          onClick={handleAddNew}
          className="p-2 bg-blue-500 text-white rounded-full"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {fundingSources.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Belum ada sumber dana</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fundingSources.map(source => (
            <div key={source.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                    {source.icon || '💰'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{source.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{source.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(source)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(source.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Sumber Dana' : 'Tambah Sumber Dana'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Kartu Kredit</option>
                  <option value="debit">Kartu Debit</option>
                  <option value="digital">E-Wallet</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Emoji Icon (opsional)
                </label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: 💰 💳 💵"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
