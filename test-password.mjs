import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma.js'

async function testPassword() {
  try {
    console.log('🔍 Testing password authentication...')
    
    // Get app settings from database
    const appSettings = await prisma.appSettings.findFirst()
    
    if (!appSettings) {
      console.log('❌ No app settings found in database')
      return
    }
    
    console.log('✅ App settings found:', {
      id: appSettings.id,
      currency: appSettings.currency,
      monthlyBudget: appSettings.monthlyBudget,
      passwordHashLength: appSettings.passwordHash.length
    })
    
    // Test password 'admin123'
    const testPassword = 'admin123'
    const isValid = await bcrypt.compare(testPassword, appSettings.passwordHash)
    
    console.log(`🔐 Password test for "${testPassword}":`, isValid ? '✅ VALID' : '❌ INVALID')
    
    // Test some other passwords
    const wrongPassword = 'wrong123'
    const isInvalid = await bcrypt.compare(wrongPassword, appSettings.passwordHash)
    console.log(`🔐 Password test for "${wrongPassword}":`, isInvalid ? '✅ VALID' : '❌ INVALID')
    
  } catch (error) {
    console.error('❌ Error testing password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPassword()
