# Email Notification Setup Guide

## Overview

The transaction approval system now sends automated email notifications to customers when their transactions are approved or rejected. This guide covers setting up SendGrid for email delivery.

## Required Environment Variables

Add these to your `.env.local` file (create it if it doesn't exist):

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Application URL (for receipt links in emails)
NEXT_PUBLIC_APP_URL=https://breezesnu.com
# For local development, use: http://localhost:3000
```

## SendGrid Setup

### 1. Create SendGrid Account

1. Go to [SendGrid.com](https://sendgrid.com/)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### 2. Create API Key

1. Navigate to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it (e.g., "Breeze Transaction Emails")
4. Select **Full Access** permission
5. Copy the generated API key
6. Add to `.env.local`: `SENDGRID_API_KEY=SG.xxxxx...`

### 3. Verify Sender Email

SendGrid requires you to verify the "from" email address before sending.

#### Option A: Single Sender Verification (Easiest)

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in details:
   - **From Name**: BREEZE - SNU
   - **From Email**: payments@breezesnu.com (or your domain email)
   - **Reply To**: support@breezesnu.com
4. Check your email and click verification link

#### Option B: Domain Authentication (Production Recommended)

1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Enter your domain (e.g., breezesnu.com)
4. Add the provided DNS records to your domain
5. Wait for verification (can take 24-48 hours)

### 4. Update Sender Email in Code

If you use a different sender email than `payments@breezesnu.com`, update it in:

**File**: `app/api/breeze-admin/confirm/route.ts`

```typescript
// Line ~150 and ~190
from: {
  email: "your-verified-email@yourdomain.com", // Update this
  name: "BREEZE - SNU"
},
```

### 5. Update Support Email

Update the support contact email in the rejection template:

**File**: `app/api/breeze-admin/confirm/route.ts`

```typescript
// Line ~200
<p>
  If you have any questions, please contact us at
  <a href="mailto:your-support@yourdomain.com">your-support@yourdomain.com</a>
</p>
```

## Email Templates

### Approval Email

Sent when admin approves a transaction. Includes:

- Success message
- Order details (amount, transaction ID)
- Receipt link (valid for 30 days)
- Event/merch breakdown

### Rejection Email

Sent when admin rejects a transaction. Includes:

- Rejection notification
- Admin's rejection reason
- Support contact information
- Instructions for next steps

## Testing Email Delivery

### 1. Local Testing Setup

```env
# .env.local for development
SENDGRID_API_KEY=SG.your_test_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Test Approval Flow

1. Create a test transaction (use your email)
2. Go to admin panel → Pending Transactions
3. Click a transaction and click **Accept**
4. Check for success toast: "✓ Transaction Approved - Approval email sent to customer successfully"
5. Check your email inbox (and spam folder)

### 3. Test Rejection Flow

1. Click a pending transaction
2. Click **Reject** button
3. Enter a test reason: "Payment proof is unclear"
4. Click **Confirm Rejection**
5. Check for success toast and email delivery

### 4. Email Status Tracking

The system tracks email delivery status:

- **Successful**: `email_sent = true` in database
- **Failed**: `email_sent = false` in database

You can see the status in the Rejected tab:

- ✓ Sent = Green badge
- ✗ Failed = Red badge

## Troubleshooting

### "Failed to send email" Error

**Possible Causes:**

1. Invalid API key → Verify key in SendGrid dashboard
2. Unverified sender email → Complete sender verification
3. Rate limit exceeded → Free tier: 100/day limit
4. Network issues → Check internet connection

**Check SendGrid Activity:**

1. Go to SendGrid dashboard → Activity
2. View email delivery attempts and errors
3. Check bounce/spam reports

### Email Not Received

1. Check spam/junk folder
2. Verify recipient email in transaction details
3. Check SendGrid Activity for delivery status
4. Ensure sender email is verified

### API Key Not Working

1. Verify key has **Full Access** permission
2. Re-create API key if needed
3. Ensure no extra spaces in `.env.local`
4. Restart Next.js dev server after adding key

### Email Shows HTML Code

SendGrid automatically handles HTML → Plain text conversion for clients that don't support HTML. No action needed.

## Production Deployment

### Vercel/Netlify

1. Go to project settings → Environment Variables
2. Add `SENDGRID_API_KEY` as secret variable
3. Add `NEXT_PUBLIC_APP_URL` with production URL
4. Redeploy application

### Railway/Render

1. Add environment variables in dashboard
2. Restart service after adding variables

### Self-Hosted

1. Add to production `.env` file
2. Ensure file is not in git (add to `.gitignore`)
3. Restart application server

## Email Customization

### Change Email Design

Edit HTML templates in `app/api/breeze-admin/confirm/route.ts`:

```typescript
// Approval email HTML (line ~115)
const approvalHtml = `...`; // Modify here

// Rejection email HTML (line ~155)
const rejectionHtml = `...`; // Modify here
```

### Add CC/BCC

Add to SendGrid message:

```typescript
const message = {
  to: transaction.email,
  cc: "admin@breezesnu.com", // Copy to admin
  bcc: "archive@breezesnu.com", // Blind copy
  // ... rest of config
};
```

### Change Subject Line

```typescript
// Approval
subject: "Your BREEZE Order Has Been Confirmed! 🎉",

// Rejection
subject: "BREEZE Order Update - Action Required",
```

## Monitoring

### Check Email Status

View rejected transactions in admin panel:

- Green badge (✓ Sent): Email delivered successfully
- Red badge (✗ Failed): Email delivery failed

### SendGrid Dashboard

Monitor email metrics:

- Delivery rate
- Bounce rate
- Spam reports
- Open rate (requires tracking pixel)

## Security Notes

1. **Never commit API keys** to git repository
2. Add `.env.local` to `.gitignore`
3. Use different API keys for dev/staging/production
4. Rotate API keys periodically
5. Use restricted API keys (not full access) in production

## Cost Considerations

### SendGrid Free Tier

- 100 emails per day
- Sufficient for small to medium events
- No credit card required

### Paid Plans

If you exceed 100 emails/day:

- **Essentials**: $19.95/mo (40,000 emails)
- **Pro**: $89.95/mo (100,000 emails)

### Alternative Email Services

If SendGrid doesn't work for you:

- **Resend**: Modern API, generous free tier
- **Postmark**: Transaction email specialist
- **AWS SES**: $0.10 per 1,000 emails

To switch providers, update the email sending code in `route.ts` with the new service's SDK.

---

## Quick Reference

### Environment Variables

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://breezesnu.com
```

### Sender Emails

- **From**: payments@breezesnu.com
- **Reply-To**: support@breezesnu.com

### Email Status Check

- Admin panel → Rejected tab
- Green badge = Sent successfully
- Red badge = Failed to send

### Testing Checklist

- [ ] SendGrid account created
- [ ] API key generated and added to `.env.local`
- [ ] Sender email verified
- [ ] Test approval email received
- [ ] Test rejection email received
- [ ] Email status badges working
- [ ] Toast notifications appearing
