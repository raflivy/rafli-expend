import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch specific expense
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
        fundingSource: true
      }
    })
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error fetching expense:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expense' },
      { status: 500 }
    )
  }
}

// PATCH - Update an expense
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { amount, description, categoryId, fundingSourceId, date } = body
    
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        description,
        categoryId,
        fundingSourceId: fundingSourceId || null,
        date: date ? new Date(date) : undefined
      },
      include: {
        category: true,
        fundingSource: true
      }
    })
    
    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.expense.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
}
