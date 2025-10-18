/**
 * Test script for Clerk webhook integration
 * Simulates webhook calls to test the webhook endpoint
 */

import crypto from 'crypto';

const WEBHOOK_URL = 'http://localhost:4000/api/webhooks/clerk';
const WEBHOOK_SECRET = 'whsec_test_secret_for_testing'; // Test secret

// Mock webhook data
const mockUserCreatedData = {
  type: 'user.created',
  data: {
    id: 'user_webhook_test_123',
    email_addresses: [
      {
        email_address: 'webhooktest@example.com'
      }
    ],
    first_name: 'Webhook',
    last_name: 'Test',
    public_metadata: {
      role: 'customer'
    }
  }
};

const mockUserUpdatedData = {
  type: 'user.updated',
  data: {
    id: 'user_webhook_test_123',
    email_addresses: [
      {
        email_address: 'webhooktest@example.com'
      }
    ],
    first_name: 'Webhook',
    last_name: 'Updated',
    public_metadata: {
      role: 'admin'
    }
  }
};

const mockUserDeletedData = {
  type: 'user.deleted',
  data: {
    id: 'user_webhook_test_123'
  }
};

// Mock Svix headers for testing
function createSvixHeaders(payload) {
  const timestamp = Math.floor(Date.now() / 1000);
  // Create a simple test signature - in real Clerk webhooks this would be properly signed
  const signature = 'v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=';
  
  return {
    'svix-id': 'msg_test_id_' + Date.now(),
    'svix-timestamp': timestamp.toString(),
    'svix-signature': signature,
    'Content-Type': 'application/json'
  };
}

async function testWebhook(webhookData, testName) {
  console.log(`\n🧪 Testing ${testName}...`);
  
  const payload = JSON.stringify(webhookData);
  const headers = createSvixHeaders(payload);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: payload
    });
    
    const result = await response.text();
    
    if (response.ok) {
      console.log(`✅ ${testName} - Success:`, response.status);
      console.log('Response:', result);
    } else {
      console.log(`❌ ${testName} - Failed:`, response.status);
      console.log('Error:', result);
    }
  } catch (error) {
    console.log(`❌ ${testName} - Error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Clerk Webhook Integration Tests');
  console.log('Webhook URL:', WEBHOOK_URL);
  
  // Test user creation
  await testWebhook(mockUserCreatedData, 'User Created Webhook');
  
  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test user update
  await testWebhook(mockUserUpdatedData, 'User Updated Webhook');
  
  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test user deletion
  await testWebhook(mockUserDeletedData, 'User Deleted Webhook');
  
  console.log('\n✨ Webhook tests completed!');
}

// Run the tests
runTests().catch(console.error);