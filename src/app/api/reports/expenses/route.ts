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

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
            icon: true,
          },
        },
        fundingSource: {
          select: {
            name: true,
            type: true,
            icon: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Transform data to match frontend interface
    const transformedExpenses = expenses.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      category: expense.category.name,
      fundingSource: expense.fundingSource?.name || 'Unknown',
      date: expense.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
    }))

    return NextResponse.json(transformedExpenses)
  } catch (error) {
    console.error('Error fetching expenses for reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}
