# Backend System Architecture

## 🏗️ System Overview

The Breeze backend is a full-stack event management and e-commerce system built with Next.js 14, Prisma ORM, and Supabase for authentication and storage.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  (Next.js App Router - React Server Components)                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             ├─ Public Routes (Events, Cart, Checkout)
             │  └─ /events, /cart, /checkout
             │
             ├─ Protected Admin Routes
             │  └─ /admin/* (Middleware Protected)
             │
             └─ API Routes
                └─ /api/* (RESTful endpoints)

┌─────────────────────────────────────────────────────────────────┐
│                      Middleware Layer                            │
│  - Supabase Auth Session Management                             │
│  - Role-based Access Control (RBAC)                             │
│  - Route Protection for /admin/* and /api/breeze-admin/*        │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────┴────────────────────────────────────────────────────┐
│                      Business Logic Layer                        │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Event           │  │  Transaction     │  │  Auth        │ │
│  │  Management      │  │  Processing      │  │  Management  │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Cart            │  │  Accommodation   │  │  File        │ │
│  │  Operations      │  │  Booking         │  │  Uploads     │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────┴────────────────────────────────────────────────────┐
│                       Data Layer                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Prisma ORM (Database Abstraction)                       │  │
│  └────────────┬─────────────────────────────────────────────┘  │
│               │                                                  │
│  ┌────────────┴─────────────────────────────────────────────┐  │
│  │  PostgreSQL Database (Supabase)                          │  │
│  │  - EventItem, MerchItem                                  │  │
│  │  - PendingTransaction, SubmittedTransaction              │  │
│  │  - ConfirmedEvent, ConfirmedMerch                        │  │
│  │  - Roles                                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Supabase Auth   │  │  Supabase        │  │  SendGrid    │ │
│  │  (User Auth)     │  │  Storage         │  │  (Email)     │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Authorization Flow

### Authentication System

```
1. User attempts to access /admin/*
   ↓
2. Middleware intercepts request
   ↓
3. Check Supabase auth session
   ↓
   ├─ No session → Redirect to /admin/login
   │
   └─ Has session → Check role in Roles table
      ↓
      ├─ Role = "BREEZE" → Allow access to /admin/breeze-admin/*
      │
      └─ Role = Other club → Restrict to /admin/clubs/*
```

### Role-Based Access Control (RBAC)

- **Super Admin**: `club_name = "BREEZE"` - Full system access
- **Club Admin**: `club_name = [CLUB_NAME]` - Limited to club events

---

## 💾 Database Schema & Relationships

### Entity Relationship Diagram

```
┌──────────────────┐
│   EventItem      │
│ ──────────────── │
│ id (PK)          │◄──────┐
│ event_name       │       │
│ event_price      │       │ Many
│ event_type       │       │
│ ...              │       │
└──────────────────┘       │
                           │
┌──────────────────┐       │
│   MerchItem      │       │
│ ──────────────── │       │
│ id (PK)          │◄──┐   │
│ product_name     │   │   │
│ product_price    │   │   │
│ ...              │   │   │
└──────────────────┘   │   │
                       │   │
                       │   │
                       │ Many
                       │   │
                  ┌────┴───┴──────────────┐
                  │  ConfirmedEvent       │
                  │ ───────────────────── │
                  │ token (PK, FK)        │
                  │ id (PK, FK)           │
┌────────────────►│ quantity              │
│                 └───────────────────────┘
│
│                 ┌───────────────────────┐
│                 │  ConfirmedMerch       │
│                 │ ───────────────────── │
│                 │ token (PK, FK)        │
│                 │ id (PK, FK)           │
│            ┌───►│ size                  │
│            │    │ quantity              │
│            │    └───────────────────────┘
│            │
│            │
│   ┌────────┴─────────────────┐
│   │ SubmittedTransaction     │
│   │ ──────────────────────── │
│   │ token (PK)               │
│   │ name                     │
│   │ email                    │
│   │ phone                    │
│   │ amount                   │
└───┤ approved                 │
    │ cart (JSON)              │
    │ accommodation[]          │
    │ proof (image path)       │
    └──────────────────────────┘
            ▲
            │ Converted from
            │
    ┌───────┴──────────────────┐
    │  PendingTransaction      │
    │ ──────────────────────── │
    │ id (PK)                  │
    │ cart (JSON)              │
    │ amount                   │
    │ accommodation[]          │
    │ accommodation_price      │
    └──────────────────────────┘

    ┌──────────────────────────┐
    │  Roles                   │
    │ ──────────────────────── │
    │ id (PK) - Supabase UID   │
    │ club_name                │
    │ email                    │
    └──────────────────────────┘
```

### Key Relationships:

1. **EventItem → ConfirmedEvent**: One-to-Many (An event can be in many transactions)
2. **MerchItem → ConfirmedMerch**: One-to-Many (A merch item can be in many orders)
3. **SubmittedTransaction → ConfirmedEvent**: One-to-Many (A transaction can have multiple events)
4. **SubmittedTransaction → ConfirmedMerch**: One-to-Many (A transaction can have multiple merch items)

---

## 🔄 Transaction Lifecycle

### Complete Flow Diagram

```
                        [User Browses Events]
                                 ↓
                        [Adds Items to Cart]
                                 ↓
                        [Proceeds to Checkout]
                                 ↓
              ┌──────────────────────────────────┐
              │  POST /api/checkout              │
              │  - Validates cart items          │
              │  - Calculates total amount       │
              │  - Generates unique token        │
              │  - Creates PendingTransaction    │
              └──────────────┬───────────────────┘
                             ↓
                   [Redirects to Payment Form]
                             ↓
              ┌──────────────────────────────────┐
              │  User Fills Form:                │
              │  - Name, Email, Phone            │
              │  - Address                       │
              │  - Student status                │
              │  - Payment proof image           │
              └──────────────┬───────────────────┘
                             ↓
              ┌──────────────────────────────────┐
              │  POST /api/pay                   │
              │  - Validates form data           │
              │  - Uploads proof to Supabase     │
              │  - Creates SubmittedTransaction  │
              │  - Deletes PendingTransaction    │
              └──────────────┬───────────────────┘
                             ↓
                   [Transaction Pending Admin Review]
                             ↓
              ┌──────────────────────────────────┐
              │  Admin Reviews Transaction       │
              │  in /admin/breeze-admin          │
              └──────────────┬───────────────────┘
                             ↓
                    ┌────────┴────────┐
                    ↓                 ↓
        ┌────────────────┐   ┌──────────────────┐
        │  APPROVE       │   │  REJECT          │
        └────────┬───────┘   └──────┬───────────┘
                 ↓                   ↓
    ┌────────────────────────┐   ┌──────────────────┐
    │ POST /api/breeze-      │   │ POST /api/breeze-│
    │ admin/confirm          │   │ admin/confirm    │
    │ status: "APPROVED"     │   │ status: "REJECTED"│
    │                        │   │                  │
    │ - Sets approved=true   │   │ - Deletes        │
    │ - Creates Confirmed-   │   │   Submitted-     │
    │   Event/Merch records  │   │   Transaction    │
    │ - Sends receipt email  │   │                  │
    │   (optional)           │   │                  │
    └────────────────────────┘   └──────────────────┘
                 ↓
        [User Receives Receipt]
```

### State Transitions:

1. **Browse → Cart**: Client-side state management
2. **Cart → Pending**: `/api/checkout` creates PendingTransaction
3. **Pending → Submitted**: `/api/pay` with form submission
4. **Submitted → Confirmed**: Admin approval via `/api/breeze-admin/confirm`
5. **Submitted → Deleted**: Admin rejection

---

## 🛣️ API Routes Documentation

### Public APIs

#### `POST /api/checkout`

Creates a pending transaction from cart data.

**Request Body:**

```typescript
{
  cart: {
    [itemId: string]: {
      [size: string]: number  // quantity
    }
  },
  accommodation: [boolean, boolean, boolean]  // DAY1, DAY2, DAY3
}
```

**Response:**

```typescript
{
  message: "Success",
  id: string  // Transaction token
}
```

**Logic:**

1. Fetch all merch and event items from database
2. Calculate total price from cart
3. Calculate accommodation price based on days
4. Generate random token
5. Create PendingTransaction

---

#### `POST /api/pay`

Submits payment information and converts pending to submitted transaction.

**Request (FormData):**

```typescript
{
  name: string,
  email: string,
  phone: string,
  address: string,
  college_status: string,
  amount: string,
  proofImage: File,
  token: string
}
```

**Response:**

```typescript
{
  message: "Payment submitted successfully";
}
```

**Logic:**

1. Validate form data with Zod schema
2. Upload proof image to Supabase Storage
3. Retrieve cart from PendingTransaction
4. Create SubmittedTransaction
5. Delete PendingTransaction

---

#### `GET /api/products`

Returns list of all merchandise products.

**Response:**

```typescript
Array<{
  product_name: string;
  product_description: string;
  product_price: number;
}>;
```

---

### Protected Admin APIs (Require Authentication)

#### `POST /api/breeze-admin/confirm`

Approves or rejects a submitted transaction.

**Request Body:**

```typescript
{
  transactionId: string,
  status: "APPROVED" | "REJECTED"
}
```

**Logic (APPROVED):**

1. Fetch transaction details
2. Parse cart JSON
3. Start database transaction
4. Set `approved = true`
5. Create ConfirmedEvent records for events
6. Create ConfirmedMerch records for merchandise
7. (Optional) Send receipt email via SendGrid

**Logic (REJECTED):**

1. Delete SubmittedTransaction record

---

#### `GET /api/breeze-admin/users`

Returns list of all user roles.

**Response:**

```typescript
{
  data: Array<{
    id: string;
    club_name: string;
    email: string;
  }>;
}
```

---

## 🎯 Server Actions

Server Actions are Next.js 14's server-side functions called from client components.

### Event Management Actions (`app/(admin)/admin/clubs/actions.ts`)

#### `createEvent(formData: FormData)`

Creates a new event with image upload.

**Steps:**

1. Extract event poster from FormData
2. Upload to Supabase Storage (`assets` bucket)
3. Create EventItem in database
4. Revalidate `/admin/clubs` page cache

---

#### `updateEvent(eventId: string, formData: FormData)`

Updates existing event details.

**Steps:**

1. Extract event data from FormData
2. Update EventItem record
3. Revalidate page cache

---

#### `deleteEvent(eventId: string)`

Deletes an event (with cascade to ConfirmedEvents).

**Steps:**

1. Delete EventItem by ID
2. Prisma cascade deletes related ConfirmedEvent records
3. Revalidate page cache

---

### Authentication Actions (`app/(admin)/admin/login/action.ts`)

#### `login(formData: FormData)`

Authenticates admin user with Supabase.

**Steps:**

1. Extract email and password
2. Sign in with Supabase Auth
3. Query Roles table for user role
4. Redirect based on role:
   - BREEZE → `/admin/breeze-admin`
   - Other → `/admin/clubs`

---

#### `signup(formData: FormData)`

Registers new admin user (requires manual role assignment).

**Steps:**

1. Extract email and password
2. Create Supabase auth user
3. Redirect to home page
4. **Manual step**: Add user to Roles table

---

## 🗂️ Component Architecture

### Admin Components

#### TransactionVerify (`components/breeze-admin/transaction-verify.tsx`)

Dialog component for reviewing and approving/rejecting transactions.

**Features:**

- Displays transaction details (name, email, phone, amount)
- Shows cart items (events and merchandise)
- Displays payment proof image from Supabase Storage
- Accept/Deny buttons with loading states
- Calls `/api/breeze-admin/confirm` API

**Props:**

```typescript
{
  transaction: SubmittedTransaction,
  eventMap: Map<string, EventItem>,
  merchMap: Map<string, MerchItem>
}
```

---

### Events Components

#### BasicCards (`components/events/BasicCards.tsx`)

Grid display of event cards.

**Features:**

- Responsive grid layout
- Event name, price, venue, date display
- Links to individual event detail pages

---

#### CardSection (`components/events/CardSection.tsx`)

Section wrapper for event cards with filtering.

---

#### Dropdown Components

- `DropDown.tsx` - Filter events by category
- `leftdropdown.tsx` - Left-aligned dropdown
- `mobiledrop.tsx` - Mobile-optimized dropdown

---

### Cart & Checkout Components

#### CartDisplay (`components/cart/CartDisplay.tsx`)

Main cart page component orchestrating cart display.

**Sub-components:**

- `CartDisplayEvent.tsx` - Event items in cart
- `CartDisplayMerch.tsx` - Merchandise items in cart
- `CheckoutButton.tsx` - Proceed to checkout button

---

#### CheckoutForm (`components/checkout/CheckoutForm.tsx`)

Payment form with file upload.

**Features:**

- React Hook Form with Zod validation
- File upload for payment proof
- Accommodation day selection
- Form submission to `/api/pay`
- Success/error handling

**Fields:**

- Name, Email, Phone (required)
- Address (required)
- College status (student/non-student)
- Payment proof image
- Accommodation checkboxes

---

## 🔒 Security Features

### 1. Authentication

- **Supabase Auth** handles user authentication
- Session cookies managed by Supabase SSR
- Token-based authentication

### 2. Middleware Protection

- Protects `/admin/*` routes
- Protects `/api/breeze-admin/*` endpoints
- Validates user session on every request
- Checks user role from database

### 3. Role-Based Access Control

```typescript
// Middleware logic
if (!user && !pathname.startsWith("/admin/login")) {
  redirect("/admin/login");
}

if (user) {
  const role = await getRoleFromDB(user.id);
  if (
    role.club_name !== "BREEZE" &&
    pathname.startsWith("/admin/breeze-admin")
  ) {
    redirect("/admin/clubs");
  }
}
```

### 4. Input Validation

- Zod schemas validate all API inputs
- Form validation with react-hook-form
- Type-safe database queries with Prisma

### 5. File Upload Security

- Files stored in private Supabase buckets
- Authenticated access required
- File type validation (recommended to add)

### 6. Database Security

- Row Level Security (RLS) enabled in Supabase
- Prisma prevents SQL injection
- Environment variables for sensitive data

---

## 📈 Data Flow Examples

### Example 1: Creating an Event

```
Admin fills form in /admin/clubs
        ↓
    Click Submit
        ↓
createEvent(formData) Server Action
        ↓
Upload image to Supabase Storage
        ↓
Get image URL (fullPath)
        ↓
prisma.eventItem.create({ ... })
        ↓
revalidatePath("/admin/clubs")
        ↓
Page refreshes with new event
```

---

### Example 2: User Purchasing Event Tickets

```
User views /events
        ↓
Click event → /events/[id]
        ↓
Add to cart (client-side state)
        ↓
Navigate to /cart
        ↓
Click "Checkout"
        ↓
POST /api/checkout
        ↓
PendingTransaction created (id: abc123)
        ↓
Redirect to /checkout?token=abc123
        ↓
User fills payment form
        ↓
POST /api/pay (with FormData)
        ↓
Image uploaded to Supabase Storage
        ↓
SubmittedTransaction created
        ↓
PendingTransaction deleted
        ↓
Redirect to /thank-you
        ↓
Admin reviews in /admin/breeze-admin
        ↓
Click "Accept"
        ↓
POST /api/breeze-admin/confirm
        ↓
ConfirmedEvent records created
        ↓
Email sent to user (optional)
        ↓
User receives receipt
```

---

## 🧩 Key Design Patterns

### 1. Server Components First

- Most pages are React Server Components
- Direct database queries in components
- No client-side state for static data

### 2. Server Actions for Mutations

- Form submissions use Server Actions
- Automatic revalidation with `revalidatePath`
- Type-safe with TypeScript

### 3. API Routes for Complex Logic

- Transaction processing
- External service integration
- Non-form POST requests

### 4. Progressive Enhancement

- Forms work without JavaScript
- Server-side validation
- Client-side validation for UX

### 5. Transaction Pattern

- Prisma transactions for data consistency
- Atomic operations (create + delete together)
- Rollback on failure

---

## 🎨 UI/UX Patterns

### Admin Dashboard

- Table-based transaction views
- Modal dialogs for actions
- Real-time status updates
- Filtering and sorting

### Events Pages

- Grid layout for event cards
- Category-based filtering
- Search functionality (can be added)
- Responsive design

### Checkout Flow

- Multi-step process (Cart → Checkout → Thank You)
- Form validation with instant feedback
- Loading states during submission
- Error handling with user-friendly messages

---

## 🔧 Configuration Files

### `middleware.ts`

Protects admin routes and validates authentication.

### `lib/prisma.ts`

Singleton Prisma client instance (prevents connection pool exhaustion in development).

### `utils/supabase/`

- `client.ts` - Browser-side Supabase client
- `server.ts` - Server-side Supabase client (with cookie handling)
- `middleware.ts` - Session refresh in middleware

---

## 📊 Performance Considerations

### Database Queries

- Use `select` to fetch only needed fields
- Implement pagination for large datasets
- Index frequently queried fields (id, token, email)

### Image Optimization

- Next.js Image component for automatic optimization
- Store images in Supabase CDN
- Lazy loading for below-the-fold images

### Caching Strategy

- Static pages for events (ISR or SSG)
- `revalidatePath` after mutations
- Dynamic routes with ISR for product pages

### Server Components

- Reduce client-side JavaScript
- Parallel data fetching
- Streaming for faster TTFB

---

## 🚀 Deployment Considerations

### Environment Variables

Ensure all are set in production:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SENDGRID_API_KEY` (if using email)

### Database Migrations

```bash
npx prisma migrate deploy
```

### Build Process

```bash
npm run build
npm start
```

### Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor Supabase usage quotas
- Track API response times

---

## 📝 Future Enhancements

### Potential Features:

1. **Email Notifications** - Activate SendGrid integration
2. **Payment Gateway** - Integrate Razorpay/Stripe
3. **Invoice Generation** - PDF receipts
4. **Analytics Dashboard** - Sales and registration analytics
5. **Search & Filters** - Advanced event search
6. **User Accounts** - Track order history
7. **Inventory Management** - Merch stock tracking
8. **QR Code Tickets** - Event check-in system

---

**Document Version**: 1.0  
**Last Updated**: December 23, 2025  
**Maintained By**: Breeze Development Team
