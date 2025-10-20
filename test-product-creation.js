// Test script to create a comprehensive product with all details
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:3001/api';

// Test product data
const productData = {
  name: 'Monstera Deliciosa',
  slug: 'monstera-deliciosa-test',
  description: 'Beautiful tropical houseplant with large, glossy leaves featuring natural splits and holes. Perfect for indoor decoration and air purification. This stunning plant is known for its dramatic foliage and easy care requirements.',
  price: 2999,
  stock: 25,
  
  // Plant-specific details
  plantType: 'Indoor Plant',
  lightRequirements: 'Bright, indirect light',
  waterRequirements: 'Water when top soil is dry',
  matureSize: '6-8 feet tall',
  growthRate: 'Moderate',
  toxicity: 'Toxic to pets',
  careLevel: 'Easy',
  
  // Physical details
  weight: 2.5,
  dimensions: JSON.stringify({length: 30, width: 30, height: 60}),
  
  // SEO & Marketing
  metaTitle: 'Monstera Deliciosa - Premium Indoor Plant | Chamunda Nursery',
  metaDescription: 'Buy beautiful Monstera Deliciosa plants online. Easy care, air-purifying houseplant perfect for home decoration.',
  tags: JSON.stringify(['indoor', 'tropical', 'air-purifying', 'easy-care']),
  
  // Categories - multiple selection
  categoryIds: [3, 5] // Indoor Plants and Flowering Plants
};

async function testProductCreation() {
  try {
    console.log('🌱 Testing Product Creation...');
    
    // Create FormData
    const formData = new FormData();
    
    // Add all product fields
    Object.keys(productData).forEach(key => {
      if (key === 'categoryIds') {
        // Add each category ID separately
        productData[key].forEach(id => {
          formData.append('categoryIds', id);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });
    
    // Add test images (we'll use placeholder data since we can't access the actual files)
    // In real testing, you would add actual image files here
    console.log('📸 Note: In actual testing, images would be uploaded from frontend/public/images/plants/');
    
    // Make API call
    const response = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      body: formData,
      headers: {
        // Add auth header if needed
        // 'Authorization': 'Bearer your-jwt-token'
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Product created successfully!');
      console.log('Product ID:', result.data?.id);
      console.log('Product Name:', result.data?.name);
      console.log('Categories:', result.data?.categories?.map(c => c.name).join(', '));
      console.log('Images:', result.data?.images?.length || 0, 'images uploaded');
    } else {
      console.log('❌ Product creation failed:');
      console.log('Status:', response.status);
      console.log('Error:', result.message || result.error);
      console.log('Details:', result.details || '');
    }
    
    return result;
    
  } catch (error) {
    console.error('🚨 Test failed with error:', error.message);
    return null;
  }
}

// Run the test
testProductCreation().then(() => {
  console.log('🏁 Test completed');
});
