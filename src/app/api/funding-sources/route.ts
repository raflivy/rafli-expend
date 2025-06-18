import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all funding sources
export async function GET() {
  try {
    const fundingSources = await prisma.fundingSource.findMany({
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(fundingSources)
  } catch (error) {
    console.error('Error fetching funding sources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch funding sources' },
      { status: 500 }
    )
  }
}

// POST - Create a new funding source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, balance, icon } = body
    
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }
    
    const fundingSource = await prisma.fundingSource.create({
      data: {
        name,
        type,
        balance: balance || 0,
        icon: icon || getDefaultIcon(type)
      }
    })
    
    return NextResponse.json(fundingSource, { status: 201 })  } catch (error: unknown) {
    console.error('Error creating funding source:', error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Funding source with this name already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create funding source' },
      { status: 500 }
    )
  }
}

function getDefaultIcon(type: string): string {
  switch (type) {
    case 'bank':
      return '🏦'
    case 'cash':
      return '💵'
    case 'credit':
      return '💳'
    default:
      return '💰'
  }
}
