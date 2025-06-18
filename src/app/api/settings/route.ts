import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const appSettings = await prisma.appSettings.findFirst({
      where: { id: 'default' },
      select: {
        id: true,
        monthlyBudget: true,
        currency: true,
        createdAt: true,
        updatedAt: true,
        // Don't return passwordHash for security
      },
    })

    if (!appSettings) {
      return NextResponse.json(
        { error: 'App settings tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(appSettings)
  } catch (error) {
    console.error('Error fetching app settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch app settings' },
      { status: 500 }
    )
  }
}
