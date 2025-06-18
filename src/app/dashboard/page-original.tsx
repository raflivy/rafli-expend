'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Wallet,
  PieChart
} from 'lucide-react'
import MobileLayout from '@/components/layout/MobileLayout'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalExpenses: number
  todayExpenses: number
  weeklyExpenses: number
  monthlyExpenses: number
  monthlyBudget: number
  remainingBudget: number
}

interface RecentExpense {
  id: string
  amount: number
  description: string
  category: {
    name: string
    color: string
    icon: string
  }
  date: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    todayExpenses: 0,
    weeklyExpenses: 0,
    monthlyExpenses: 0,
    monthlyBudget: 0,
    remainingBudget: 0,
  })
  const [recentExpenses, setRecentExpenses] = useState<RecentExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Simulate API call - replace with actual API calls
      setStats({
        totalExpenses: 2850000,
        todayExpenses: 125000,
        weeklyExpenses: 750000,
        monthlyExpenses: 2850000,
        monthlyBudget: 5000000,
        remainingBudget: 2150000,
      })
      
      setRecentExpenses([
        {
          id: '1',
          amount: 25000,
          description: 'Makan siang',
          category: {
            name: 'Makanan',
            color: '#F59E0B',
            icon: 'UtensilsCrossed'
          },
          date: '2025-06-18T12:00:00Z'
        },
        {
          id: '2',
          amount: 100000,
          description: 'Bensin motor',
          category: {
            name: 'Transportasi',
            color: '#3B82F6',
            icon: 'Car'
          },
          date: '2025-06-18T09:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const budgetPercentage = stats.monthlyBudget > 0 
    ? (stats.monthlyExpenses / stats.monthlyBudget) * 100 
    : 0

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
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
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <h2 className="text-lg font-semibold mb-2">Selamat datang kembali!</h2>
          <p className="text-blue-100 text-sm">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Hari ini</span>
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(stats.todayExpenses)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Minggu ini</span>
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(stats.weeklyExpenses)}
            </p>
          </motion.div>
        </div>

        {/* Monthly Budget Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Budget Bulanan</h3>
            <Wallet className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Terpakai</span>
              <span className="font-medium">{formatCurrency(stats.monthlyExpenses)}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className={`h-3 rounded-full ${
                  budgetPercentage > 90 
                    ? 'bg-red-500' 
                    : budgetPercentage > 70 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sisa</span>
              <span className={`font-medium ${
                stats.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(stats.remainingBudget)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pengeluaran Terbaru</h3>
            <PieChart className="w-5 h-5 text-purple-500" />
          </div>
          
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${expense.category.color}20` }}
                    >
                      <span className="text-lg">🍽️</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-500">{expense.category.name}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-red-600">
                    -{formatCurrency(expense.amount)}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada pengeluaran hari ini</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <DollarSign className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">Tambah Kategori</p>
          </button>
          
          <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">Lihat Laporan</p>
          </button>
        </motion.div>
      </div>
    </MobileLayout>
  )
}
