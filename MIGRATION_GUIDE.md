# Backend & Events Migration Guide

## Overview

This guide documents all files and configurations needed to migrate the admin panel, events system, and backend functionality from the Breeze project to another Next.js project.

---

## 📋 Table of Contents

1. [Files & Folders to Copy](#files--folders-to-copy)
2. [Backend Functionality Overview](#backend-functionality-overview)
3. [Required Packages](#required-packages)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Migration Steps](#migration-steps)
7. [Configuration Changes Needed](#configuration-changes-needed)

---

## 🗂️ Files & Folders to Copy

### Core Backend Files

#### 1. **Database & ORM**

```
prisma/
  └── schema.prisma                    # Database schema with all models

lib/
  ├── prisma.ts                        # Prisma client instance
  └── utils.ts                         # Utility functions
```

#### 2. **Authentication & Middleware**

```
middleware.ts                          # Route protection middleware

utils/
  └── supabase/
      ├── client.ts                    # Supabase client for browser
      ├── server.ts                    # Supabase client for server
      └── middleware.ts                # Session management middleware
```

#### 3. **API Routes**

```
app/
  └── api/
      ├── checkout/
      │   └── route.ts                 # Cart checkout endpoint
      ├── pay/
      │   └── route.ts                 # Payment submission endpoint
      ├── products/
      │   └── route.ts                 # Products listing endpoint
      └── breeze-admin/
          ├── confirm/
          │   └── route.ts             # Transaction approval/rejection
          └── users/
              └── route.ts             # User roles management
```

#### 4. **Admin Panel**

```
app/
  └── (admin)/
      ├── layout.tsx                   # Admin layout wrapper
      └── admin/
          ├── login/
          │   ├── page.tsx            # Admin login page
          │   └── action.ts           # Login/signup server actions
          ├── clubs/
          │   ├── page.tsx            # Club events management page
          │   ├── layout.tsx          # Clubs layout
          │   ├── actions.ts          # Event CRUD operations
          │   ├── add-event.tsx       # Add event form
          │   ├── edit-event-dialog.tsx # Edit event dialog
          │   ├── event-table.tsx     # Events table component
          │   └── participants/
          │       └── page.tsx        # Event participants view
          └── breeze-admin/
              ├── page.tsx            # Main admin dashboard
              ├── layout.tsx          # Admin dashboard layout
              ├── transaction-table.tsx # Transaction table
              ├── approved/
              │   └── page.tsx        # Approved transactions view
              └── users/
                  ├── page.tsx        # User management page
                  └── actions.ts      # User management actions
```

#### 5. **Events System (Frontend)**

```
app/
  └── (user)/
      └── events/
          ├── page.tsx                 # Main events page
          ├── cultural/
          │   └── page.tsx            # Cultural events listing
          ├── technical/
          │   └── page.tsx            # Technical events listing
          └── [id]/
              └── page.tsx            # Individual event detail page
```

#### 6. **Cart & Checkout System**

```
app/
  └── (user)/
      ├── cart/
      │   └── page.tsx                # Shopping cart page
      └── checkout/
          └── page.tsx                # Checkout page
```

#### 7. **Components**

**Admin Components:**

```
components/
  └── breeze-admin/
      └── transaction-verify.tsx      # Transaction verification component
```

**Events Components:**

```
components/
  └── events/
      ├── BasicCards.tsx              # Event cards display
      ├── bottombuttons.tsx           # Navigation buttons
      ├── bottomSection.tsx           # Bottom section layout
      ├── CardSection.tsx             # Card section layout
      ├── DropDown.tsx                # Dropdown filter
      ├── heading.tsx                 # Page heading
      ├── heading2.tsx                # Secondary heading
      ├── leftdropdown.tsx            # Left dropdown menu
      └── mobiledrop.tsx              # Mobile dropdown
```

**Cart & Checkout Components:**

```
components/
  ├── cart/
  │   ├── CartDisplay.tsx             # Main cart display
  │   ├── CartDisplayEvent.tsx        # Event cart items
  │   ├── CartDisplayMerch.tsx        # Merch cart items
  │   └── CheckoutButton.tsx          # Checkout button
  └── checkout/
      └── CheckoutForm.tsx            # Payment form
```

#### 8. **Configuration Files**

```
.env                                   # Environment variables (template)
tsconfig.json                         # TypeScript configuration
next.config.mjs                       # Next.js configuration
tailwind.config.ts                    # Tailwind CSS configuration
components.json                       # shadcn/ui components config
postcss.config.mjs                    # PostCSS configuration
```

#### 9. **Actions & Server Functions**

```
app/
  └── actions.ts                      # Global server actions (if any)
```

---

## 🔧 Backend Functionality Overview

### 1. **Authentication System**

- **Supabase Auth** for user authentication
- **Role-based Access Control** (RBAC)
- Roles stored in `Roles` table (BREEZE admin vs Club admin)
- Middleware protects `/admin/*` and `/api/breeze-admin/*` routes
- Auto-redirects based on user role

### 2. **Event Management**

- **CRUD Operations** for events
  - Create new events with image upload to Supabase Storage
  - Read/list events by type (Cultural/Technical)
  - Update event details
  - Delete events with cascade
- Events categorized as Cultural or Technical
- Participant tracking per event

### 3. **E-commerce System**

- **Products**: Events and Merchandise
- **Shopping Cart**: Client-side cart management
- **Checkout Flow**:
  1. Submit cart → Creates `PendingTransaction`
  2. User fills payment form with proof upload
  3. Moves to `SubmittedTransaction`
  4. Admin approves/rejects
  5. On approval → Creates `ConfirmedEvent`/`ConfirmedMerch` records

### 4. **Transaction Management**

- Three-stage transaction lifecycle:
  1. **PendingTransaction**: Created during checkout
  2. **SubmittedTransaction**: After payment proof upload
  3. **ConfirmedEvent/ConfirmedMerch**: After admin approval
- Admin dashboard to review transactions
- Image proof storage in Supabase Storage
- Email notifications (SendGrid - commented out in code)

### 5. **Accommodation System**

- Day-wise accommodation options (DAY1, DAY2, DAY3)
- Pricing based on number of days selected
- Integrated with checkout flow

### 6. **Database Models**

- **EventItem**: Event details (name, description, price, venue, etc.)
- **MerchItem**: Merchandise products
- **PendingTransaction**: Cart before payment
- **SubmittedTransaction**: Payment submissions awaiting approval
- **ConfirmedEvent**: Approved event registrations
- **ConfirmedMerch**: Approved merchandise orders
- **Roles**: User role management

---

## 📦 Required Packages

### Core Dependencies

```json
{
  "@prisma/client": "^5.22.0",
  "@supabase/auth-helpers-nextjs": "^0.10.0",
  "@supabase/ssr": "^0.5.2",
  "@supabase/supabase-js": "^2.46.1",
  "prisma": "^5.22.0",
  "next": "^14.2.18",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

### Form & Validation

```json
{
  "@hookform/resolvers": "^3.9.1",
  "react-hook-form": "^7.53.2",
  "zod": "^3.23.8"
}
```

### UI Components (shadcn/ui)

```json
{
  "@radix-ui/react-accordion": "^1.2.1",
  "@radix-ui/react-avatar": "^1.1.1",
  "@radix-ui/react-checkbox": "^1.1.3",
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-dropdown-menu": "^2.1.2",
  "@radix-ui/react-icons": "^1.3.0",
  "@radix-ui/react-label": "^2.1.0",
  "@radix-ui/react-select": "^2.1.2",
  "@radix-ui/react-separator": "^1.1.0",
  "@radix-ui/react-slot": "^1.1.0",
  "@radix-ui/react-scroll-area": "^1.1.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.4.0",
  "tailwindcss-animate": "^1.0.7",
  "lucide-react": "^0.417.0"
}
```

### Data Table

```json
{
  "@tanstack/react-table": "^8.20.5"
}
```

### Email (Optional)

```json
{
  "@sendgrid/mail": "^8.1.4"
}
```

### Utilities

```json
{
  "date-fns": "^4.1.0",
  "react-icons": "^5.3.0"
}
```

### Dev Dependencies

```json
{
  "@types/node": "^20",
  "@types/react": "18.3.12",
  "@types/react-dom": "^18",
  "typescript": "5.7.2",
  "tailwindcss": "^3.4.1",
  "postcss": "^8",
  "eslint": "^8",
  "eslint-config-next": "14.2.5"
}
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Database Connection (Supabase PostgreSQL)
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# Optional: SendGrid for Email Notifications
SENDGRID_API_KEY=[YOUR_SENDGRID_KEY]
```

### Getting Supabase Credentials:

1. Create a Supabase project at https://supabase.com
2. Go to Project Settings → Database
   - Copy "Connection string" for `DATABASE_URL`
   - Copy "Direct connection" for `DIRECT_URL`
3. Go to Project Settings → API
   - Copy "Project URL" for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🗄️ Database Setup

### 1. Initialize Prisma

```bash
npx prisma generate
npx prisma db push
```

### 2. Supabase Storage Buckets

Create these storage buckets in Supabase Dashboard:

1. **transaction-proofs**: For payment proof images

   - Make it private
   - Allow authenticated uploads

2. **assets**: For event posters
   - Make it public (for displaying images)
   - Allow authenticated uploads

### 3. Database Schema

The Prisma schema includes:

- **EventItem**: Events with pricing and details
- **MerchItem**: Merchandise products
- **PendingTransaction**: Temporary cart storage
- **SubmittedTransaction**: Payment submissions
- **ConfirmedEvent**: Approved event registrations
- **ConfirmedMerch**: Approved merchandise orders
- **Roles**: User permissions (club_name: "BREEZE" for admin)

### 4. Initial Admin Setup

After first admin account creation, manually add to `Roles` table:

```sql
INSERT INTO "Roles" (id, club_name, email)
VALUES ('[SUPABASE_USER_ID]', 'BREEZE', '[ADMIN_EMAIL]');
```

---

## 🚀 Migration Steps

### Step 1: Setup New Project Structure

1. Copy all folders and files listed in "Files & Folders to Copy" section
2. Maintain the exact folder structure

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Configure Environment

1. Copy `.env` file
2. Update with your Supabase credentials
3. Update SendGrid API key (if using email notifications)

### Step 4: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed initial data
npx prisma db seed
```

### Step 5: Setup Supabase Storage

1. Create `transaction-proofs` bucket (private)
2. Create `assets` bucket (public)
3. Configure bucket policies for authentication

### Step 6: Create Initial Admin User

1. Run the app: `npm run dev`
2. Navigate to `/admin/login`
3. Sign up with admin credentials
4. Add the user to `Roles` table with `club_name = 'BREEZE'`

### Step 7: Test Core Functionality

- [ ] Admin login/logout
- [ ] Create/edit/delete events
- [ ] Browse events (Cultural/Technical)
- [ ] Add items to cart
- [ ] Complete checkout flow
- [ ] Admin transaction approval

---

## ⚙️ Configuration Changes Needed

### 1. **Update Path Aliases**

Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 2. **Next.js Middleware Matcher**

In `middleware.ts`, the matcher protects these routes:

```typescript
export const config = {
  matcher: ["/admin/:path*", "/api/breeze-admin/:path*"],
};
```

### 3. **Tailwind Configuration**

Ensure your `tailwind.config.ts` includes:

```typescript
content: [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
];
```

### 4. **Image Domains (if using Next.js Image)**

Add to `next.config.mjs` if needed:

```javascript
images: {
  domains: ['[YOUR_SUPABASE_PROJECT].supabase.co'],
}
```

### 5. **Update SendGrid Email Template**

In `/api/breeze-admin/confirm/route.ts` (lines 46-57), uncomment and configure:

```typescript
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: transaction.email,
  from: "your-email@domain.com", // Update sender email
  templateId: "d-[YOUR_TEMPLATE_ID]", // Update template ID
  dynamic_template_data: {
    name: transaction.name,
    receipt_url: `https://your-domain.com/reciept/${transaction.token}`,
  },
};
```

### 6. **Public Assets**

You may need to copy these folders if events/components reference them:

```
public/
  ├── fonts/           # Custom fonts used
  ├── Icons/           # Icon assets
  └── images/          # Public images
```

---

## 📝 Additional Notes

### UI Components

The project uses **shadcn/ui** components. If your target project doesn't have them:

```bash
npx shadcn-ui@latest init
```

Then install required components:

```bash
npx shadcn-ui@latest add button dialog table form input label select checkbox scroll-area separator accordion avatar dropdown-menu
```

### Frontend Integration

If your frontend is different:

- Keep all backend files (API routes, Prisma, middleware)
- Rebuild the events page UI using your frontend framework
- Ensure the same data structure for cart/checkout
- Update API endpoints if needed

### Security Considerations

1. **RLS (Row Level Security)**: The Prisma schema mentions RLS - ensure it's configured in Supabase
2. **Authentication**: Middleware protects admin routes - test thoroughly
3. **Environment Variables**: Never commit `.env` to version control
4. **File Uploads**: Validate file types and sizes on upload

### Performance Optimization

1. Consider implementing ISR (Incremental Static Regeneration) for events pages
2. Add caching for product listings
3. Optimize images for web (use Next.js Image component)

---

## 🆘 Troubleshooting

### Common Issues:

1. **Prisma Client Not Generated**

   ```bash
   npx prisma generate
   ```

2. **Middleware Not Working**

   - Check environment variables are set
   - Verify Supabase project is active
   - Check middleware matcher paths

3. **Storage Upload Fails**

   - Verify storage buckets exist
   - Check bucket permissions
   - Ensure user is authenticated

4. **Database Connection Issues**

   - Verify DATABASE_URL format
   - Check Supabase project status
   - Try DIRECT_URL for migrations

5. **Type Errors**
   - Run `npx prisma generate` after schema changes
   - Restart TypeScript server in VS Code

---

## 📚 Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

## ✅ Migration Checklist

- [ ] Copy all listed files and folders
- [ ] Install all required packages
- [ ] Configure environment variables
- [ ] Setup Supabase project and storage
- [ ] Initialize Prisma and push schema
- [ ] Create initial admin user
- [ ] Test authentication flow
- [ ] Test event management
- [ ] Test cart and checkout
- [ ] Test transaction approval
- [ ] Configure email notifications (optional)
- [ ] Update branding/styling as needed
- [ ] Deploy and test in production

---

**Last Updated**: December 23, 2025
**Project**: Breeze '25 Backend Migration
