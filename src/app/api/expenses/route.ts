import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateRange } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' || 'monthly'
    const date = searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date()

    const { start, end } = getDateRange(period, date)

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        category: true,
        fundingSource: true
      },
      orderBy: {
        date: 'desc',
      },
    })

    const totalExpenses = expenses.reduce((sum: number, expense: { amount: number }) => sum + expense.amount, 0)

    return NextResponse.json({
      expenses,
      totalExpenses,
      period,
      dateRange: { start, end },
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, categoryId, fundingSourceId, date } = body

    if (!amount || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        categoryId,
        fundingSourceId: fundingSourceId || null,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        category: true,
        fundingSource: true
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}
