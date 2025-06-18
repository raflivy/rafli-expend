import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password diperlukan' },
        { status: 400 }
      )
    }

    // Get app settings from database
    let appSettings = await prisma.appSettings.findFirst()
    
    // If no settings exist, create default with a hashed password
    if (!appSettings) {
      const defaultPassword = 'admin123' // Default password
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)
      
      appSettings = await prisma.appSettings.create({
        data: {
          passwordHash: hashedPassword,
          monthlyBudget: 0,
          currency: 'IDR'
        }
      })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, appSettings.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Password salah' },
        { status: 401 }
      )
    }

    // Create response with authentication cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('expense-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
