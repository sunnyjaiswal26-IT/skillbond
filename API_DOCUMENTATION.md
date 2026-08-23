# SkillBond REST API Reference

Base Endpoint: `/api`

---

## 1. Authentication Endpoints (`/auth`)

- `POST /auth/signup`
  - Body: `{ fullName, email, password, role: "STUDENT" | "INVESTOR", phoneNumber }`
- `POST /auth/login`
  - Body: `{ email, password }`
  - Returns: `{ token, refreshToken, id, email, fullName, roles }`
- `POST /auth/refresh`
  - Body: `{ refreshToken }`
- `POST /auth/forgot-password`
  - Body: `{ email }`
- `POST /auth/reset-password`
  - Body: `{ token, newPassword }`

---

## 2. Student Endpoints (`/student`) — Role: STUDENT

- `GET /student/profile` — Fetch student academic profile.
- `PUT /student/profile` — Update college, major, GPA, expected salary, bio, skills.
- `POST /student/funding-request` — Submit new ISA proposal.
- `GET /student/funding-requests` — List my funding requests.
- `GET /student/investments` — List accepted active ISA contracts.
- `GET /student/repayments` — View repayment schedule and history.

---

## 3. Investor Endpoints (`/investor`) — Role: INVESTOR

- `GET /investor/profile` — Fetch investor profile.
- `PUT /investor/profile` — Update budget and parameters.
- `GET /investor/students` — Browse all student profiles.
- `GET /investor/funding-requests` — View open approved ISA proposals.
- `POST /investor/fund/{requestId}` — Disburse funds and execute contract.
- `GET /investor/portfolio` — Fetch active ISA investments portfolio.
- `GET /investor/analytics` — Fetch ROI statistics.

---

## 4. Admin Endpoints (`/admin`) — Role: ADMIN

- `GET /admin/users` — List all registered users.
- `PUT /admin/users/{userId}/toggle-status?enabled=boolean` — Block/unblock user.
- `PUT /admin/users/{userId}/approve?approved=boolean` — Approve/reject user account.
- `GET /admin/funding-requests` — List all funding proposals.
- `PUT /admin/funding-requests/{requestId}/status?status=APPROVED|REJECTED` — Review proposal.
- `GET /admin/analytics` — Platform metrics overview.
- `GET /admin/audit-logs` — Security audit trail.
