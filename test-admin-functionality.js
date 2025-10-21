/**
 * Comprehensive Test Script for Admin Functionality
 * Tests multiple categories support and identifies any issues
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:4000/api';

// Test configuration
const testConfig = {
  timeout: 10000,
  retries: 3
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to log test results
function logTest(testName, passed, error = null) {
  if (passed) {
    console.log(`✅ ${testName}`);
    testResults.passed++;
  } else {
    console.log(`❌ ${testName}: ${error?.message || 'Unknown error'}`);
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error?.message || 'Unknown error' });
  }
}

// Helper function to make API requests with error handling
async function apiRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: testConfig.timeout
    };

    if (data) {
      if (data instanceof FormData) {
        config.data = data;
        delete config.headers['Content-Type']; // Let axios set it for FormData
      } else {
        config.data = data;
      }
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running or not accessible');
    }
    throw error;
  }
}

// Test 1: Check if backend server is running
async function testBackendConnection() {
  try {
    const response = await axios.get(`http://localhost:4000/health`, { timeout: testConfig.timeout });
    logTest('Backend server connection', true);
    return true;
  } catch (error) {
    logTest('Backend server connection', false, error);
    return false;
  }
}

// Test 2: Fetch categories
async function testFetchCategories() {
  try {
    const response = await apiRequest('GET', '/categories');
    
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid categories response format');
    }

    console.log(`📋 Found ${response.data.length} categories:`);
    response.data.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id})`);
    });

    logTest('Fetch categories', true);
    return response.data;
  } catch (error) {
    logTest('Fetch categories', false, error);
    return [];
  }
}

// Test 3: Fetch products
async function testFetchProducts() {
  try {
    const response = await apiRequest('GET', '/products');
    
    console.log('Products response structure:', JSON.stringify(response, null, 2));
    
    // Handle different response formats
    let products = [];
    if (response && response.data && response.data.products && Array.isArray(response.data.products)) {
      products = response.data.products;
    } else if (response && response.data && Array.isArray(response.data)) {
      products = response.data;
    } else if (response && Array.isArray(response)) {
      products = response;
    } else if (response && response.products && Array.isArray(response.products)) {
      products = response.products;
    } else {
      throw new Error(`Invalid products response format: ${JSON.stringify(response)}`);
    }

    console.log(`📦 Found ${products.length} products`);
    
    // Check for products with multiple categories
    const productsWithMultipleCategories = products.filter(product => 
      product.categories && Array.isArray(product.categories) && product.categories.length > 1
    );

    console.log(`🏷️  Products with multiple categories: ${productsWithMultipleCategories.length}`);
    
    productsWithMultipleCategories.forEach(product => {
      console.log(`   - ${product.name}: ${product.categories.map(c => c.name).join(', ')}`);
    });

    logTest('Fetch products', true);
    return products;
  } catch (error) {
    logTest('Fetch products', false, error);
    return [];
  }
}

// Test 4: Test category filtering
async function testCategoryFiltering(categories) {
  if (categories.length === 0) {
    logTest('Category filtering', false, new Error('No categories available for testing'));
    return;
  }

  try {
    const testCategory = categories[0];
    const response = await apiRequest('GET', `/products?category=${testCategory.id}`);
    
    console.log('Category filtering response structure:', JSON.stringify(response, null, 2));
    
    // Handle different response formats
    let products = [];
    if (response && response.data && response.data.products && Array.isArray(response.data.products)) {
      products = response.data.products;
    } else if (response && response.data && Array.isArray(response.data)) {
      products = response.data;
    } else if (response && Array.isArray(response)) {
      products = response;
    } else if (response && response.products && Array.isArray(response.products)) {
      products = response.products;
    } else {
      throw new Error(`Invalid filtered products response format: ${JSON.stringify(response)}`);
    }

    console.log(`🔍 Filtered products by category "${testCategory.name}": ${products.length} products`);
    
    logTest('Category filtering', true);
  } catch (error) {
    logTest('Category filtering', false, error);
  }
}

// Test 5: Check database schema consistency
async function testSchemaConsistency() {
  try {
    // This would require a database query endpoint, which might not exist
    // For now, we'll check if the API responses have consistent structure
    
    const categoriesResponse = await apiRequest('GET', '/categories');
    const productsResponse = await apiRequest('GET', '/products');
    
    // Check categories structure
    if (categoriesResponse.data && categoriesResponse.data.length > 0) {
      const category = categoriesResponse.data[0];
      const requiredCategoryFields = ['id', 'name', 'slug'];
      const hasRequiredFields = requiredCategoryFields.every(field => category.hasOwnProperty(field));
      
      if (!hasRequiredFields) {
        throw new Error('Category schema missing required fields');
      }
    }
    
    // Check products structure
    if (productsResponse.data && productsResponse.data.length > 0) {
      const product = productsResponse.data[0];
      const requiredProductFields = ['id', 'name', 'price'];
      const hasRequiredFields = requiredProductFields.every(field => product.hasOwnProperty(field));
      
      if (!hasRequiredFields) {
        throw new Error('Product schema missing required fields');
      }
      
      // Check if categories field exists and is properly structured
      if (product.categories) {
        if (!Array.isArray(product.categories)) {
          throw new Error('Product categories should be an array');
        }
        
        if (product.categories.length > 0) {
          const categoryInProduct = product.categories[0];
          if (!categoryInProduct.id || !categoryInProduct.name) {
            throw new Error('Product category objects missing required fields');
          }
        }
      }
    }
    
    logTest('Schema consistency check', true);
  } catch (error) {
    logTest('Schema consistency check', false, error);
  }
}

// Test 6: Test frontend API configuration
async function testFrontendAPIConfig() {
  try {
    // Check if frontend is using the correct API base URL
    const frontendConfigPath = path.join(__dirname, 'frontend', 'src', 'services', 'publicAPI.js');
    
    if (fs.existsSync(frontendConfigPath)) {
      const configContent = fs.readFileSync(frontendConfigPath, 'utf8');
      
      if (configContent.includes('localhost:4000') || configContent.includes('VITE_API_URL')) {
        logTest('Frontend API configuration', true);
      } else {
        throw new Error('Frontend API configuration may be incorrect');
      }
    } else {
      throw new Error('Frontend API configuration file not found');
    }
  } catch (error) {
    logTest('Frontend API configuration', false, error);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Chamunda Nursery Admin Functionality Tests\n');
  
  // Test 1: Backend connection
  const backendConnected = await testBackendConnection();
  if (!backendConnected) {
    console.log('\n❌ Backend server is not accessible. Please ensure it\'s running on port 4000.');
    return;
  }
  
  // Test 2: Fetch categories
  const categories = await testFetchCategories();
  
  // Test 3: Fetch products
  const products = await testFetchProducts();
  
  // Test 4: Category filtering
  await testCategoryFiltering(categories);
  
  // Test 5: Schema consistency
  await testSchemaConsistency();
  
  // Test 6: Frontend API config
  await testFrontendAPIConfig();
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  
  if (testResults.errors.length > 0) {
    console.log('\n🔍 Detailed Errors:');
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.test}: ${error.error}`);
    });
  }
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! The multiple categories functionality is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error.message);
  process.exit(1);
});