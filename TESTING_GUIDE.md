# Testing the Events System

## 🎯 Complete Testing Guide

This guide walks you through testing the entire events system from database setup to user transactions.

---

## 📋 Pre-Testing Checklist

Before starting, ensure:

- [ ] Database is setup (see `DATABASE_SETUP_GUIDE.md`)
- [ ] Environment variables configured in `.env`
- [ ] Prisma schema pushed: `npx prisma db push`
- [ ] Supabase storage buckets created
- [ ] Admin user created and added to Roles table
- [ ] Development server running: `npm run dev`

---

## 🧪 Test Sequence

### Phase 1: Admin Panel - Event Management

#### Test 1.1: Admin Login ✓

1. Navigate to `http://localhost:3000/admin/login`
2. Enter your admin credentials
3. Click "Sign in"
4. **Expected**: Redirect to `/admin/breeze-admin`
5. **Verify**: You see the admin dashboard

#### Test 1.2: Navigate to Events Management ✓

1. From `/admin/breeze-admin`, go to `/admin/clubs`
2. **Expected**: See event management page
3. **Verify**:
   - Table shows existing events (if any)
   - "Add Event" button visible

#### Test 1.3: Create a Cultural Event ✓

1. Click "Add Event" button
2. Fill in the form:
   ```
   Event Name: Test Dance Competition
   Description: This is a test cultural event
   Price: 150
   Venue: Main Auditorium
   Date: 2025-02-20
   Time: 5:00 PM
   Organizer: Dance Club
   Event Poster: Upload any image
   ```
3. Click "Create Event"
4. **Expected**: Form closes, event appears in table
5. **Verify**:
   - New event row in table
   - All details correct
   - Image uploaded to Supabase

#### Test 1.4: Create a Technical Event ✓

1. Click "Add Event" button again
2. Fill in the form:
   ```
   Event Name: Test Hackathon
   Description: 24-hour coding challenge
   Price: 200
   Venue: Computer Lab
   Date: 2025-02-21
   Time: 9:00 AM
   Organizer: Tech Club
   Event Poster: Upload any image
   ```
3. Click "Create Event"
4. **Expected**: Event created successfully
5. **Verify**: Second event appears in table

#### Test 1.5: Edit an Event ✓

1. Click "Edit" button on any event
2. Modify the description
3. Change the price
4. Click "Save"
5. **Expected**: Changes saved
6. **Verify**: Updated values shown in table

#### Test 1.6: Delete an Event ✓

1. Click "Delete" button on an event
2. Confirm deletion
3. **Expected**: Event removed from table
4. **Verify**:
   - Event no longer in database
   - Page refreshed automatically

---

### Phase 2: Public Events Pages

#### Test 2.1: View All Events Page ✓

1. Navigate to `http://localhost:3000/events`
2. **Expected**:
   - Page loads with banner image
   - Two sections: "Cultural Events" and "Technical Events"
   - Events displayed in cards (max 5 per section)
3. **Verify**:
   - Event names visible
   - Event prices shown
   - Images loading correctly
   - "See All" links present

#### Test 2.2: View Cultural Events Page ✓

1. Click "See All" in Cultural Events section
   OR navigate to `/events/cultural`
2. **Expected**:
   - All cultural events displayed
   - Filter/sort options (if implemented)
3. **Verify**:
   - Only Cultural events shown
   - Event details visible

#### Test 2.3: View Technical Events Page ✓

1. Click "See All" in Technical Events section
   OR navigate to `/events/technical`
2. **Expected**: All technical events displayed
3. **Verify**: Only Technical events shown

#### Test 2.4: View Individual Event Page ✓

1. Click on any event card
2. **Expected**: Redirect to `/events/[id]`
3. **Verify**:
   - Event details displayed
   - Price shown
   - Venue, date, time information
   - "Add to Cart" button (if implemented)

---

### Phase 3: Shopping Cart Flow

#### Test 3.1: Add Event to Cart ✓

1. On event detail page, click "Add to Cart"
2. **Expected**: Success message/notification
3. **Verify**:
   - Cart icon updates (if implemented)
   - Item count increases

#### Test 3.2: View Cart ✓

1. Navigate to `/cart`
2. **Expected**:
   - Cart page loads
   - Added event(s) displayed
   - Quantity controls visible
   - Total price calculated
3. **Verify**:
   - Event details correct
   - Price matches
   - Can increase/decrease quantity
   - "Proceed to Checkout" button present

#### Test 3.3: Modify Cart ✓

1. Change quantity of an item
2. Remove an item
3. **Expected**:
   - Total price updates automatically
   - UI reflects changes immediately
4. **Verify**: Cart state persists on page refresh

---

### Phase 4: Checkout & Payment

#### Test 4.1: Initiate Checkout ✓

1. From cart page, click "Proceed to Checkout"
2. **Expected**:
   - POST to `/api/checkout`
   - Redirect to `/checkout?token=<unique-id>`
3. **Verify**:
   - URL contains token parameter
   - Checkout form loads

**Debug**: Check browser Network tab to see API response:

```json
{
  "message": "Success",
  "id": "abc123xyz..."
}
```

**Verify Database**:

```bash
npx prisma studio
```

- Check `PendingTransaction` table
- Should have new record with cart JSON

#### Test 4.2: Fill Payment Form ✓

1. On checkout page, fill the form:
   ```
   Name: Test User
   Email: test@example.com
   Phone: 1234567890
   Address: 123 Test Street, Test City
   College Status: Student at XYZ College
   ```
2. Upload a payment proof image (any image)
3. Select accommodation (optional):
   - [ ] Day 1
   - [x] Day 2
   - [ ] Day 3
4. **Verify**:
   - Form validation works
   - Amount displayed correctly
   - Accommodation price added

#### Test 4.3: Submit Payment ✓

1. Click "Submit Payment"
2. **Expected**:
   - Form submits (loading state)
   - POST to `/api/pay`
   - Success message
   - Redirect to `/thank-you`
3. **Verify**:
   - Thank you page displays
   - Transaction ID shown

**Debug**: Check Network tab:

```json
{
  "message": "Payment submitted successfully"
}
```

**Verify Database**:

```bash
npx prisma studio
```

- Check `SubmittedTransaction` table
- Should have new record with:
  - User details
  - Cart JSON
  - Payment proof path
  - `approved: false`
- Check `PendingTransaction` table
- Previous record should be DELETED

**Verify Supabase Storage**:

1. Go to Supabase Dashboard → Storage
2. Open `transaction-proofs` bucket
3. **Verify**: Image uploaded with filename pattern `[email]-[timestamp]`

---

### Phase 5: Admin - Transaction Approval

#### Test 5.1: View Pending Transactions ✓

1. Log in as admin
2. Navigate to `/admin/breeze-admin`
3. **Expected**:
   - Table of submitted transactions
   - Columns: Name, Email, Amount, Date, Status, Actions
4. **Verify**:
   - Test transaction appears
   - Status shows "Pending" or equivalent
   - "View" button present

#### Test 5.2: Review Transaction Details ✓

1. Click "View" on the test transaction
2. **Expected**:
   - Modal/dialog opens
   - Transaction details displayed:
     - User information
     - Cart items breakdown
     - Total amount
     - Payment proof image
   - "Accept" and "Reject" buttons
3. **Verify**:
   - All information correct
   - Image loads from Supabase Storage
   - Event/merch items listed with quantities

#### Test 5.3: Approve Transaction ✓

1. Click "Accept" button
2. **Expected**:
   - Confirmation dialog (optional)
   - Loading state
   - POST to `/api/breeze-admin/confirm`
   - Success message
   - Modal closes
   - Transaction disappears from pending list
3. **Verify**:
   - API call succeeds

**Debug**: Check Network tab response:

```json
{
  "message": "Success"
}
```

**Verify Database**:

```bash
npx prisma studio
```

Check `SubmittedTransaction` table:

- `approved` field should be `true`

Check `ConfirmedEvent` table:

- New records for each event in cart
- Fields: token, id, quantity
- Token matches transaction token

Check `ConfirmedMerch` table (if cart had merch):

- New records for each merch item
- Fields: token, id, size, quantity

#### Test 5.4: View Approved Transactions ✓

1. Navigate to `/admin/breeze-admin/approved`
2. **Expected**:
   - List of approved transactions
   - Test transaction visible
3. **Verify**:
   - Status shows "Approved"
   - All details present

---

### Phase 6: Rejection Flow

#### Test 6.1: Create Another Test Transaction ✓

Repeat Phase 3 & 4 to create a new transaction for rejection testing.

#### Test 6.2: Reject Transaction ✓

1. In admin panel, view the new transaction
2. Click "Reject" button
3. **Expected**:
   - Confirmation dialog
   - POST to `/api/breeze-admin/confirm` with status: "REJECTED"
   - Transaction removed from list
4. **Verify**:
   - API returns success

**Verify Database**:

```bash
npx prisma studio
```

- Check `SubmittedTransaction` table
- Transaction should be DELETED (not just marked rejected)

---

## 🔍 API Endpoint Testing

### Manual API Tests (using curl or Postman)

#### Test API 1: Get Products

```bash
curl http://localhost:3000/api/products
```

**Expected Response**:

```json
[
  {
    "product_name": "Breeze T-Shirt",
    "product_description": "Official T-shirt",
    "product_price": 400
  }
]
```

#### Test API 2: Checkout (creates pending transaction)

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cart": {
      "event-id-here": {
        "default": 2
      }
    },
    "accommodation": [true, false, false]
  }'
```

**Expected Response**:

```json
{
  "message": "Success",
  "id": "64-character-hex-string"
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Admin redirect loop

**Symptom**: Keeps redirecting between login and admin pages
**Cause**: User not in Roles table or session not refreshed
**Solution**:

```sql
-- Check if user exists in Roles
SELECT * FROM "Roles" WHERE email = 'your-email@example.com';

-- If not, add them
INSERT INTO "Roles" (id, club_name, email)
VALUES ('user-uuid', 'BREEZE', 'your-email@example.com');
```

Then clear browser cookies and re-login.

### Issue 2: Images not loading

**Symptom**: Event posters don't display
**Cause**: Supabase storage bucket not public or wrong path
**Solution**:

1. Check bucket is public (for `assets`)
2. Verify image path format in database
3. Check Supabase Storage policies

### Issue 3: Checkout fails

**Symptom**: Error during checkout or payment submission
**Cause**: Cart items not in database, validation errors
**Solution**:

1. Check browser console for errors
2. Verify event IDs exist in database
3. Check API endpoint logs
4. Ensure token is passed correctly

### Issue 4: Transaction not appearing in admin

**Symptom**: Submitted payment doesn't show in admin panel
**Cause**: Database query issue or not approved field
**Solution**:

```bash
npx prisma studio
```

Check `SubmittedTransaction` table for the record.
Verify `approved` field is `false` (pending state).

### Issue 5: File upload fails

**Symptom**: Image upload returns error
**Cause**: Bucket permissions, file size, or authentication
**Solution**:

1. Check Supabase Storage bucket policies
2. Verify user is authenticated
3. Check file size < 5MB
4. Verify MIME type is allowed

---

## 📊 Testing Checklist

### Admin Panel

- [ ] Admin login works
- [ ] Can create cultural event
- [ ] Can create technical event
- [ ] Can edit event details
- [ ] Can delete event
- [ ] Event images upload correctly
- [ ] Events appear in table after creation

### Public Pages

- [ ] Events page loads (`/events`)
- [ ] Cultural events page works
- [ ] Technical events page works
- [ ] Individual event pages load
- [ ] Images display correctly
- [ ] Event details accurate

### Cart & Checkout

- [ ] Can add events to cart
- [ ] Cart displays items correctly
- [ ] Can modify quantities
- [ ] Can remove items
- [ ] Total price calculates correctly
- [ ] Checkout creates PendingTransaction
- [ ] Token generated and passed to form

### Payment Submission

- [ ] Form validation works
- [ ] Can upload payment proof
- [ ] Accommodation selection works
- [ ] Submission creates SubmittedTransaction
- [ ] PendingTransaction deleted after submission
- [ ] Image saved in Supabase Storage
- [ ] Thank you page displays

### Transaction Approval

- [ ] Pending transactions visible in admin
- [ ] Can view transaction details
- [ ] Payment proof image loads
- [ ] Cart items display correctly
- [ ] Approve creates ConfirmedEvent records
- [ ] Approve updates approved status
- [ ] Reject deletes transaction
- [ ] Approved transactions visible in separate view

### API Endpoints

- [ ] GET `/api/products` returns data
- [ ] POST `/api/checkout` creates pending transaction
- [ ] POST `/api/pay` processes payment
- [ ] POST `/api/breeze-admin/confirm` approves/rejects
- [ ] GET `/api/breeze-admin/users` returns roles (protected)

---

## 🚀 Performance Testing

### Load Testing Events Page

```bash
# Install wrk (if not already)
# Then run:
wrk -t4 -c100 -d30s http://localhost:3000/events
```

**Expected**: Page should handle concurrent requests without crashing.

### Database Query Performance

```bash
npx prisma studio
```

Check query times for:

- Fetching all events
- Filtering by event_type
- Join queries for ConfirmedEvent

**Optimization**: Add indexes if queries are slow:

```prisma
@@index([event_type])
@@index([created_at])
```

---

## 📝 Test Data Cleanup

### Reset Database for Clean Testing

```bash
# WARNING: This deletes ALL data
npx prisma migrate reset
```

### Delete Specific Test Data

```bash
npx prisma studio
```

Manually delete test records from tables.

### Clear Supabase Storage

1. Go to Supabase Dashboard → Storage
2. Select files in buckets
3. Click Delete

---

## ✅ Final Verification

After all tests pass:

1. ✅ Events system fully functional
2. ✅ Admin can manage events
3. ✅ Users can browse and purchase
4. ✅ Payment flow works end-to-end
5. ✅ Transaction approval system works
6. ✅ Data persists correctly in database
7. ✅ Files upload to storage successfully
8. ✅ All API endpoints respond correctly

---

## 📚 Next Steps

After testing:

1. Deploy to production (Vercel, etc.)
2. Update environment variables for production
3. Setup monitoring (Sentry, LogRocket)
4. Enable email notifications (SendGrid)
5. Add more test data
6. Implement additional features

---

**Happy Testing! 🎉**

**Last Updated**: December 23, 2025
