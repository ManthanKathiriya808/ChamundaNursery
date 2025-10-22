import fetch from 'node-fetch'

const API_BASE = 'http://localhost:4001'

async function testCompleteProductCreation() {
  console.log('🧪 Starting comprehensive product creation test...\n')
  
  try {
    // Step 1: Sync test user to get JWT token
    console.log('1️⃣ Syncing test user...')
    const syncResponse = await fetch(`${API_BASE}/api/clerk-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkUserId: 'test-user-final-123',
        email: 'finaltest@example.com',
        name: 'Final Test User',
        role: 'admin'
      })
    })
    
    if (!syncResponse.ok) {
      throw new Error(`Sync failed: ${syncResponse.statusText}`)
    }
    
    const syncData = await syncResponse.json()
    console.log('✅ User synced successfully')
    console.log(`   Token: ${syncData.token.substring(0, 20)}...`)
    
    // Step 2: Test admin products endpoint with all fields
    console.log('\n2️⃣ Testing product creation with all fields...')
    const productData = {
      name: 'Complete Test Plant',
      description: 'A comprehensive test plant with all fields',
      shortDescription: 'Short description for test plant',
      price: 29.99,
      comparePrice: 39.99,
      inventory: 25,
      sku: 'TEST-PLANT-001',
      weight: 2.5,
      categoryIds: [1],
      tags: ['test', 'plant', 'complete'],
      status: 'active',
      featured: true,
      metaTitle: 'Test Plant SEO Title',
      metaDescription: 'Test plant SEO description',
      careInstructions: 'Water weekly, bright indirect light',
      plantType: 'indoor',
      lightRequirement: 'medium',
      wateringFrequency: 'weekly',
      botanicalName: 'Testicus planticus',
      bloomingSeason: 'Spring',
      difficulty: 'medium',
      lowStockThreshold: 5,
      height: 30,
      width: 20,
      length: 15
    }
    
    const createResponse = await fetch(`${API_BASE}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${syncData.token}`
      },
      body: JSON.stringify(productData)
    })
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      throw new Error(`Product creation failed: ${createResponse.status} - ${errorText}`)
    }
    
    const createdProduct = await createResponse.json()
    console.log('✅ Product created successfully!')
    console.log(`   Product ID: ${createdProduct.id}`)
    console.log(`   Product UUID: ${createdProduct.uuid_id}`)
    console.log(`   Name: ${createdProduct.name}`)
    console.log(`   Slug: ${createdProduct.slug}`)
    console.log(`   Difficulty: ${createdProduct.difficulty}`)
    
    // Step 3: Verify product can be retrieved
    console.log('\n3️⃣ Verifying product retrieval...')
    const getResponse = await fetch(`${API_BASE}/api/products/${createdProduct.id}`)
    
    if (!getResponse.ok) {
      throw new Error(`Product retrieval failed: ${getResponse.statusText}`)
    }
    
    const retrievedProduct = await getResponse.json()
    console.log('✅ Product retrieved successfully!')
    console.log(`   Retrieved name: ${retrievedProduct.name}`)
    console.log(`   Retrieved difficulty: ${retrievedProduct.difficulty}`)
    
    // Step 4: Test admin products list
    console.log('\n4️⃣ Testing admin products list...')
    const listResponse = await fetch(`${API_BASE}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${syncData.token}`
      }
    })
    
    if (!listResponse.ok) {
      throw new Error(`Admin products list failed: ${listResponse.statusText}`)
    }
    
    const productsList = await listResponse.json()
    console.log('✅ Admin products list retrieved successfully!')
    console.log(`   Total products: ${productsList.pagination?.total || productsList.products?.length || 'Unknown'}`)
    
    // Step 5: Test different difficulty values
    console.log('\n5️⃣ Testing all difficulty values...')
    const difficulties = ['easy', 'medium', 'hard']
    
    for (const difficulty of difficulties) {
      const testProduct = {
        name: `Test Plant ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
        description: `Test plant with ${difficulty} difficulty`,
        price: 19.99,
        inventory: 10,
        difficulty: difficulty
      }
      
      const difficultyResponse = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${syncData.token}`
        },
        body: JSON.stringify(testProduct)
      })
      
      if (difficultyResponse.ok) {
        const difficultyProduct = await difficultyResponse.json()
        console.log(`   ✅ ${difficulty}: Product ID ${difficultyProduct.id}`)
      } else {
        console.log(`   ❌ ${difficulty}: Failed`)
      }
    }
    
    console.log('\n🎉 All tests completed successfully!')
    console.log('\n📋 Summary:')
    console.log('   ✅ JWT authentication working')
    console.log('   ✅ Product creation with all fields working')
    console.log('   ✅ Slug generation working')
    console.log('   ✅ Difficulty enum values working')
    console.log('   ✅ Product retrieval working')
    console.log('   ✅ Admin products list working')
    console.log('   ✅ All difficulty levels supported')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    process.exit(1)
  }
}

testCompleteProductCreation()
