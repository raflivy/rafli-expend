import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    // Get category expenses for the period
    const categoryExpenses = await prisma.category.findMany({
      include: {
        expenses: {
          where: {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          select: {
            amount: true,
          },
        },
      },
    })

    // Calculate total expenses for percentage calculation
    const totalExpenses = await prisma.expense.aggregate({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      _sum: { amount: true },
    })

    const total = totalExpenses._sum.amount || 0

    // Transform data for breakdown
    const breakdown = categoryExpenses
      .map(category => {
        const categoryTotal = category.expenses.reduce((sum, expense) => sum + expense.amount, 0)
        return {
          name: category.name,
          amount: categoryTotal,
          color: category.color,
          percentage: total > 0 ? Math.round((categoryTotal / total) * 100) : 0,
        }
      })
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)

    return NextResponse.json(breakdown)
  } catch (error) {
    console.error('Error fetching category breakdown for reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category breakdown' },
      { status: 500 }
    )
  }
}
