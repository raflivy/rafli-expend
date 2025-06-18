'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  TrendingDown, 
  PieChart,
  Download,
  Plus,
  Edit,
  Trash2,
  X,
  Save
} from 'lucide-react'
import MobileLayout from '@/components/layout/MobileLayout'
import { formatCurrency } from '@/lib/utils'

interface ReportData {
  period: 'daily' | 'weekly' | 'monthly'
  totalExpenses: number
  categoryBreakdown: {
    name: string
    amount: number
    color: string
    percentage: number
  }[]
  expenses: {
    id: string
    description: string
    amount: number
    category: string
    fundingSource: string
    date: string
  }[]
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
  budget: number
  spent: number
}

interface FundingSource {
  id: string
  name: string
  type: string
  balance: number
  icon: string
}

// Category Form Component
function CategoryForm({ 
  category, 
  onClose, 
  onSave 
}: { 
  category: Category | null
  onClose: () => void
  onSave: (data: Omit<Category, 'id' | 'spent'>) => void
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || '#3B82F6',
    icon: category?.icon || '📁',
    budget: category?.budget || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSave(formData)
    }
  }
  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {category ? 'Edit Kategori' : 'Tambah Kategori'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Kategori
        </label>        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          placeholder="Masukkan nama kategori"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon
        </label>        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          placeholder="🍽️"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Warna
        </label>        <input
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget
        </label>        <input
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          placeholder="0"
          min="0"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >          <Save className="w-4 h-4" />
          <span>{category ? 'Update' : 'Simpan'}</span>
        </button>
      </div>
    </form>
    </div>
  )
}

// Funding Source Form Component
function FundingSourceForm({ 
  fundingSource, 
  onClose, 
  onSave 
}: { 
  fundingSource: FundingSource | null
  onClose: () => void
  onSave: (data: Omit<FundingSource, 'id'>) => void
}) {  const [formData, setFormData] = useState({
    name: fundingSource?.name || '',
    type: fundingSource?.type || 'cash',
    balance: fundingSource?.balance || 0,
    icon: fundingSource?.icon || '🏦'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSave(formData)
    }
  }
  const typeOptions = [
    { value: 'bank', label: 'Bank', icon: '🏦' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'credit', label: 'Credit Card', icon: '💳' },
    { value: 'digital', label: 'Digital Wallet', icon: '📱' }
  ]
  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {fundingSource ? 'Edit Sumber Dana' : 'Tambah Sumber Dana'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Sumber Dana
        </label>        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          placeholder="Masukkan nama sumber dana"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipe
        </label>        <select
          value={formData.type}
          onChange={(e) => {
            const selectedType = e.target.value
            const selectedOption = typeOptions.find(opt => opt.value === selectedType)
            setFormData({ 
              ...formData, 
              type: selectedType,
              icon: selectedOption?.icon || '🏦'
            })
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
        >
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon
        </label>        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          placeholder="🏦"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Saldo
        </label>        <input
          type="number"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          placeholder="0"
          min="0"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >          <Save className="w-4 h-4" />
          <span>{fundingSource ? 'Update' : 'Simpan'}</span>
        </button>
      </div>
    </form>
    </div>
  )
}

// Edit Expense Form Component
function EditExpenseForm({ 
  expenseId, 
  categories,
  fundingSources,
  onClose, 
  onSave 
}: { 
  expenseId: string | null
  categories: Category[]
  fundingSources: FundingSource[]
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    fundingSourceId: '',
    date: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await fetch(`/api/expenses/${expenseId}`)
        if (response.ok) {
          const expense = await response.json()
          setFormData({
            amount: expense.amount.toString(),
            description: expense.description,
            categoryId: expense.categoryId,
            fundingSourceId: expense.fundingSourceId || '',
            date: expense.date.split('T')[0] // Format as YYYY-MM-DD
          })
        }
      } catch (error) {
        console.error('Error fetching expense:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (expenseId) {
      fetchExpenseData()
    }
  }, [expenseId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.description || !formData.categoryId) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          description: formData.description,
          categoryId: formData.categoryId,
          fundingSourceId: formData.fundingSourceId || null,
          date: formData.date
        }),
      })

      if (response.ok) {
        onSave()
      } else {
        alert('Gagal mengupdate pengeluaran')
      }
    } catch (error) {
      console.error('Error updating expense:', error)
      alert('Terjadi kesalahan saat mengupdate pengeluaran')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"
        />
        <p className="text-gray-500 mt-2">Memuat data pengeluaran...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jumlah
        </label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          placeholder="0"
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          placeholder="Masukkan deskripsi pengeluaran"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          required
        >
          <option value="">Pilih kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Funding Source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sumber Dana
        </label>
        <select
          value={formData.fundingSourceId}
          onChange={(e) => setFormData({ ...formData, fundingSourceId: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        >
          <option value="">Pilih sumber dana (opsional)</option>
          {fundingSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.icon} {source.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Update</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showFundingModal, setShowFundingModal] = useState(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingFundingSource, setEditingFundingSource] = useState<FundingSource | null>(null)
  useEffect(() => {
    fetchReportData()
    fetchCategories()
    fetchFundingSources()    // Log modal state for debugging
    console.log('Category modal open:', showCategoryModal)
    console.log('Funding modal open:', showFundingModal)
    console.log('Editing expense:', editingExpense)    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, selectedDate, showCategoryModal, showFundingModal, editingExpense])
  const fetchReportData = async () => {
    try {
      setIsLoading(true)
      
      // Get date range based on selected period and date
      const { startDate, endDate } = getDateRange(selectedPeriod, selectedDate)
      
      // Fetch expenses for the period
      const expensesResponse = await fetch(`/api/reports/expenses?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      const expensesData = await expensesResponse.json()
      
      // Fetch category breakdown for the period
      const categoryResponse = await fetch(`/api/reports/category-breakdown?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      const categoryData = await categoryResponse.json()
      
      const totalExpenses = expensesData.reduce((sum: number, expense: { amount: number }) => sum + expense.amount, 0)
      
      setReportData({
        period: selectedPeriod,
        totalExpenses,
        categoryBreakdown: categoryData,
        expenses: expensesData
      })
    } catch (error) {
      console.error('Error fetching report data:', error)} finally {
      setIsLoading(false)
    }
  }

  const getDateRange = (period: 'daily' | 'weekly' | 'monthly', date: Date) => {
    const startDate = new Date(date)
    const endDate = new Date(date)

    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'weekly':
        const dayOfWeek = startDate.getDay()
        startDate.setDate(startDate.getDate() - dayOfWeek)
        startDate.setHours(0, 0, 0, 0)
        endDate.setDate(startDate.getDate() + 6)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'monthly':
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        endDate.setMonth(endDate.getMonth() + 1, 0)
        endDate.setHours(23, 59, 59, 999)
        break
    }

    return { startDate, endDate }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()        // Convert API response to match our interface
        const categoriesWithSpent = data.map((cat: { id: string; name: string; color: string; icon: string; budget: number; _count?: { expenses: number } }) => ({
          id: cat.id,
          name: cat.name,
          color: cat.color,
          icon: cat.icon,
          budget: cat.budget,
          spent: cat._count?.expenses || 0 // This is just expense count, not actual spent amount
        }))
        setCategories(categoriesWithSpent)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFundingSources = async () => {
    try {
      const response = await fetch('/api/funding-sources')
      if (response.ok) {
        const data = await response.json()
        setFundingSources(data)
      }
    } catch (error) {
      console.error('Error fetching funding sources:', error)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      // Simulate API call
      if (reportData) {
        const updatedExpenses = reportData.expenses.filter(expense => expense.id !== id)
        setReportData({
          ...reportData,
          expenses: updatedExpenses
        })
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }
  const handleEditExpense = (id: string) => {
    setEditingExpense(id)
    setShowEditExpenseModal(true)
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowCategoryModal(true)
  }
  const handleDeleteCategory = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setCategories(categories.filter(cat => cat.id !== id))
        } else {
          alert('Gagal menghapus kategori')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Terjadi kesalahan saat menghapus kategori')
      }
    }
  }

  const handleAddFundingSource = () => {
    setEditingFundingSource(null)
    setShowFundingModal(true)
  }

  const handleEditFundingSource = (source: FundingSource) => {
    setEditingFundingSource(source)
    setShowFundingModal(true)
  }
  const handleDeleteFundingSource = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus sumber dana ini?')) {
      try {
        const response = await fetch(`/api/funding-sources/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setFundingSources(fundingSources.filter(source => source.id !== id))
        } else {
          alert('Gagal menghapus sumber dana')
        }
      } catch (error) {
        console.error('Error deleting funding source:', error)
        alert('Terjadi kesalahan saat menghapus sumber dana')
      }
    }
  }

  const downloadPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      
      // Create a new jsPDF instance
      const pdf = new jsPDF()
      
      // Add title
      pdf.setFontSize(20)
      pdf.text('Laporan Pengeluaran', 20, 30)
      
      // Add period info
      pdf.setFontSize(12)
      pdf.text(`Periode: ${periodLabels[selectedPeriod]}`, 20, 50)
      
      if (reportData) {
        // Add total expenses
        pdf.text(`Total Pengeluaran: ${formatCurrency(reportData.totalExpenses)}`, 20, 70)
        
        // Add category breakdown
        pdf.setFontSize(16)
        pdf.text('Breakdown Kategori:', 20, 100)
        
        let yPos = 120
        reportData.categoryBreakdown.forEach((category) => {
          pdf.setFontSize(10)
          pdf.text(`${category.name}: ${formatCurrency(category.amount)} (${category.percentage}%)`, 25, yPos)
          yPos += 15
        })
        
        // Add expenses detail
        if (reportData.expenses.length > 0) {
          yPos += 20
          pdf.setFontSize(16)
          pdf.text('Detail Pengeluaran:', 20, yPos)
          yPos += 20
          
          reportData.expenses.forEach((expense) => {
            pdf.setFontSize(10)
            pdf.text(`${expense.date} - ${expense.description}`, 25, yPos)
            pdf.text(`${expense.category} - ${formatCurrency(expense.amount)}`, 25, yPos + 10)
            yPos += 25
          })
        }
      }
      
      // Save the PDF
      pdf.save(`laporan-pengeluaran-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Gagal menggenerate PDF. Silakan coba lagi.')
    }
  }

  const periodLabels = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan'
  }

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <button 
            onClick={downloadPDF}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>        {/* Period Selector and Date Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Filter Laporan</span>
          </div>
          
          <div className="space-y-4">
            {/* Period Toggle */}
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {periodLabels[period]}
                </button>
              ))}
            </div>
            
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Tanggal
              </label>              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-100">Total Pengeluaran {periodLabels[selectedPeriod]}</span>
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">
            {reportData ? formatCurrency(reportData.totalExpenses) : '-'}
          </p>
        </motion.div>        {/* Expense Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Detail Pengeluaran {periodLabels[selectedPeriod]}</h3>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          
          {reportData && reportData.expenses.length > 0 ? (
            <div className="space-y-3">
              {reportData.expenses.map((expense, index) => (                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{expense.description}</p>
                      <div className="flex flex-wrap items-center gap-1 mt-1 text-sm text-gray-500">
                        <span className="truncate">{expense.category}</span>
                        <span>•</span>
                        <span className="truncate">{expense.fundingSource}</span>
                        <span>•</span>
                        <span className="whitespace-nowrap">{expense.date}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 flex-shrink-0">
                      <div className="text-right">
                        <span className="font-semibold text-red-600 text-sm whitespace-nowrap">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons in separate row for better mobile layout */}
                  <div className="flex justify-end space-x-2 mt-3 pt-2 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditExpense(expense.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors group text-sm"
                      title="Edit pengeluaran"
                    >
                      <Edit className="w-3.5 h-3.5 text-blue-600 group-hover:text-blue-700" />
                      <span className="text-blue-600 group-hover:text-blue-700 font-medium">Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-md transition-colors group text-sm"
                      title="Hapus pengeluaran"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600 group-hover:text-red-700" />
                      <span className="text-red-600 group-hover:text-red-700 font-medium">Hapus</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada pengeluaran pada periode ini</p>
            </div>
          )}
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Breakdown Kategori</h3>
            <PieChart className="w-5 h-5 text-purple-500" />
          </div>
          
          {reportData && (
            <div className="space-y-4">
              {reportData.categoryBreakdown.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(category.amount)}
                    </p>
                    <p className="text-sm text-gray-500">{category.percentage}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Category Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Manajemen Kategori</h3>            <button
              onClick={handleAddCategory}
              className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{category.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Budget: {formatCurrency(category.budget)}</span>
                      <span>•</span>
                      <span className={
                        category.spent > category.budget ? 'text-red-500' : 'text-green-500'
                      }>
                        Terpakai: {formatCurrency(category.spent)}
                      </span>
                    </div>
                  </div>
                </div>                <div className="flex items-center space-x-2">                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>        {/* Funding Sources Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Manajemen Sumber Dana</h3>            <button
              onClick={handleAddFundingSource}
              className="flex items-center space-x-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {fundingSources.map((source, index) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{source.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{source.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="capitalize">{source.type}</span>
                      <span>•</span>
                      <span className="text-green-600 font-medium">
                        Saldo: {formatCurrency(source.balance)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">                  <button 
                    onClick={() => handleEditFundingSource(source)}
                    className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteFundingSource(source.id)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>        </motion.div>
      </div>      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
            onClick={() => setShowCategoryModal(false)}
          >
            {/* Background blur overlay for main content */}
            <div className="absolute inset-0 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full max-w-md mx-auto bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto relative z-10"
              onClick={(e) => e.stopPropagation()}
            ><CategoryForm 
                category={editingCategory}
                onClose={() => setShowCategoryModal(false)}                onSave={async (categoryData) => {
                  try {
                    if (editingCategory) {
                      // Edit existing category
                      const response = await fetch(`/api/categories/${editingCategory.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(categoryData),
                      })
                      
                      if (response.ok) {
                        const updatedCategory = await response.json()
                        setCategories(categories.map(cat => 
                          cat.id === editingCategory.id ? { ...cat, ...updatedCategory } : cat
                        ))
                      } else {
                        alert('Gagal mengupdate kategori')
                        return
                      }
                    } else {
                      // Add new category
                      const response = await fetch('/api/categories', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(categoryData),
                      })
                      
                      if (response.ok) {
                        const newCategory = await response.json()
                        setCategories([...categories, { ...newCategory, spent: 0 }])
                      } else {
                        alert('Gagal menambahkan kategori')
                        return
                      }
                    }
                    
                    setShowCategoryModal(false)
                    setEditingCategory(null)
                    // Remove the refresh and just update local state
                  } catch (error) {
                    console.error('Error saving category:', error)
                    alert('Terjadi kesalahan saat menyimpan kategori')
                  }
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Funding Source Modal */}
      <AnimatePresence>
        {showFundingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
            onClick={() => setShowFundingModal(false)}
          >
            {/* Background blur overlay for main content */}
            <div className="absolute inset-0 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full max-w-md mx-auto bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto relative z-10"
              onClick={(e) => e.stopPropagation()}
            ><FundingSourceForm 
                fundingSource={editingFundingSource}
                onClose={() => setShowFundingModal(false)}                onSave={async (sourceData) => {
                  try {
                    if (editingFundingSource) {
                      // Edit existing funding source
                      const response = await fetch(`/api/funding-sources/${editingFundingSource.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(sourceData),
                      })
                      
                      if (response.ok) {
                        const updatedSource = await response.json()
                        setFundingSources(fundingSources.map(source => 
                          source.id === editingFundingSource.id ? { ...source, ...updatedSource } : source
                        ))
                      } else {
                        alert('Gagal mengupdate sumber dana')
                        return
                      }
                    } else {
                      // Add new funding source
                      const response = await fetch('/api/funding-sources', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(sourceData),
                      })
                      
                      if (response.ok) {
                        const newSource = await response.json()
                        setFundingSources([...fundingSources, newSource])
                      } else {
                        alert('Gagal menambahkan sumber dana')
                        return
                      }
                    }
                    
                    setShowFundingModal(false)
                    setEditingFundingSource(null)
                    // Remove refresh and just update local state
                  } catch (error) {
                    console.error('Error saving funding source:', error)
                    alert('Terjadi kesalahan saat menyimpan sumber dana')
                  }
                }}
              />
            </motion.div>
          </motion.div>        )}
      </AnimatePresence>      {/* Edit Expense Modal */}
      <AnimatePresence>
        {showEditExpenseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
            onClick={() => setShowEditExpenseModal(false)}
          >
            {/* Background blur overlay for main content */}
            <div className="absolute inset-0 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full max-w-md mx-auto bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto relative z-10"
              onClick={(e) => e.stopPropagation()}
            >              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Pengeluaran</h3>
                  <button
                    onClick={() => setShowEditExpenseModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <EditExpenseForm 
                  expenseId={editingExpense}
                  categories={categories}
                  fundingSources={fundingSources}
                  onClose={() => setShowEditExpenseModal(false)}
                  onSave={async () => {
                    setShowEditExpenseModal(false)
                    setEditingExpense(null)
                    // Refresh report data
                    fetchReportData()
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileLayout>
  )
}
