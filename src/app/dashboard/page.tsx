'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingDown, 
  Calendar,
  Wallet,
  PieChart as PieChartIcon
} from 'lucide-react'
import MobileLayout from '@/components/layout/MobileLayout'
import { formatCurrency } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

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

interface CategoryExpense {
  name: string
  amount: number
  color: string
  percentage: number
}

export default function Dashboard() {  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    todayExpenses: 0,
    weeklyExpenses: 0,
    monthlyExpenses: 0,
    monthlyBudget: 0,
    remainingBudget: 0,
  })
  const [recentExpenses, setRecentExpenses] = useState<RecentExpense[]>([])
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch stats
      const statsResponse = await fetch('/api/dashboard/stats')
      const statsData = await statsResponse.json()
      setStats(statsData)
      
      // Fetch recent expenses
      const recentResponse = await fetch('/api/dashboard/recent-expenses')
      const recentData = await recentResponse.json()
      setRecentExpenses(recentData)
      
      // Fetch category expenses
      const categoryResponse = await fetch('/api/dashboard/category-expenses')
      const categoryData = await categoryResponse.json()
      setCategoryExpenses(categoryData)
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
          <h2 className="text-lg font-semibold mb-2">Hi rafli, how's life!?</h2>
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
              <span className={`font-medium ${
                budgetPercentage > 80 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatCurrency(stats.monthlyExpenses)}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className={`h-3 rounded-full ${
                  stats.remainingBudget < stats.monthlyBudget * 0.2 // Jika sisa kurang dari 20% budget
                    ? 'bg-red-500' 
                    : stats.remainingBudget < stats.monthlyBudget * 0.5 // Jika sisa kurang dari 50% budget
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sisa</span>
              <span className={`font-medium ${
                stats.remainingBudget < stats.monthlyBudget * 0.2
                  ? 'text-red-600' 
                  : stats.remainingBudget < stats.monthlyBudget * 0.5
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {formatCurrency(stats.remainingBudget)}
              </span>
            </div>
          </div>
        </motion.div>        {/* Pie Chart of Expenses by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pengeluaran per Kategori</h3>
            <PieChartIcon className="w-5 h-5 text-purple-500" />
          </div>
          
          {categoryExpenses.length > 0 ? (
            <>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryExpenses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="name"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {categoryExpenses.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span 
                      className={`text-sm font-semibold ${
                        stats.monthlyBudget > 0 && 
                        category.amount / stats.monthlyBudget > 0.8 ? 'text-red-600' : 'text-gray-900'
                      }`}
                    >
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PieChartIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Tidak ada data kategori</p>
            </div>
          )}
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pengeluaran Terbaru</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
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
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada pengeluaran terbaru</p>
            </div>
          )}
        </motion.div>        {/* Footer Space */}
        <div className="h-4"></div>
      </div>
    </MobileLayout>
  )
}
