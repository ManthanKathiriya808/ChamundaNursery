/**
 * Comprehensive Product Operations Test
 * Tests create, update, and delete operations with complete form data
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:4000';

// Helper function to create a test image file
function createTestImage(filename) {
  const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#4CAF50"/>
    <text x="50" y="50" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="12">${filename}</text>
  </svg>`;
  
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, svgContent);
  return filepath;
}

// Test product creation with complete data
async function testProductCreate() {
  console.log('\n=== Testing Product Creation ===');
  
  const formData = new FormData();
  
  // Create test images
  const image1Path = createTestImage('test-image-1.svg');
  const image2Path = createTestImage('test-image-2.svg');
  
  // Complete product data
  const productData = {
    name: 'Premium Rose Plant Collection',
    slug: 'premium-rose-plant-collection',
    description: 'Beautiful collection of premium rose plants perfect for your garden. These roses are carefully selected for their vibrant colors and strong fragrance.',
    shortDescription: 'Premium rose plants with vibrant colors and strong fragrance',
    price: 299.99,
    salePrice: 249.99,
    comparePrice: 349.99,
    sku: 'ROSE-PREM-001',
    barcode: '1234567890123',
    inventory: 25,
    weight: 2.5,
    dimensions: '30x30x40',
    shippingClass: 'standard',
    taxClass: 'standard',
    status: 'active',
    visibility: 'visible',
    featured: true,
    virtual: false,
    downloadable: false,
    soldIndividually: false,
    manageStock: true,
    stockStatus: 'in_stock',
    backorders: 'no',
    lowStockThreshold: 5,
    
    // Plant-specific fields (using correct enum values)
     plantType: 'flowering',
     lightRequirement: 'bright-indirect',
     wateringFrequency: 'weekly',
     difficulty: 'easy',
    
    // SEO fields
    seoTitle: 'Premium Rose Plant Collection - Beautiful Garden Roses',
    seoDescription: 'Shop our premium rose plant collection featuring vibrant, fragrant roses perfect for any garden. High-quality plants with expert care instructions.',
    seoKeywords: 'roses, garden plants, flowering plants, premium roses',
    
    // Multiple categories (using available category IDs)
    categoryIds: [1, 4, 5], // Plants, Outdoor Plants, Flowering Plants
    
    // Tags
    tags: ['roses', 'flowering', 'garden', 'premium', 'fragrant'],
    
    // Additional fields
    careInstructions: 'Water regularly, provide morning sunlight, prune after flowering season',
    seasonality: 'spring,summer',
    bloomTime: 'May to October',
    matureSize: '3-4 feet tall and wide',
    hardiness: 'Zones 5-9',
    soilType: 'Well-draining, fertile soil',
    
    // Shipping and handling
    shippingRequired: true,
    shippingWeight: 3.0,
    shippingDimensions: '35x35x45',
    handlingTime: '2-3 business days'
  };
  
  // Add all form fields
  Object.keys(productData).forEach(key => {
    if (key === 'categoryIds') {
      formData.append('categoryIds', JSON.stringify(productData[key]));
    } else if (key === 'tags') {
      formData.append('tags', JSON.stringify(productData[key]));
    } else if (typeof productData[key] === 'boolean') {
      formData.append(key, productData[key].toString());
    } else {
      formData.append(key, productData[key]);
    }
  });
  
  // Add images (backend expects 'product_images' field name)
  formData.append('product_images', fs.createReadStream(image1Path), {
    filename: 'test-image-1.svg',
    contentType: 'image/svg+xml'
  });
  formData.append('product_images', fs.createReadStream(image2Path), {
    filename: 'test-image-2.svg',
    contentType: 'image/svg+xml'
  });
  
  try {
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Product created successfully!');
      console.log(`Product ID: ${result.data.id}`);
      console.log(`Product Name: ${result.data.name}`);
      console.log(`Categories: ${JSON.stringify(result.data.category_ids)}`);
      console.log(`Images: ${result.data.image_urls ? result.data.image_urls.length : 0} images`);
      
      // Clean up test images
      fs.unlinkSync(image1Path);
      fs.unlinkSync(image2Path);
      
      return result.data.id; // Return product ID for further tests
    } else {
      console.log('❌ Product creation failed:');
      console.log('Status:', response.status);
      console.log('Response:', result);
      
      // Clean up test images
      fs.unlinkSync(image1Path);
      fs.unlinkSync(image2Path);
      
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating product:', error.message);
    
    // Clean up test images
    fs.unlinkSync(image1Path);
    fs.unlinkSync(image2Path);
    
    return null;
  }
}

// Test product update
async function testProductUpdate(productId) {
  console.log('\n=== Testing Product Update ===');
  
  if (!productId) {
    console.log('❌ No product ID provided for update test');
    return false;
  }
  
  const formData = new FormData();
  
  // Create new test image for update
  const image3Path = createTestImage('test-image-3-updated.svg');
  
  // Updated product data
  const updatedData = {
    name: 'Premium Rose Plant Collection - Updated',
    description: 'Updated description: Beautiful collection of premium rose plants with enhanced care instructions.',
    price: 319.99,
    salePrice: 269.99,
    inventory: 30,
    plantType: 'outdoor',
     lightRequirement: 'high',
     wateringFrequency: 'bi-weekly',
     difficulty: 'medium',
    categoryIds: [1, 4], // Remove one category
    tags: ['roses', 'flowering', 'garden', 'premium', 'updated'],
    featured: false
  };
  
  // Add updated fields
  Object.keys(updatedData).forEach(key => {
    if (key === 'categoryIds') {
      formData.append('categoryIds', JSON.stringify(updatedData[key]));
    } else if (key === 'tags') {
      formData.append('tags', JSON.stringify(updatedData[key]));
    } else if (typeof updatedData[key] === 'boolean') {
      formData.append(key, updatedData[key].toString());
    } else {
      formData.append(key, updatedData[key]);
    }
  });
  
  // Add new image (backend expects 'product_images' field name)
   formData.append('product_images', fs.createReadStream(image3Path), {
     filename: 'test-image-3-updated.svg',
     contentType: 'image/svg+xml'
   });
  
  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
      method: 'PUT',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Product updated successfully!');
      console.log(`Updated Name: ${result.data.name}`);
      console.log(`Updated Price: ${result.data.price}`);
      console.log(`Updated Categories: ${JSON.stringify(result.data.category_ids)}`);
      
      // Clean up test image
      fs.unlinkSync(image3Path);
      
      return true;
    } else {
      console.log('❌ Product update failed:');
      console.log('Status:', response.status);
      console.log('Response:', result);
      
      // Clean up test image
      fs.unlinkSync(image3Path);
      
      return false;
    }
  } catch (error) {
    console.log('❌ Error updating product:', error.message);
    
    // Clean up test image
    fs.unlinkSync(image3Path);
    
    return false;
  }
}

// Test product deletion
async function testProductDelete(productId) {
  console.log('\n=== Testing Product Deletion ===');
  
  if (!productId) {
    console.log('❌ No product ID provided for delete test');
    return false;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log('✅ Product deleted successfully!');
      console.log(`Deleted Product ID: ${productId}`);
      return true;
    } else {
      const result = await response.json();
      console.log('❌ Product deletion failed:');
      console.log('Status:', response.status);
      console.log('Response:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Error deleting product:', error.message);
    return false;
  }
}

// Test database verification
async function testDatabaseVerification(productId) {
  console.log('\n=== Testing Database Verification ===');
  
  if (!productId) {
    console.log('❌ No product ID provided for database verification');
    return false;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Product found in database:');
      console.log(`ID: ${result.data.id}`);
      console.log(`Name: ${result.data.name}`);
      console.log(`Price: ${result.data.price}`);
      console.log(`Categories: ${JSON.stringify(result.data.category_ids)}`);
      console.log(`Images: ${result.data.image_urls ? result.data.image_urls.length : 0} images`);
      console.log(`Plant Type: ${result.data.plant_type}`);
      console.log(`Light Requirement: ${result.data.light_requirement}`);
      console.log(`Watering Frequency: ${result.data.watering_frequency}`);
      console.log(`Stock: ${result.data.stock}`);
      console.log(`Status: ${result.data.status}`);
      return true;
    } else {
      console.log('❌ Product not found in database');
      console.log('Status:', response.status);
      console.log('Response:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Error verifying product in database:', error.message);
    return false;
  }
}

// Main test function
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Product Operations Test');
  console.log('================================================');
  
  // Test 1: Create product
  const productId = await testProductCreate();
  if (!productId) {
    console.log('\n❌ Test failed at product creation. Stopping tests.');
    return;
  }
  
  // Test 2: Verify in database
  const dbVerified = await testDatabaseVerification(productId);
  if (!dbVerified) {
    console.log('\n❌ Test failed at database verification. Continuing with other tests.');
  }
  
  // Test 3: Update product
  const updateSuccess = await testProductUpdate(productId);
  if (!updateSuccess) {
    console.log('\n❌ Test failed at product update. Continuing with delete test.');
  }
  
  // Test 4: Verify update in database
  if (updateSuccess) {
    const updateVerified = await testDatabaseVerification(productId);
    if (!updateVerified) {
      console.log('\n❌ Test failed at update verification.');
    }
  }
  
  // Test 5: Delete product
  const deleteSuccess = await testProductDelete(productId);
  if (!deleteSuccess) {
    console.log('\n❌ Test failed at product deletion.');
  }
  
  // Test 6: Verify deletion
  if (deleteSuccess) {
    console.log('\n=== Verifying Product Deletion ===');
    try {
      const response = await fetch(`${BASE_URL}/api/products/${productId}`);
      if (response.status === 404) {
        console.log('✅ Product successfully deleted from database');
      } else {
        console.log('❌ Product still exists in database after deletion');
      }
    } catch (error) {
      console.log('❌ Error verifying deletion:', error.message);
    }
  }
  
  console.log('\n================================================');
  console.log('🏁 Comprehensive Product Operations Test Complete');
}

// Run the tests
runComprehensiveTests().catch(console.error);