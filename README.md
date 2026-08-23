# SkillBond - Income Share Agreement (ISA) Platform

SkillBond is a modern, production-grade full-stack web application that empowers students to finance their higher education through transparent Income Share Agreements (ISAs) backed by angel & institutional investors.

---

## Architecture Overview

- **Frontend**: React 18, Vite, Material-UI (v5), React Router v6, TanStack Query v5, Axios, React Hook Form, Framer Motion.
- **Backend**: Java 21, Spring Boot 3.2.3, Spring Security (JWT), Spring Data MongoDB, Lombok, Bean Validation.
- **Database**: MongoDB.
- **DevOps**: Docker, Docker Compose, Nginx.

---

## Role-Based Access Control (RBAC)

1. **Student**
   - Profile management (college, degree, GPA, expected salary, skills, projects portfolio).
   - Create ISA funding requests (amount, percentage share, duration, purpose).
   - Track funding approval status, active investor contracts, and post-grad repayment schedule.

2. **Investor**
   - Browse student ISA proposals with real-time filters (college, degree, requested capital).
   - Evaluate student profiles & disburse investments in 1-click.
   - Monitor portfolio performance and annualized ROI analytics.

3. **Admin**
   - Manage platform users (approve accounts, toggle active/blocked status).
   - Review and approve student ISA proposals before publication.
   - Platform analytics, transaction monitoring, and security audit logs.

---

## Default Seed Credentials

- **Admin**: `admin@skillbond.com` / `admin123Password!`
- **Student**: `student@skillbond.com` / `student123Password!`
- **Investor**: `investor@skillbond.com` / `investor123Password!`

---

## Quick Start (Docker)

```bash
docker-compose up --build
```
- Access Frontend: [http://localhost](http://localhost) (or [http://localhost:5173](http://localhost:5173) in Vite dev mode)
- Access Backend API: [http://localhost:8080/api](http://localhost:8080/api)
