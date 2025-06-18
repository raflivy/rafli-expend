import bcrypt from 'bcryptjs'

async function testPassword() {
  const password = 'admin123'
  
  // Test 1: Generate hash dan test
  console.log('Testing password hashing...')
  const hash = await bcrypt.hash(password, 10)
  console.log('Generated hash:', hash)
  
  const isValid = await bcrypt.compare(password, hash)
  console.log('Password validation:', isValid)
  
  // Test 2: Test dengan hash yang mungkin ada di database
  const testHashes = [
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Hash untuk "password"
    '$2b$10$8.8z8z8z8z8z8z8z8z8z8e8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z', // Contoh hash
  ]
  
  console.log('\nTesting against different hashes:')
  for (const testHash of testHashes) {
    try {
      const result = await bcrypt.compare(password, testHash)
      console.log(`Hash ${testHash.substring(0, 20)}... -> ${result}`)
    } catch (error) {
      console.log(`Hash ${testHash.substring(0, 20)}... -> ERROR: ${error.message}`)
    }
  }
}

testPassword().catch(console.error)
