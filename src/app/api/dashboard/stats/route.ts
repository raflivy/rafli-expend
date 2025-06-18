import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get app settings for monthly budget
    const appSettings = await prisma.appSettings.findFirst({
      where: { id: 'default' },
    })

    // Get total expenses for different periods
    const [todayExpenses, weeklyExpenses, monthlyExpenses, totalExpenses] = await Promise.all([
      prisma.expense.aggregate({
        where: {
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: {
          date: { gte: startOfWeek }
        },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: {
          date: { gte: startOfMonth }
        },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        _sum: { amount: true }
      })
    ])

    const monthlyBudget = appSettings?.monthlyBudget || 5000000
    const monthlySpent = monthlyExpenses._sum.amount || 0
    const remainingBudget = monthlyBudget - monthlySpent

    return NextResponse.json({
      totalExpenses: totalExpenses._sum.amount || 0,
      todayExpenses: todayExpenses._sum.amount || 0,
      weeklyExpenses: weeklyExpenses._sum.amount || 0,
      monthlyExpenses: monthlySpent,
      monthlyBudget,
      remainingBudget,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
