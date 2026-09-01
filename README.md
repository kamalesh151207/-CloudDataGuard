# CloudDataGuard

**Repository Name**: `CodeAlpha_DataRedundancyRemoval`  
**Application Tagline**: *“Validate. Deduplicate. Trust Your Data.”*  
**Internship Task**: CodeAlpha Cloud Computing Internship — Task 1: Data Redundancy Removal System

---

## Overview

**CloudDataGuard** is an enterprise-grade, cloud-native data quality and redundancy removal platform built to validate, normalize, and deduplicate record streams before they enter cloud database storage. By combining multi-level application validation with database-level compound unique indexes in MongoDB Atlas, CloudDataGuard guarantees **0-redundancy storage**, preventing invalid or duplicate records from polluting enterprise cloud databases.

---

## CodeAlpha Task 1 Requirement Mapping

The following matrix documents how every requirement specified for **CodeAlpha Task 1** is implemented:

| CodeAlpha Requirement | Implemented CloudDataGuard Feature |
| :--- | :--- |
| **1. Identify and classify data as redundant or false positive** | Multi-level classification engine categorizing records into **UNIQUE & VERIFIED** (🟢), **REDUNDANT / DUPLICATE** (🔴), or **INVALID / FALSE POSITIVE** (🟡). |
| **2. Validate new data against existing data** | 3-level duplicate detection evaluating exact normalized matches, uppercase/whitespace variants, and critical field collisions (email & phone). |
| **3. Prevent duplicate data from being added to cloud DB** | Dual-layer protection: Pre-insertion application level validation + MongoDB Atlas sparse unique indexes (`normalizedEmail` & `normalizedPhone`) handling atomic `E11000` duplicate key collisions. |
| **4. Append only unique and verified data entries** | Enforced 2-step validation pipeline. The `/api/records` endpoint rejects unverified payloads and only permits verified `status: "unique"` entries to be saved. |
| **5. Maintain database accuracy & efficiency** | Real-time Data Quality Score gauge (`(Unique Records / Total Evaluated Data Points) * 100`) and dynamic backend analytics ensuring optimal DB storage. |

---

## Key Features

1. **SaaS Observability Interface**: Deep dark navy theme (`bg-slate-950`), custom SVG Data Quality progress gauge, glassmorphic cards, and responsive sidebar navigation.
2. **5-Step Validation Pipeline**:
   - **Step 1: Input Validation**: RFC 5322 email regex verification & 10–15 digit phone validation.
   - **Step 2: Data Normalization**: Trimming whitespace, converting email to lowercase, formatting phone numbers into digit strings.
   - **Step 3: Database Collision Check**: Querying existing records for exact and field-level matches.
   - **Step 4: Record Classification**: Assigning status badges and detailed rejection rationale.
   - **Step 5: Visual Verification**: Presenting clean normalized previews and execution options.
3. **Cloud Record Store**: Paginated, searchable, and filterable data table with a slide-out details drawer and audit history.
4. **Audit Activity Logs**: Real-time event log tracking record validations, insertions, duplicate blocks, and system health status.
5. **System Health Diagnostics**: Live operational metrics for MongoDB connection state, Express server uptime, process heap memory, and ping latency.
6. **Automated Unit & Integration Test Suite**: 8 automated integration tests verifying unique acceptance, case/whitespace deduplication, and atomic concurrent insertion safeguards.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion, Axios, Recharts
- **Backend**: Node.js, Express.js, REST API, Mongoose, Helmet, CORS, Express-Rate-Limit
- **Database**: MongoDB Atlas (with automatic fallback to `mongodb-memory-server` for local/offline execution)
- **Testing**: Jest, Supertest, MongoMemoryServer

---

## Duplicate Detection Engine Logic

Incoming data payloads undergo sequential analysis:

```
[ Incoming Raw Payload ]
          │
          ▼
┌───────────────────────────┐
│ 1. Schema Validation      │ ── Failed ──► [ 🟡 INVALID / FALSE POSITIVE ]
└───────────────────────────┘
          │ Passed
          ▼
┌───────────────────────────┐
│ 2. Data Normalization     │ (Trim spaces, lowercase email, digit phone)
└───────────────────────────┘
          │
          ▼
┌───────────────────────────┐
│ 3. Level 1: Exact Match   │ ── Collided ─► [ 🔴 REDUNDANT (Exact match) ]
└───────────────────────────┘
          │ Clear
          ▼
┌───────────────────────────┐
│ 4. Level 2: Email Match   │ ── Collided ─► [ 🔴 REDUNDANT (Email collision) ]
└───────────────────────────┘
          │ Clear
          ▼
┌───────────────────────────┐
│ 5. Level 3: Phone Match   │ ── Collided ─► [ 🔴 REDUNDANT (Phone collision) ]
└───────────────────────────┘
          │ Clear
          ▼
[ 🟢 UNIQUE & VERIFIED ] ──► [ Safe Storage in MongoDB Atlas ]
```

---

## API Endpoints

### Records API (`/api/records`)

- `POST /api/records/validate` — Validate and classify a payload without saving to DB.
- `POST /api/records` — Save a verified unique record into MongoDB Atlas.
- `GET /api/records` — Fetch paginated, searchable, filterable record list.
- `GET /api/records/stats` — Calculate dynamic dashboard metrics, data quality score, and chart series.
- `GET /api/records/:id` — Fetch single record detail with audit history.

### Activity Logs API (`/api/activity`)

- `GET /api/activity` — Retrieve system activity audit logs.

### Health Diagnostics API (`/api/health`)

- `GET /api/health` — Retrieve MongoDB Atlas connection status, latency, uptime, and memory usage.

---

## Getting Started & Running Locally

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (optional; memory database fallback activates automatically if `MONGODB_URI` is omitted)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/CodeAlpha_DataRedundancyRemoval.git
   cd CodeAlpha_DataRedundancyRemoval
   ```

2. **Install all dependencies** (Root, Backend, and Frontend):
   ```bash
   npm run setup
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in `server/`:
   ```bash
   cp server/.env.example server/.env
   ```

4. **Seed Sample Data (Optional)**:
   ```bash
   npm run seed
   ```

5. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5001`

---

## Running Automated Tests

Run the full integration test suite:

```bash
npm test
```

### Test Coverage Summary (8 Test Cases)

- **Test 1**: New unique record -> ACCEPT (201 Created)
- **Test 2**: Exact duplicate record -> REJECT (400 Bad Request)
- **Test 3**: Uppercase email variant (`RAHUL@GMAIL.COM`) -> REJECT
- **Test 4**: Extra whitespace variant (`" Rahul Kumar "`) -> REJECT
- **Test 5**: Existing phone number collision -> REJECT with collision reason
- **Test 6**: Invalid email format (`kamalesh@`) -> INVALID
- **Test 7**: Invalid phone format (`12345`) -> INVALID
- **Test 8**: Simultaneous concurrent insertion attempts -> Atomic MongoDB index blocks second insert, guaranteeing 1 stored record.

---

## Deployment Instructions

### Frontend (Vercel)
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend (Render / Railway)
- Root Directory: `server`
- Start Command: `npm start`
- Environment Variables: Set `MONGODB_URI`, `NODE_ENV=production`, `CLIENT_URL`

---

## License

Created for **CodeAlpha Internship Evaluation** — Task 1: Data Redundancy Removal System.
