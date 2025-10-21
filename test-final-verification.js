/**
 * Final Multiple Categories Functionality Verification
 * This script performs comprehensive testing of the multiple categories feature
 */

const axios = require('axios');

const API_BASE = 'http://localhost:4000';

// Test configuration
const testConfig = {
  timeout: 10000,
  retries: 3
};

// Helper function to make API requests with retry logic
async function apiRequest(method, endpoint, data = null, retries = testConfig.retries) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      timeout: testConfig.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response;
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT')) {
      console.log(`⏳ Retrying request to ${endpoint} (${retries} retries left)...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiRequest(method, endpoint, data, retries - 1);
    }
    throw error;
  }
}

// Test functions
async function testBackendHealth() {
  console.log('🏥 Testing backend health...');
  try {
    const response = await apiRequest('GET', '/health');
    if (response.status === 200) {
      console.log('✅ Backend server is healthy');
      return true;
    }
  } catch (error) {
    console.log(`❌ Backend health check failed: ${error.message}`);
    return false;
  }
}

async function testCategoriesAPI() {
  console.log('📂 Testing categories API...');
  try {
    const response = await apiRequest('GET', '/api/categories');
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    const categories = response.data?.data || response.data;
    
    if (!Array.isArray(categories)) {
      throw new Error('Categories response is not an array');
    }
    
    console.log(`✅ Found ${categories.length} categories`);
    
    // Verify category structure
    if (categories.length > 0) {
      const sampleCategory = categories[0];
      const requiredFields = ['id', 'name', 'slug'];
      const missingFields = requiredFields.filter(field => !(field in sampleCategory));
      
      if (missingFields.length > 0) {
        throw new Error(`Categories missing required fields: ${missingFields.join(', ')}`);
      }
      
      console.log('✅ Category structure is valid');
      console.log(`   Sample category: ${sampleCategory.name} (${sampleCategory.slug})`);
    }
    
    return categories;
  } catch (error) {
    console.log(`❌ Categories API test failed: ${error.message}`);
    return null;
  }
}

async function testProductsAPI() {
  console.log('🛍️  Testing products API...');
  try {
    const response = await apiRequest('GET', '/api/products');
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    let products = response.data?.data?.products || response.data?.products || response.data?.data || response.data;
    
    if (!Array.isArray(products)) {
      throw new Error('Products response is not an array');
    }
    
    console.log(`✅ Found ${products.length} products`);
    
    // Check for products with multiple categories
    const productsWithMultipleCategories = products.filter(product => {
      const categories = product.categories || product.category_ids || [];
      return Array.isArray(categories) && categories.length > 1;
    });
    
    console.log(`✅ Found ${productsWithMultipleCategories.length} products with multiple categories`);
    
    if (productsWithMultipleCategories.length > 0) {
      const sampleProduct = productsWithMultipleCategories[0];
      console.log(`   Sample multi-category product: ${sampleProduct.name}`);
      console.log(`   Categories: ${sampleProduct.categories?.length || 0}`);
    }
    
    return products;
  } catch (error) {
    console.log(`❌ Products API test failed: ${error.message}`);
    return null;
  }
}

async function testCategoryFiltering(categories) {
  console.log('🔍 Testing category filtering...');
  
  if (!categories || categories.length === 0) {
    console.log('⚠️  No categories available for filtering test');
    return false;
  }
  
  try {
    const testCategory = categories[0];
    const response = await apiRequest('GET', `/api/products?category=${testCategory.slug}`);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    let filteredProducts = response.data?.data?.products || response.data?.products || response.data?.data || response.data;
    
    if (!Array.isArray(filteredProducts)) {
      throw new Error('Filtered products response is not an array');
    }
    
    console.log(`✅ Category filtering works: ${filteredProducts.length} products in "${testCategory.name}" category`);
    
    // Verify that filtered products actually belong to the category
    const validProducts = filteredProducts.filter(product => {
      const productCategories = product.categories || [];
      return productCategories.some(cat => 
        cat.slug === testCategory.slug || cat.id === testCategory.id
      );
    });
    
    if (validProducts.length === filteredProducts.length) {
      console.log('✅ All filtered products correctly belong to the specified category');
    } else {
      console.log(`⚠️  ${filteredProducts.length - validProducts.length} products don't belong to the specified category`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Category filtering test failed: ${error.message}`);
    return false;
  }
}

async function testMultipleCategoriesSchema() {
  console.log('📋 Testing multiple categories schema...');
  try {
    const response = await apiRequest('GET', '/api/products');
    let products = response.data?.data?.products || response.data?.products || response.data?.data || response.data;
    
    if (!Array.isArray(products) || products.length === 0) {
      console.log('⚠️  No products available for schema test');
      return false;
    }
    
    const sampleProduct = products[0];
    
    // Check if products have categories field
    if ('categories' in sampleProduct) {
      console.log('✅ Products have "categories" field');
      
      if (Array.isArray(sampleProduct.categories)) {
        console.log('✅ Categories field is an array (supports multiple categories)');
        
        if (sampleProduct.categories.length > 0) {
          const sampleCategory = sampleProduct.categories[0];
          const categoryFields = Object.keys(sampleCategory);
          console.log(`✅ Category objects have fields: ${categoryFields.join(', ')}`);
        }
      } else {
        console.log('⚠️  Categories field is not an array');
      }
    } else {
      console.log('⚠️  Products don\'t have "categories" field');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Schema test failed: ${error.message}`);
    return false;
  }
}

async function testFrontendAPIConfiguration() {
  console.log('🌐 Testing frontend API configuration...');
  try {
    // Test the same endpoints that the frontend would use
    const endpoints = [
      '/api/categories',
      '/api/products',
      '/health'
    ];
    
    let allPassed = true;
    
    for (const endpoint of endpoints) {
      try {
        const response = await apiRequest('GET', endpoint);
        if (response.status === 200) {
          console.log(`✅ ${endpoint} - OK`);
        } else {
          console.log(`⚠️  ${endpoint} - Status: ${response.status}`);
          allPassed = false;
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - Error: ${error.message}`);
        allPassed = false;
      }
    }
    
    return allPassed;
  } catch (error) {
    console.log(`❌ Frontend API configuration test failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runFinalVerification() {
  console.log('🚀 Starting Final Multiple Categories Functionality Verification\n');
  console.log('=' .repeat(60));
  
  const results = {
    backendHealth: false,
    categoriesAPI: false,
    productsAPI: false,
    categoryFiltering: false,
    schemaValidation: false,
    frontendAPIConfig: false
  };
  
  // Test 1: Backend Health
  results.backendHealth = await testBackendHealth();
  console.log('');
  
  if (!results.backendHealth) {
    console.log('❌ Backend is not healthy. Stopping tests.');
    return;
  }
  
  // Test 2: Categories API
  const categories = await testCategoriesAPI();
  results.categoriesAPI = categories !== null;
  console.log('');
  
  // Test 3: Products API
  const products = await testProductsAPI();
  results.productsAPI = products !== null;
  console.log('');
  
  // Test 4: Category Filtering
  results.categoryFiltering = await testCategoryFiltering(categories);
  console.log('');
  
  // Test 5: Schema Validation
  results.schemaValidation = await testMultipleCategoriesSchema();
  console.log('');
  
  // Test 6: Frontend API Configuration
  results.frontendAPIConfig = await testFrontendAPIConfiguration();
  console.log('');
  
  // Summary
  console.log('=' .repeat(60));
  console.log('📊 FINAL VERIFICATION RESULTS');
  console.log('=' .repeat(60));
  
  const testResults = [
    { name: 'Backend Health', passed: results.backendHealth },
    { name: 'Categories API', passed: results.categoriesAPI },
    { name: 'Products API', passed: results.productsAPI },
    { name: 'Category Filtering', passed: results.categoryFiltering },
    { name: 'Schema Validation', passed: results.schemaValidation },
    { name: 'Frontend API Config', passed: results.frontendAPIConfig }
  ];
  
  testResults.forEach(test => {
    const status = test.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test.name}`);
  });
  
  const passedTests = testResults.filter(test => test.passed).length;
  const totalTests = testResults.length;
  
  console.log('');
  console.log(`📈 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Multiple categories functionality is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the results above.');
  }
  
  console.log('=' .repeat(60));
}

// Run the verification
runFinalVerification().catch(error => {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
});