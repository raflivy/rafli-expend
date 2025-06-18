import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const recentExpenses = await prisma.expense.findMany({
      take: 10,
      orderBy: {
        date: 'desc',
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
    })

    return NextResponse.json(recentExpenses)
  } catch (error) {
    console.error('Error fetching recent expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent expenses' },
      { status: 500 }
    )
  }
}
