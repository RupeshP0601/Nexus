# Afors Nexus - Project Documentation

Afors Nexus (renamed to **Afors Smart Dart**) is a Revenue Orchestration Platform designed for B2B companies in the BFSI and Telecom sectors. It leverages AI to provide account intelligence, intent scoring, and automated outreach.

## 📂 Folder Structure

The project follows a standard Next.js directory structure with an emphasis on modularity and clear separation of concerns.

- **`prisma/`**: Contains the database schema (`schema.prisma`) and migrations. Uses SQLite as the primary database.
- **`public/`**: Static assets like images, icons, and fonts.
- **`src/`**: The main source code directory.
  - **`app/`**: Next.js App Router directory.
    - **`(auth)/`**: (Optional) Authentication-related routes.
    - **`accounts/`**: Account management and details pages.
    - **`api/`**: API routes for backend logic (Tier stats, Leads, Intelligence, etc.).
    - **`dashboard/`**: The main user dashboard.
    - **`intelligence/`**: AI-driven account intelligence and dossier views.
    - **`layout.tsx`**: Root layout for the application.
    - **`page.tsx`**: Entry point (often redirects to dashboard).
  - **`components/`**: Reusable UI components (Shared, Layout, Specific modules).
  - **`lib/`**: Shared utilities, constants, and library configurations (Prisma client, AI agents, scoring logic).
  - **`middleware.ts`**: Edge middleware for handling requests (e.g., auth, routing).
- **`scripts/`**: Automation and utility scripts (e.g., db seed).

## 🧩 Code Logic High-Level

The application logic is centered around **Accounts** and their transition through various sales stages.

### 1. Account Lifecycle
- Accounts are categorized by **Tier** (Strategic, Scale, Programmatic) based on revenue and fit.
- The **Status** of an account (Nurture, MQL, SQL, Opportunity) tracks its progress in the sales funnel.

### 2. Scoring System (`src/lib/scoring.ts`)
- **Fit Score**: Based on firmographic data (Industry, Country, Revenue).
- **Intent Score**: Derived from behavioral signals (Website visits, Keyword searches).
- **Total Score**: A combined metric used to prioritize accounts.

### 3. AI Agents (`src/lib/agents/`)
- **Dossier Agent**: Generates deep account research, pain points, and value propositions.
- **Outreach Agent**: Drafts personalized messages for email or LinkedIn based on the dossier.

## 🔌 API Logic High-Level

The backend logic is exposed via Next.js Route Handlers in `src/app/api/`.

- **`/api/accounts/`**:
  - `GET`: Fetch accounts with filtering and sorting based on scores/tier.
  - `GET /[id]`: Get detailed account data, including contacts and signals.
- **`/api/intelligence/`**:
  - `POST /generate-dossier`: Triggers AI generation for an account.
  - `POST /draft-message`: Generates a personalized outreach message.
- **`/api/leads/`**:
  - Manages lead status transitions and SLA tracking.
- **`/api/activities/`**:
  - Logs sales touchpoints (emails, calls) to the database.

## 🗄️ Data Model

The project uses **Prisma** with a SQLite database. Key models include:
- `Account`: Central entity for B2B companies.
- `Contact`: Individuals associated with accounts.
- `Signal`: Behavioral data points triggering scores.
- `Dossier`: AI-generated insights for an account.
- `Lead`: Specific sales opportunities with tracking.

---
*Last Updated: 2026-02-22*
