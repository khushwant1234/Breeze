# Database Setup & Migration Guide

## 🗄️ Setting Up a New Database

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name**: breeze-events (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
5. Click "Create new project" (takes ~2 minutes)

---

### Step 2: Get Database Credentials

Once your project is ready:

#### For Connection Pooling (Recommended for Next.js):

1. Go to **Project Settings** → **Database**
2. Scroll to "Connection string"
3. Select **"Connection pooling"** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
5. Replace `[PASSWORD]` with your actual database password

#### For Direct Connection (For Migrations):

1. In the same section, select **"Direct connection"** tab
2. Copy the connection string (it looks like):
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres
   ```
3. Replace `[PASSWORD]` with your actual database password

#### For Supabase Auth:

1. Go to **Project Settings** → **API**
2. Copy the **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy the **anon/public** key (long string starting with `eyJ...`)

---

### Step 3: Update Environment Variables

Create or update your `.env` file in the project root:

```env
# Database Connection (use the connection pooling URL)
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR_PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for migrations
DIRECT_URL="postgresql://postgres.xxxxx:[YOUR_PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

# Optional: SendGrid for Email Notifications
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**: Never commit `.env` to version control!

---

### Step 4: Migrate Schema to Database

Now that your database is configured, let's push the Prisma schema:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

**What this does:**

- Reads `prisma/schema.prisma`
- Creates all tables in your Supabase database
- Generates TypeScript types for Prisma Client

**Expected Output:**

```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database

🚀  Your database is now in sync with your Prisma schema. Done in XXXms

✔ Generated Prisma Client (v5.22.0) to .\node_modules\@prisma\client
```

---

### Step 5: Verify Database Setup

#### Option A: Using Prisma Studio

```bash
npx prisma studio
```

- Opens a GUI at `http://localhost:5555`
- View all tables and data
- Manually add/edit records

#### Option B: Using Supabase Dashboard

1. Go to your Supabase project
2. Click **"Table Editor"** in the sidebar
3. You should see these tables:
   - EventItem
   - MerchItem
   - PendingTransaction
   - SubmittedTransaction
   - ConfirmedEvent
   - ConfirmedMerch
   - Roles

---

### Step 6: Setup Supabase Storage Buckets

The application needs two storage buckets for file uploads:

#### 6.1 Create "transaction-proofs" Bucket (Private)

1. In Supabase Dashboard, go to **Storage**
2. Click **"Create a new bucket"**
3. Settings:
   - **Name**: `transaction-proofs`
   - **Public**: ❌ **OFF** (keep private)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: `image/jpeg, image/png, image/jpg, image/webp`
4. Click **Create bucket**

#### 6.2 Create "assets" Bucket (Public)

1. Click **"Create a new bucket"** again
2. Settings:
   - **Name**: `assets`
   - **Public**: ✅ **ON** (for event posters)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/jpg, image/webp`
3. Click **Create bucket**

#### 6.3 Set Bucket Policies

You can set policies using the Supabase SQL Editor for precise control:

**For transaction-proofs (Authenticated users only):**

1. Go to Supabase Dashboard → **SQL Editor**
2. Run these queries:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'transaction-proofs');

-- Allow authenticated users to view their uploads
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'transaction-proofs');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'transaction-proofs');
```

**For assets (Public read, authenticated write):**

```sql
-- Allow public to view assets (event posters)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');

-- Allow authenticated users to upload assets
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets');

-- Allow authenticated users to update assets
CREATE POLICY "Authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assets');

-- Allow authenticated users to delete assets
CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'assets');
```

**Alternative: Using UI**

If you prefer using the UI:

1. Click on bucket → **Policies** tab → **"New Policy"**
2. Select template or create custom policy
3. Set operation type (SELECT, INSERT, UPDATE, DELETE)
4. Set target roles (public, authenticated)
5. Add policy definition/check

---

### Step 7: Create Initial Admin User

Since there's no signup page, you need to create the admin user directly in Supabase.

#### 7.1 Create User in Supabase Dashboard

1. Go to your Supabase Dashboard
2. Click **"Authentication"** → **"Users"**
3. Click **"Add user"** or **"Invite user"** button
4. Choose **"Create new user"**
5. Fill in:
   - **Email**: Your admin email
   - **Password**: Choose a strong password (or auto-generate)
   - **Auto Confirm User**: ✅ **Check this** (so you can login immediately)
6. Click **"Create user"**
7. Copy the **User ID** (UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

#### 7.2 Add Role to Database

**Option A: Using Prisma Studio**

```bash
npx prisma studio
```

1. Open `Roles` table
2. Click "Add record"
3. Fill in:
   - **id**: Paste your User ID
   - **club_name**: `BREEZE`
   - **email**: Your email
4. Click Save

**Option B: Using Supabase SQL Editor**

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query (replace values):

```sql
INSERT INTO "Roles" (id, club_name, email)
VALUES ('your-user-id-here', 'BREEZE', 'your-email@example.com');
```

#### 7.3 Test Admin Access

1. Run the application: `npm run dev`
2. Go to `http://localhost:3000/admin/login`
3. Sign in with your credentials (email and password from Step 7.1)
4. Should redirect to `/admin/breeze-admin` ✅

---

## 🔄 Database Migration Commands

### Common Prisma Commands

```bash
# Generate Prisma Client (run after schema changes)
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create a migration (production-ready)
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset

# Check database status
npx prisma migrate status
```

---

## 🧪 Seed Sample Data (Optional)

Create a seed file to populate test data:

### Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample cultural events
  const culturalEvent1 = await prisma.eventItem.create({
    data: {
      event_name: "Dance Battle",
      event_description: "Show your moves in this epic dance competition!",
      event_price: 100,
      event_type: "Cultural",
      event_venue: "Main Auditorium",
      event_date: "2025-02-15",
      event_time: "4:00 PM",
      event_org: "Dance Club",
      image_url: "https://via.placeholder.com/400x300",
    },
  });

  const culturalEvent2 = await prisma.eventItem.create({
    data: {
      event_name: "Music Fest",
      event_description: "Live performances from top bands!",
      event_price: 150,
      event_type: "Cultural",
      event_venue: "Open Air Theatre",
      event_date: "2025-02-16",
      event_time: "6:00 PM",
      event_org: "Music Society",
      image_url: "https://via.placeholder.com/400x300",
    },
  });

  // Create sample technical events
  const technicalEvent1 = await prisma.eventItem.create({
    data: {
      event_name: "Hackathon",
      event_description: "24-hour coding challenge with amazing prizes!",
      event_price: 200,
      event_type: "Technical",
      event_venue: "Computer Lab",
      event_date: "2025-02-17",
      event_time: "9:00 AM",
      event_org: "Tech Club",
      image_url: "https://via.placeholder.com/400x300",
    },
  });

  const technicalEvent2 = await prisma.eventItem.create({
    data: {
      event_name: "Robotics Competition",
      event_description: "Build and battle with your robots!",
      event_price: 250,
      event_type: "Technical",
      event_venue: "Engineering Block",
      event_date: "2025-02-18",
      event_time: "10:00 AM",
      event_org: "Robotics Society",
      image_url: "https://via.placeholder.com/400x300",
    },
  });

  // Create sample merchandise
  const merch1 = await prisma.merchItem.create({
    data: {
      product_name: "Breeze T-Shirt",
      product_description: "Official Breeze 2025 T-shirt",
      product_price: 400,
      image_url: "https://via.placeholder.com/400x400",
    },
  });

  const merch2 = await prisma.merchItem.create({
    data: {
      product_name: "Breeze Hoodie",
      product_description: "Cozy hoodie with Breeze logo",
      product_price: 800,
      image_url: "https://via.placeholder.com/400x400",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${2} cultural events`);
  console.log(`Created ${2} technical events`);
  console.log(`Created ${2} merch items`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### Run Seed:

```bash
# Install ts-node if not already installed
npm install -D ts-node

# Run seed
npx prisma db seed
```

---

## 🐛 Troubleshooting

### Issue 1: "Can't reach database server"

**Solution:**

- Check your `DATABASE_URL` and `DIRECT_URL` are correct
- Verify password has no special characters that need encoding
- Check Supabase project is active
- Try using `DIRECT_URL` temporarily for `DATABASE_URL`

### Issue 2: "Environment variable not found"

**Solution:**

```bash
# Make sure .env file exists in project root
# Restart your development server after changing .env
```

### Issue 3: "Prisma Client not generated"

**Solution:**

```bash
npx prisma generate
```

### Issue 4: "Module not found: @prisma/client"

**Solution:**

```bash
npm install @prisma/client
npx prisma generate
```

### Issue 5: "Migration failed"

**Solution:**

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or manually delete tables in Supabase and re-push
npx prisma db push --force-reset
```

### Issue 6: "SSL connection error"

**Solution:**
Add `?sslmode=require` to your connection string:

```env
DATABASE_URL="postgresql://...?sslmode=require"
```

---

## 📋 Database Schema Overview

### Tables Created:

1. **EventItem** - Stores all events (Cultural/Technical)
2. **MerchItem** - Stores merchandise products
3. **PendingTransaction** - Temporary cart storage during checkout
4. **SubmittedTransaction** - Payment submissions awaiting approval
5. **ConfirmedEvent** - Approved event registrations (many-to-many)
6. **ConfirmedMerch** - Approved merchandise orders (many-to-many)
7. **Roles** - User role assignments for access control

### Enums:

1. **event_category** - `Cultural | Technical`
2. **accommodation_option** - `DAY1 | DAY2 | DAY3`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env` file exists with all required variables
- [ ] `npx prisma generate` runs successfully
- [ ] `npx prisma db push` completes without errors
- [ ] Supabase dashboard shows all 7 tables
- [ ] `transaction-proofs` bucket exists (private)
- [ ] `assets` bucket exists (public)
- [ ] Admin user created in Supabase Auth
- [ ] Admin user added to `Roles` table with `club_name = 'BREEZE'`
- [ ] Can log in to `/admin/login`
- [ ] Redirects to `/admin/breeze-admin` after login

---

## 🚀 Next Steps

After database setup:

1. ✅ Run the application: `npm run dev`
2. ✅ Seed sample data (optional): `npx prisma db seed`
3. ✅ Test event creation in admin panel
4. ✅ Test event browsing on frontend
5. ✅ Test cart and checkout flow

---

**Need Help?**

- Prisma Docs: https://www.prisma.io/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

**Last Updated**: December 23, 2025
