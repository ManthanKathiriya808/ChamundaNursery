/**
 * Browser Console Error Test Script
 * This script helps identify console errors in the admin interface
 */

const puppeteer = require('puppeteer');

async function testBrowserConsole() {
  let browser;
  const errors = [];
  const warnings = [];
  const logs = [];

  try {
    console.log('🚀 Starting browser console error test...\n');

    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Listen for console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        errors.push(text);
        console.log(`❌ Console Error: ${text}`);
      } else if (type === 'warning') {
        warnings.push(text);
        console.log(`⚠️  Console Warning: ${text}`);
      } else if (type === 'log' && !text.includes('Download the React DevTools')) {
        logs.push(text);
        console.log(`ℹ️  Console Log: ${text}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(`Page Error: ${error.message}`);
      console.log(`❌ Page Error: ${error.message}`);
    });

    // Listen for failed requests
    page.on('requestfailed', request => {
      const failure = request.failure();
      if (failure) {
        errors.push(`Request Failed: ${request.url()} - ${failure.errorText}`);
        console.log(`❌ Request Failed: ${request.url()} - ${failure.errorText}`);
      }
    });

    console.log('📱 Navigating to admin products page...');
    
    // Navigate to the admin products page
    await page.goto('http://localhost:5174/admin/products', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('⏳ Waiting for page to fully load...');
    
    // Wait for the page to fully load
    await page.waitForTimeout(3000);

    // Check if the page loaded successfully
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    // Check for specific elements that should be present
    const elementsToCheck = [
      '[data-testid="products-grid"]',
      '[data-testid="add-product-button"]',
      '.admin-products-container'
    ];

    for (const selector of elementsToCheck) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`✅ Found element: ${selector}`);
      } catch (error) {
        console.log(`⚠️  Element not found: ${selector}`);
      }
    }

    // Test interactions
    console.log('🖱️  Testing interactions...');
    
    try {
      // Try to click the add product button if it exists
      const addButton = await page.$('[data-testid="add-product-button"]');
      if (addButton) {
        await addButton.click();
        console.log('✅ Clicked add product button');
        await page.waitForTimeout(2000);
        
        // Check if modal opened
        const modal = await page.$('.modal, [role="dialog"]');
        if (modal) {
          console.log('✅ Product form modal opened');
          
          // Close modal
          const closeButton = await page.$('[data-testid="close-modal"], .modal-close, [aria-label="Close"]');
          if (closeButton) {
            await closeButton.click();
            console.log('✅ Closed modal');
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  Interaction test failed: ${error.message}`);
    }

    // Wait a bit more to catch any delayed errors
    await page.waitForTimeout(2000);

    console.log('\n📊 Test Results Summary:');
    console.log(`❌ Errors: ${errors.length}`);
    console.log(`⚠️  Warnings: ${warnings.length}`);
    console.log(`ℹ️  Logs: ${logs.length}`);

    if (errors.length > 0) {
      console.log('\n🔍 Detailed Errors:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  Detailed Warnings:');
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    if (errors.length === 0) {
      console.log('\n🎉 No console errors found! The admin interface is working correctly.');
    } else {
      console.log('\n⚠️  Console errors detected. Please review the errors above.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if puppeteer is available
try {
  require.resolve('puppeteer');
  testBrowserConsole();
} catch (error) {
  console.log('⚠️  Puppeteer not installed. Installing...');
  console.log('Run: npm install puppeteer');
  console.log('Then run this script again.');
  
  // Alternative manual testing instructions
  console.log('\n📋 Manual Testing Instructions:');
  console.log('1. Open Chrome DevTools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Navigate to http://localhost:5174/admin/products');
  console.log('4. Check for any red error messages');
  console.log('5. Try clicking the "Add Product" button');
  console.log('6. Check for any new errors after interactions');
}