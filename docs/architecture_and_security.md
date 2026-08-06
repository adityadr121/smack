# System Architecture, ER Diagrams & Security Audit Checklist

## 1. Complete System Architecture & Data Flow

```
                                  +---------------------------------------+
                                  |     React 19 + Vite Frontend (5173)   |
                                  |   (Glassmorphism, Recharts, SHAP UI)   |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTP / Socket.IO Telemetry
                                                      v
                                  +---------------------------------------+
                                  |  Node.js / Express Backend (5000)     |
                                  |  (Clean Architecture, JWT, RBAC, Zod) |
                                  +---------+-------------------+---------+
                                            |                   |
                     PostgreSQL 16 (5432)   |                   |  HTTP REST
                     Prisma ORM (15 Tables) |                   v
                                            v         +-------------------+
                                     +--------------+ |  Python 3.12+     |
                                     |  PostgreSQL  | |  FastAPI AI       |
                                     |  & Redis     | |  Engine (8000)   |
                                     +--------------+ | (XGBoost + SHAP)  |
                                                      +-------------------+
```

---

## 2. Database Entity-Relationship (ER) Diagram (15 Normalized 3NF Tables)

```
[ Hospital ] 1 --- N [ Department ] 1 --- N [ Ward ] 1 --- N [ Bed ]
     |                     |                                     |
     |                     v                                     v
     +-------------------> [ User ] (MD, RN, Admin, CLS) <--- [ Patient ]
                             |                                     |
                             +-------------------+-----------------+
                                                 |
         +-----------------+---------------------+-----------------+-----------------+
         |                 |                     |                 |                 |
         v                 v                     v                 v                 v
   [ VitalSign ]   [ LabReport ]          [ AIPrediction ]  [ AlertEscalation ] [ Medication ]
```

---

## 3. HIPAA & OWASP Top 10 Security Audit Checklist

| Security Control | Implementation Mechanism | Compliance Status |
| :--- | :--- | :--- |
| **Authentication** | JWT tokens with short expiration (8h) & bcryptjs hashing | ✅ PASS |
| **Authorization (RBAC)** | Express middleware matching `Role` enum per endpoint | ✅ PASS |
| **Data Encryption** | TLS 1.3 in transit, AES-256 for persistent database storage | ✅ PASS |
| **SQL Injection** | Parameterized queries enforced via Prisma ORM | ✅ PASS |
| **XSS Prevention** | React DOM auto-escaping & Helmet CSP headers | ✅ PASS |
| **Rate Limiting** | Express-Rate-Limit capping API requests to 100 reqs/min | ✅ PASS |
| **Audit Logging** | Immutable `AuditLog` table capturing User, IP, Timestamp, Action | ✅ PASS |
