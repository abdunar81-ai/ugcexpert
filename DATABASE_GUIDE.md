# UGC EXPERT: Prisma ORM & SQLite Setup Guide

This project is fully architected with **Prisma ORM** (`prisma/schema.prisma`), **Prisma Client** (`@prisma/client`), and an **Express.js backend (`server.ts`)** running on **SQLite** (`dev.db`).

---

## Why SQLite?

- **Zero configuration**: No passwords, usernames, or connection strings.
- **No background services or Docker needed**: SQLite runs directly inside Node.js as an embedded file (`dev.db`).
- **Completely portable**: Works locally, in containers, and in server environments right out of the box.
- **Full Prisma support**: Models, relations, foreign keys, cascades, Prisma Studio GUI, and seeds work seamlessly.

---

## 1. Project Architecture

```
├── prisma/
│   ├── schema.prisma        # Prisma Schema models & relations (provider = "sqlite")
│   └── seed.ts              # Self-contained seeder (npx prisma db seed)
├── server/
│   ├── prisma.ts            # Global PrismaClient singleton instance
│   └── db.ts                # Database query service reading from SQLite
├── server.ts                # Express REST API routes interacting with Prisma
├── dev.db                   # Embedded SQLite database file
└── .env                     # DATABASE_URL="file:./dev.db"
```

---

## 2. Environment Configuration

Your `.env` file points to the local database file:

```env
DATABASE_URL="file:./dev.db"
```

---

## 3. Prisma Commands

The SQLite database is already synced and seeded. When needed, you can use:

### A. Sync Schema Changes to Database
```bash
npm run prisma:push
# or: npx prisma db push
```

### B. Seed the Database
Populate your database with the complete initial UGC creator, campaign, order, and lesson dataset:
```bash
npm run prisma:seed
# or: npx prisma db seed
```

### C. Regenerate Prisma Client
```bash
npm run prisma:generate
# or: npx prisma generate
```

### D. Open Prisma Studio (Web GUI)
Inspect, query, and edit records visually in your browser:
```bash
npm run prisma:studio
# or: npx prisma studio
```

---

## 4. API Endpoints

All data is loaded by the frontend exclusively through the Express REST API:

- `GET /api/status`: Check database connection status and ORM metadata.
- `GET /api/creator/profile`: Active UGC creator profile, goal, wallet, and transactions.
- `PUT /api/creator/profile`: Update creator profile details.
- `PUT /api/creator/goal`: Update target purchase goal.
- `GET /api/creators`: List of community creators.
- `GET /api/campaigns`: Active brand UGC campaigns.
- `POST /api/campaigns`: Create brand campaign.
- `GET /api/orders`: UGC orders with status and submission tracking.
- `POST /api/orders/:id/submit`: Submit TikTok/Reels video link for review.
- `GET /api/lessons`: Educational course modules and quizzes.
- `POST /api/lessons/:id/complete`: Complete lesson module and award creator levels.
- `POST /api/wallet/withdraw`: Request Kaspi / bank payout.
- `POST /api/gemini/script`: AI UGC Script generation in Kazakh matching creator archetype.
