import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            expenses: true,
          },
        },
      },
    })
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error(`Error fetching category ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PATCH - Update a category
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    const { name, color, icon, budget } = body
    
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        color,
        icon,
        budget: budget ? parseFloat(budget) : 0,
      },
    })
    
    return NextResponse.json(category)
  } catch (error: unknown) {
    console.error(`Error updating category ${params.id}:`, error)
    
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 409 }
        )
      }
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Check if category has expenses
    const expenseCount = await prisma.expense.count({
      where: { categoryId: id },
    })
    
    if (expenseCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing expenses' },
        { status: 400 }
      )
    }
    
    await prisma.category.delete({
      where: { id },
    })
    
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error: unknown) {
    console.error(`Error deleting category ${params.id}:`, error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
