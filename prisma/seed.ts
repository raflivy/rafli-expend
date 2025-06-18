import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default app settings
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const appSettings = await prisma.appSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      passwordHash: hashedPassword,
      monthlyBudget: 5000000, // Default 5 million IDR
      currency: 'IDR'
    }
  })
    console.log('✅ App settings created:', appSettings)

  // Create default categories
  const categories = [
    { name: 'Makanan', color: '#F59E0B', icon: '🍽️', budget: 1500000 },
    { name: 'Transportasi', color: '#3B82F6', icon: '🚗', budget: 1000000 },
    { name: 'Belanja', color: '#EF4444', icon: '🛍️', budget: 600000 },
    { name: 'Hiburan', color: '#10B981', icon: '🎬', budget: 400000 },
    { name: 'Kesehatan', color: '#8B5CF6', icon: '⚕️', budget: 500000 },
    { name: 'Pendidikan', color: '#F97316', icon: '📚', budget: 300000 },
    { name: 'Rumah Tangga', color: '#06B6D4', icon: '🏠', budget: 800000 },
    { name: 'Lainnya', color: '#6B7280', icon: '📦', budget: 200000 }
  ]
    // Create default funding sources
  const fundingSources = [
    { name: 'Cash', type: 'cash', balance: 500000, icon: '💵' },
    { name: 'Kartu Kredit', type: 'credit', balance: 5000000, icon: '💳' },
    { name: 'Debit BCA', type: 'bank', balance: 2000000, icon: '🏦' },
    { name: 'E-Wallet Dana', type: 'bank', balance: 1000000, icon: '📱' }
  ]
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
    console.log(`✅ Category created: ${created.name}`)
  }
  
  for (const source of fundingSources) {
    const created = await prisma.fundingSource.upsert({
      where: { name: source.name },
      update: {},
      create: source
    })
    console.log(`✅ Funding source created: ${created.name}`)
  }

  // Create sample expenses for demonstration
  const foodCategory = await prisma.category.findUnique({ where: { name: 'Makanan' } })
  const transportCategory = await prisma.category.findUnique({ where: { name: 'Transportasi' } })
  
  if (foodCategory && transportCategory) {
    const sampleExpenses = [
      {
        amount: 25000,
        description: 'Makan siang di warung',
        categoryId: foodCategory.id,
        date: new Date()
      },
      {
        amount: 100000,
        description: 'Bensin motor',
        categoryId: transportCategory.id,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        amount: 15000,
        description: 'Kopi pagi',
        categoryId: foodCategory.id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ]

    for (const expense of sampleExpenses) {
      const created = await prisma.expense.create({
        data: expense,
        include: { category: true }
      })
      console.log(`✅ Sample expense created: ${created.description} - ${created.amount}`)
    }
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
