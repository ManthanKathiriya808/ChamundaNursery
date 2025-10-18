# User Synchronization Testing Guide

This guide provides comprehensive testing procedures for the bidirectional user synchronization system between Clerk and the database.

## Overview

The synchronization system includes:
- **Real-time sync** via Clerk webhooks
- **Manual sync tools** via admin dashboard
- **Bidirectional role updates** between Clerk and database
- **Conflict resolution** and cleanup utilities

## Prerequisites

1. **Environment Setup**
   ```bash
   # Backend environment variables
   CLERK_WEBHOOK_SECRET=your_webhook_secret_from_clerk_dashboard
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   
   # Frontend environment variables
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:4000
   ```

2. **Database Migration**
   Ensure the `clerk_id` column exists in your users table:
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255) UNIQUE;
   ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
   CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
   ```

3. **Clerk Webhook Configuration**
   - Go to Clerk Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy the webhook secret to your environment

## Testing Scenarios

### 1. Initial Sync Testing

#### Test Case 1.1: Sync Existing Clerk Users to Database
```bash
# Steps:
1. Create 2-3 users in Clerk dashboard manually
2. Access admin sync dashboard: /admin/sync
3. Click "Sync Clerk to Database"
4. Verify users appear in database with correct roles

# Expected Results:
- All Clerk users created in database
- Roles properly assigned (default: customer)
- No duplicate users created
```

#### Test Case 1.2: Handle Existing Database Users
```bash
# Steps:
1. Create users directly in database (without clerk_id)
2. Create same users in Clerk with same email
3. Run sync operation
4. Verify users are linked (clerk_id populated)

# Expected Results:
- Existing database users get clerk_id populated
- No duplicate users created
- User data updated from Clerk
```

### 2. Real-time Webhook Testing

#### Test Case 2.1: User Creation Webhook
```bash
# Steps:
1. Monitor backend logs: tail -f backend/logs/app.log
2. Create new user in Clerk (sign up via frontend)
3. Check database immediately after creation

# Expected Results:
- Webhook received and processed
- User created in database with clerk_id
- Default role assigned (customer)
- No errors in logs
```

#### Test Case 2.2: User Update Webhook
```bash
# Steps:
1. Update user profile in Clerk (name, email)
2. Update user role in Clerk metadata
3. Check database for updates

# Expected Results:
- User data updated in database
- Role changes reflected
- updated_at timestamp changed
```

#### Test Case 2.3: User Deletion Webhook
```bash
# Steps:
1. Delete user from Clerk dashboard
2. Check database user record

# Expected Results:
- User marked as deleted (deleted_at set)
- OR user completely removed (based on configuration)
- clerk_id set to NULL
```

### 3. Role Management Testing

#### Test Case 3.1: Admin Role Assignment
```bash
# Steps:
1. Login as admin user
2. Go to sync dashboard
3. Change user role from customer to admin
4. Verify in both Clerk and database

# Expected Results:
- Role updated in database immediately
- Role updated in Clerk metadata
- User gains admin privileges
- Changes reflected in real-time
```

#### Test Case 3.2: Role Conflict Resolution
```bash
# Steps:
1. Manually set different roles in Clerk vs database
2. Access sync dashboard
3. View conflicts tab
4. Resolve conflicts using "Resolve All" button

# Expected Results:
- Conflicts detected and displayed
- Resolution updates both systems
- Clerk role takes precedence (configurable)
```

### 4. Sync Status and Monitoring

#### Test Case 4.1: Sync Status Dashboard
```bash
# Steps:
1. Access /admin/sync dashboard
2. Review sync status cards
3. Check user comparison tables

# Expected Results:
- Accurate user counts displayed
- Users categorized correctly (Clerk only, DB only, synced)
- Last sync timestamp shown
- Real-time updates when changes made
```

#### Test Case 4.2: Cleanup Operations
```bash
# Steps:
1. Create test users in database without clerk_id
2. Set created_at to > 30 days ago
3. Run cleanup operation
4. Verify orphaned users removed

# Expected Results:
- Only old orphaned users deleted
- Recent users without clerk_id preserved
- Cleanup summary displayed
```

### 5. Error Handling Testing

#### Test Case 5.1: Network Failures
```bash
# Steps:
1. Disconnect internet during sync operation
2. Attempt role updates
3. Reconnect and retry operations

# Expected Results:
- Graceful error handling
- User-friendly error messages
- Operations can be retried successfully
- No data corruption
```

#### Test Case 5.2: Invalid Data Handling
```bash
# Steps:
1. Send invalid webhook payload
2. Attempt to sync user with invalid email
3. Try to set invalid role

# Expected Results:
- Validation errors caught
- Invalid operations rejected
- System remains stable
- Appropriate error messages shown
```

## Manual Testing Procedures

### Setup Test Environment

1. **Start Services**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm start
   
   # Terminal 2: Frontend  
   cd frontend
   npm run dev
   ```

2. **Create Test Users**
   ```bash
   # Create users in Clerk dashboard
   # Create users directly in database
   # Mix of synced and unsynced users
   ```

### Test Sync Dashboard

1. **Access Dashboard**
   - Login as admin user
   - Navigate to `/admin/sync`
   - Verify all tabs load correctly

2. **Test Each Feature**
   - Sync operations
   - Role updates
   - Conflict resolution
   - Cleanup operations
   - Status monitoring

### Test Real-time Updates

1. **Open Multiple Browser Tabs**
   - Admin dashboard in one tab
   - User profile in another tab
   - Database admin tool in third tab

2. **Make Changes and Verify**
   - Update role in one system
   - Verify changes appear in others
   - Check timing and accuracy

## Automated Testing

### API Endpoint Tests

```bash
# Test sync endpoints
curl -X GET "http://localhost:4000/api/admin-sync/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X POST "http://localhost:4000/api/admin-sync/sync-clerk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"users": [...]}'

# Test webhook endpoint
curl -X POST "http://localhost:4000/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -H "svix-id: test" \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: test" \
  -d '{"type": "user.created", "data": {...}}'
```

### Database Verification Queries

```sql
-- Check sync status
SELECT 
  COUNT(*) as total_users,
  COUNT(clerk_id) as synced_users,
  COUNT(*) - COUNT(clerk_id) as unsynced_users
FROM users;

-- Check role distribution
SELECT role, COUNT(*) 
FROM users 
GROUP BY role;

-- Check recent updates
SELECT name, email, role, clerk_id, updated_at 
FROM users 
ORDER BY updated_at DESC 
LIMIT 10;

-- Check for conflicts (manual verification)
-- Compare with Clerk dashboard data
```

## Performance Testing

### Load Testing Sync Operations

1. **Bulk User Sync**
   - Create 100+ users in Clerk
   - Time the sync operation
   - Monitor memory usage
   - Check for timeouts

2. **Concurrent Updates**
   - Multiple admins updating roles simultaneously
   - Verify no race conditions
   - Check data consistency

### Webhook Performance

1. **High Frequency Events**
   - Rapid user creation/updates
   - Monitor webhook processing time
   - Check for dropped events

## Troubleshooting Guide

### Common Issues

1. **Webhook Not Receiving Events**
   - Check webhook URL accessibility
   - Verify webhook secret
   - Check Clerk dashboard event logs

2. **Sync Failures**
   - Check database connectivity
   - Verify JWT token validity
   - Review API error logs

3. **Role Update Issues**
   - Confirm admin permissions
   - Check Clerk metadata structure
   - Verify database constraints

### Debug Commands

```bash
# Check webhook logs
tail -f backend/logs/webhook.log

# Monitor database connections
SELECT * FROM pg_stat_activity WHERE datname = 'your_db_name';

# Test Clerk API connectivity
curl -H "Authorization: Bearer YOUR_CLERK_SECRET" \
  "https://api.clerk.dev/v1/users"
```

## Success Criteria

The synchronization system passes testing when:

✅ **Real-time Sync**
- Webhooks process all events successfully
- Users created/updated in real-time
- No data loss or corruption

✅ **Bidirectional Role Updates**
- Roles can be updated from either system
- Changes propagate to both systems
- Conflicts detected and resolved

✅ **Data Consistency**
- No duplicate users created
- All users have consistent data
- Orphaned records cleaned up

✅ **Error Handling**
- Graceful failure handling
- User-friendly error messages
- System remains stable under load

✅ **Performance**
- Sync operations complete within 30 seconds
- Webhooks process within 5 seconds
- Dashboard loads within 3 seconds

## Maintenance

### Regular Checks

1. **Weekly**
   - Review sync status dashboard
   - Check for unresolved conflicts
   - Monitor webhook success rate

2. **Monthly**
   - Run cleanup operations
   - Review performance metrics
   - Update documentation

3. **Quarterly**
   - Full system audit
   - Performance optimization
   - Security review