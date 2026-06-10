# Database Setup Guide - Afors Nexus

## Overview

The Afors Nexus platform uses **PostgreSQL** via **Supabase** as the database provider. This guide will help you set up your database and run migrations.

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `afors-nexus` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to Middle East (e.g., Singapore, Frankfurt)
   - **Pricing Plan**: Free tier is sufficient for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for project provisioning

---

## Step 2: Get Your Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **"URI"** tab
4. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
5. **Important**: Replace `[YOUR-PASSWORD]` with the actual password you created in Step 1

---

## Step 3: Configure Environment Variables

1. Open `.env.local` in your project root
2. Update the `DATABASE_URL` with your Supabase connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres?schema=public"
```

**Example**:
```env
DATABASE_URL="postgresql://postgres:MyStr0ngP@ssw0rd@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public"
```

---

## Step 4: Run Prisma Migrations

Once your database is configured, run the following commands:

```bash
# Generate Prisma Client
npx prisma generate

# Run the initial migration to create all tables
npx prisma migrate dev --name init
```

This will create the following tables in your database:
- ✅ `Account` - B2B companies in BFSI/Telecom
- ✅ `Contact` - Key decision makers
- ✅ `Signal` - Intent and behavioral signals
- ✅ `Activity` - Sales activities and touchpoints
- ✅ `Lead` - Sales qualified leads with SLA tracking
- ✅ `TriggerEvent` - Market events and news triggers

---

## Step 5: Verify Database Setup

### Option 1: Using Prisma Studio (Recommended)

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555` where you can:
- View all tables
- Add sample data
- Test queries

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project
2. Click **"Table Editor"** in the left sidebar
3. You should see all 6 tables created

---

## Database Schema Overview

### Account Model
Core entity representing B2B companies in Middle East BFSI & Telecom sectors.

**Key Fields**:
- `fitScore` (0-100): How well the account matches ICP
- `intentScore` (0-100): Buying intent signals
- `totalScore` (0-100): Combined score
- `tier`: 1=Strategic, 2=Scale, 3=Programmatic
- `status`: nurture → mql → sql → opportunity
- `isSurging`: Boolean flag for rapid score increase

### Contact Model
Decision makers and stakeholders at accounts.

**Key Fields**:
- `isPrimary`: Primary contact flag
- `fitPoints`: Contribution to account score
- Cascades on account deletion

### Signal Model
Intent and behavioral signals from various sources.

**Types**:
- `intent`: Buying intent signals
- `firmographic`: Company changes
- `contextual`: Market events
- `website_visit`: Web engagement

**Sources**:
- `6sense`: Intent data platform
- `news_api`: News monitoring
- `website`: Direct website tracking
- `manual`: Manually added

### Activity Model
Sales touchpoints and engagement history.

**Types**:
- `email`: Email communications
- `call`: Phone calls
- `meeting`: Meetings/demos
- `demo`: Product demonstrations
- `proposal`: Proposal submissions

### Lead Model
Sales qualified leads with SLA governance.

**Key Fields**:
- `type`: inbound vs outbound
- `status`: new → accepted → rejected → converted
- `slaDeadline`: When lead must be actioned
- `slaBreach`: SLA violation flag

### TriggerEvent Model
Market events that create sales opportunities.

**Categories**:
- `regulatory`: New regulations/compliance
- `tender`: Government/corporate tenders
- `funding`: Funding rounds/M&A
- `executive_change`: Leadership changes

---

## Seed Data (Optional)

To populate your database with sample data for testing, create a seed script:

```bash
# Create seed file
New-Item -ItemType File -Path "prisma\seed.ts"
```

Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Run seed:
```bash
npx prisma db seed
```

---

## Common Issues & Solutions

### Issue 1: "Can't reach database server"
**Solution**: Check your DATABASE_URL is correct and your IP is allowed in Supabase

### Issue 2: "SSL connection error"
**Solution**: Add `?sslmode=require` to your connection string

### Issue 3: "Password authentication failed"
**Solution**: Ensure you replaced `[YOUR-PASSWORD]` with actual password

### Issue 4: Migration fails with "relation already exists"
**Solution**: Reset database:
```bash
npx prisma migrate reset
```

---

## Next Steps After Database Setup

1. ✅ Generate Prisma Client: `npx prisma generate`
2. ✅ Create API routes for CRUD operations
3. ✅ Build data ingestion pipeline for CRM sync
4. ✅ Implement scoring algorithm
5. ✅ Set up real-time subscriptions for signals

---

## Useful Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

---

## Production Deployment

When deploying to production:

1. Set `DATABASE_URL` in your hosting platform (Vercel, etc.)
2. Run migrations: `npx prisma migrate deploy`
3. Ensure connection pooling is enabled
4. Consider using Supabase connection pooler for serverless

---

## Support

- **Prisma Docs**: [prisma.io/docs](https://www.prisma.io/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Schema Reference**: See `prisma/schema.prisma` for full model definitions
