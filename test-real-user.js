/**
 * Test script to simulate real user registration webhook from Clerk
 * This simulates what happens when a real user registers through Clerk
 */

const testRealUserWebhook = async () => {
  const webhookUrl = 'http://localhost:4000/api/webhooks/clerk'
  
  // Simulate a real user registration event
  const realUserEvent = {
    type: 'user.created',
    data: {
      id: 'user_real_' + Date.now(),
      email_addresses: [{
        email_address: 'testuser@example.com'
      }],
      first_name: 'John',
      last_name: 'Doe',
      public_metadata: {
        role: 'customer'
      }
    }
  }

  try {
    console.log('Testing real user registration webhook...')
    console.log('Event:', JSON.stringify(realUserEvent, null, 2))
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(realUserEvent)
    })

    const result = await response.text()
    console.log(`Status: ${response.status}`)
    console.log(`Response: ${result}`)
    
    if (response.status === 200) {
      console.log('✅ Real user webhook test successful!')
    } else {
      console.log('❌ Real user webhook test failed!')
    }
  } catch (error) {
    console.error('Error testing webhook:', error)
  }
}

// Run the test
testRealUserWebhook()