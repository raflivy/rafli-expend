import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function initializeAppSettings() {
  try {
    console.log('🔧 Initializing app settings...')

    // Check if app settings exist
    const existing = await prisma.appSettings.findFirst({
      where: { id: 'default' },
    })

    if (existing) {
      console.log('✅ App settings already exist')
      console.log('Current settings:', {
        id: existing.id,
        monthlyBudget: existing.monthlyBudget,
        currency: existing.currency,
        hasPassword: !!existing.passwordHash,
      })
      return
    }

    // Create default app settings
    const defaultPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    const appSettings = await prisma.appSettings.create({
      data: {
        id: 'default',
        passwordHash: hashedPassword,
        monthlyBudget: 5000000, // 5 million IDR
        currency: 'IDR',
      },
    })

    console.log('✅ App settings created successfully!')
    console.log('Settings:', {
      id: appSettings.id,
      monthlyBudget: appSettings.monthlyBudget,
      currency: appSettings.currency,
      defaultPassword: defaultPassword,
    })
    console.log('⚠️  Remember to change the default password!')

  } catch (error) {
    console.error('❌ Error initializing app settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initializeAppSettings()
