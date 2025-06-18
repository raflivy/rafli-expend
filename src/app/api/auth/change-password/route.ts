import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Password saat ini dan password baru diperlukan' },
        { status: 400 }
      )
    }

    // Get app settings which contains the password hash
    const appSettings = await prisma.appSettings.findFirst({
      where: { id: 'default' },
    })

    if (!appSettings) {
      return NextResponse.json(
        { error: 'App settings tidak ditemukan. Silakan hubungi administrator.' },
        { status: 404 }
      )
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      appSettings.passwordHash
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Password saat ini salah' },
        { status: 401 }
      )
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.appSettings.update({
      where: { id: 'default' },
      data: { passwordHash: newPasswordHash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
