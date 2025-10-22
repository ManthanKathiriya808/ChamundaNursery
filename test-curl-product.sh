#!/bin/bash
# Product Creation Test with Timeout Limits

echo "Testing Product Creation API..."
echo "Backend: http://localhost:4000/api/products"
echo "Timeout: 30 seconds"
echo ""

curl -X POST \
  --max-time 30 \
  --connect-timeout 10 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzQ4MDI4MDAsImV4cCI6MTczNTQwNzYwMH0.example" \
  -d '{
  "name": "Test Succulent Garden Kit",
  "slug": "test-succulent-garden-kit",
  "description": "Complete succulent garden kit with multiple varieties perfect for beginners. Includes care instructions and decorative pot.",
  "shortDescription": "Complete succulent garden kit perfect for beginners",
  "price": 35.99,
  "comparePrice": 49.99,
  "inventory": 15,
  "categoryIds": "[1,3]",
  "category_id": 1,
  "sku": "SUCC-KIT-001",
  "weight": 1.8,
  "dimensions": "{\"length\":12,\"width\":12,\"height\":15,\"unit\":\"cm\"}",
  "botanicalName": "Mixed Succulents",
  "plantType": "succulent",
  "sunlightRequirement": "bright-indirect",
  "waterRequirement": "bi-weekly",
  "careInstructions": "Water every 2 weeks, ensure good drainage. Place in bright indirect light. Avoid overwatering.",
  "bloomingSeason": "Spring",
  "difficulty": "easy",
  "metaTitle": "Succulent Garden Kit - Perfect for Beginners",
  "metaDescription": "Complete succulent garden kit with care instructions. Perfect starter kit for plant enthusiasts.",
  "status": "active",
  "featured": true,
  "lowStockThreshold": 3,
  "tags": "[\"succulent\",\"kit\",\"beginner\",\"indoor\",\"low-maintenance\"]"
}' \
  http://localhost:4000/api/products

echo ""
echo "Test completed. Check response above."
