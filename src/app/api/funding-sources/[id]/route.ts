import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch specific funding source
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const fundingSource = await prisma.fundingSource.findUnique({
      where: { id }
    })
    
    if (!fundingSource) {
      return NextResponse.json(
        { error: 'Funding source not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(fundingSource)
  } catch (error) {
    console.error(`Error fetching funding source ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch funding source' },
      { status: 500 }
    )
  }
}

// PATCH - Update a funding source
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    const { name, type, balance, icon } = body
    
    const fundingSource = await prisma.fundingSource.update({
      where: { id },
      data: {
        name,
        type,
        balance,
        icon
      }
    })
    
    return NextResponse.json(fundingSource)
  } catch (error) {
    console.error(`Error updating funding source ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to update funding source' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a funding source
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    await prisma.fundingSource.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting funding source ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete funding source' },
      { status: 500 }
    )
  }
}
