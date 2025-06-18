import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get category expenses for current month
    const categoryExpenses = await prisma.category.findMany({
      include: {
        expenses: {
          where: {
            date: { gte: startOfMonth }
          },
          select: {
            amount: true
          }
        }
      }
    })

    // Calculate total monthly expenses for percentage calculation
    const totalMonthlyExpenses = await prisma.expense.aggregate({
      where: {
        date: { gte: startOfMonth }
      },
      _sum: { amount: true }
    })

    const total = totalMonthlyExpenses._sum.amount || 0

    // Transform data for chart
    const chartData = categoryExpenses
      .map(category => {
        const categoryTotal = category.expenses.reduce((sum, expense) => sum + expense.amount, 0)
        return {
          name: category.name,
          amount: categoryTotal,
          color: category.color,
          percentage: total > 0 ? Math.round((categoryTotal / total) * 100) : 0
        }
      })
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching category expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category expenses' },
      { status: 500 }
    )
  }
}
