<p align="center">
  <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Elysia.js-%23000000.svg?style=for-the-badge&logo=elysia&logoColor=white" alt="Elysia.js" />
  <img src="https://img.shields.io/badge/SQLite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Railway-%23000000.svg?style=for-the-badge&logo=railway&logoColor=white" alt="Railway" />
</p>

<h1 align="center">🏛️ CivicInsight AI — Backend</h1>

<p align="center">
  <strong>RESTful API powering CivicInsight AI — an AI-driven digital platform for RT/RW community management.</strong>
</p>

<p align="center">
  <a href="https://civicinsight-ai-backend.up.railway.app/docs"><img src="https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger Docs" /></a>
  <a href="https://github.com/PadukaArif/CivicInsight-AI-Backend"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github" alt="GitHub" /></a>
  <a href="https://civicinsight-ai-backend.up.railway.app/health"><img src="https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square" alt="Production Status" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /></a>
</p>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Docker](#docker)
- [Database](#database)
- [Security](#security)
- [Deployment](#deployment)
- [Related Repositories](#related-repositories)
- [Author](#author)
- [License](#license)

---

## Overview

**CivicInsight AI Backend** is the server-side application that powers the CivicInsight AI platform — a comprehensive digital solution designed to modernize and streamline RT/RW (neighborhood) governance in Indonesia. It provides a suite of RESTful APIs covering authentication, resident data management, financial transparency, complaint reporting, AI-powered consultation, and fact-checking services.

> **🏆 Built for LKS Nasional Competition**

---

## Key Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure user registration & login with Argon2id password hashing |
| 🤖 **AI Consultation** | Intelligent Q&A powered by Google Gemini & Groq LLaMA |
| 📊 **Financial Transparency** | Full ledger management for community financial records |
| 📢 **Complaint System** | End-to-end complaint submission, tracking, and resolution |
| 🏘️ **Household Management** | Comprehensive household & family member data management |
| 📰 **News Aggregation** | Real-time CNN Indonesia news feed integration |
| ✅ **Fact Checking** | AI-driven misinformation detection and verification |
| 🗳️ **Community Polling** | Interactive polls for community decision-making |
| 🧠 **Civic Quiz** | Gamified civic knowledge assessment |
| 📄 **Interactive API Docs** | Auto-generated Swagger/OpenAPI documentation |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | [Bun](https://bun.sh) v1.0+ |
| **Framework** | [Elysia.js](https://elysiajs.com) |
| **Language** | TypeScript |
| **Database** | SQLite (via `bun:sqlite`) |
| **AI — Primary** | Google Gemini AI |
| **AI — Secondary** | Groq Cloud (LLaMA) |
| **Containerization** | Docker & Docker Compose |
| **Deployment** | Railway (auto-deploy) |

---

## Architecture

The project follows a modular **MVC-Service** architecture for clean separation of concerns:

```
src/
├── config/                  # Configuration & environment
│   ├── apiKeys.ts           # API key management
│   └── database.ts          # Database connection config
│
├── database/
│   └── init.ts              # Schema initialization & seed data
│
├── Module/
│   ├── Controller/          # Business logic layer
│   │   ├── AduanController.ts
│   │   ├── AIController.ts
│   │   ├── AnnouncementController.ts
│   │   ├── AuthController.ts
│   │   ├── ContactController.ts
│   │   ├── HealthController.ts
│   │   ├── HouseholdController.ts
│   │   ├── KasController.ts
│   │   ├── NewsController.ts
│   │   ├── PollController.ts
│   │   ├── QuizController.ts
│   │   └── RumorController.ts
│   │
│   ├── Routes/              # API route definitions
│   │   ├── AduanRoutes.ts
│   │   ├── AIRoutes.ts
│   │   ├── AnnouncementRoutes.ts
│   │   ├── AuthRoutes.ts
│   │   ├── ContactRoutes.ts
│   │   ├── HealthRoutes.ts
│   │   ├── HouseholdRoutes.ts
│   │   ├── KasRoutes.ts
│   │   ├── NewsRoutes.ts
│   │   ├── PollRoutes.ts
│   │   ├── QuizRoutes.ts
│   │   └── RumorRoutes.ts
│   │
│   └── Service/             # External service integrations
│       ├── AIService.ts     # Gemini & Groq integration
│       └── AuthService.ts   # Password hashing & verification
│
├── index.ts                 # Application entry point
└── ...
```

---

## API Reference

Base URL: `https://civicinsight-ai-backend.up.railway.app`

Interactive documentation is available at [`/docs`](https://civicinsight-ai-backend.up.railway.app/docs) (Swagger UI).

### Endpoints

| Module | Prefix | Methods | Description |
|---|---|---|---|
| **Auth** | `/auth` | `POST` | User registration & login with Argon2id hashing |
| **AI** | `/ai` | `POST` | AI consultation, evaluation, and fact-checking |
| **Aduan** | `/aduan` | `GET` `POST` `PUT` `DELETE` | Complaint management (full CRUD) |
| **Kas** | `/kas` | `GET` `POST` `PUT` `DELETE` | Financial ledger management |
| **Households** | `/households` | `GET` `POST` `PUT` `DELETE` | Household & family member data |
| **Announcements** | `/announcements` | `GET` `POST` `PUT` `DELETE` | Community announcements |
| **Contacts** | `/contacts` | `GET` `POST` `PUT` `DELETE` | Emergency contact directory |
| **News** | `/news` | `GET` | CNN Indonesia news aggregator |
| **Rumors** | `/rumors` | `GET` `POST` `PUT` `DELETE` | Misinformation tracking & resolution |
| **Quiz** | `/quiz` | `GET` `POST` | Civic knowledge quiz |
| **Poll** | `/poll` | `GET` `POST` `PUT` `DELETE` | Community polling system |
| **Health** | `/health` | `GET` | Server health check |
| **Swagger** | `/docs` | `GET` | Interactive API documentation |

### Example Request

```bash
# Health Check
curl https://civicinsight-ai-backend.up.railway.app/health

# User Registration
curl -X POST https://civicinsight-ai-backend.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "warga01", "password": "securePass123"}'

# AI Consultation
curl -X POST https://civicinsight-ai-backend.up.railway.app/ai/consult \
  -H "Content-Type: application/json" \
  -d '{"question": "Bagaimana cara membuat laporan keuangan RT?"}'
```

---

## Getting Started

### Prerequisites

- **[Bun](https://bun.sh)** v1.0 or later
- **[Docker](https://www.docker.com/)** (optional, for containerized deployment)
- API keys for [Google Gemini](https://ai.google.dev/) and [Groq](https://console.groq.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/PadukaArif/CivicInsight-AI-Backend.git
cd CivicInsight-AI-Backend

# Install dependencies
bun install
```

### Environment Variables

Copy the example environment file and configure your keys:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini AI API key | — |
| `GROQ_API_KEY` | Groq Cloud API key | — |
| `DATABASE_PATH` | Path to SQLite database file | `civic.db` |
| `PORT` | Server listening port | `4000` |

### Running Locally

```bash
# Development (with hot-reload)
bun run dev

# Production
bun run start
```

The server will start on `http://localhost:4000` by default.

### Docker

```bash
# Build and run with Docker Compose
docker compose up

# Or build manually
docker build -t civicinsight-backend .
docker run -p 4000:4000 --env-file .env civicinsight-backend
```

---

## Database

CivicInsight AI uses **SQLite** as its database engine for simplicity, portability, and zero-configuration deployment.

- **Auto-initialization**: The database schema is automatically created on first run via `src/database/init.ts`.
- **Seed Data**: Rich demo data is pre-populated for immediate testing and demonstration purposes.
- **File-based**: Data is stored in a single file (`civic.db` by default), making backups trivial.

---

## Security

The backend implements industry-standard security practices aligned with the [OWASP Top 10](https://owasp.org/www-project-top-ten/):

| Control | Implementation | OWASP Reference |
|---|---|---|
| **Password Hashing** | Argon2id (primary) / bcrypt (fallback) | A02 — Cryptographic Failures |
| **SQL Injection Prevention** | Prepared statements & parameterized queries | A03 — Injection |
| **Rate Limiting** | 100 requests/minute per client | A04 — Insecure Design |
| **CORS** | Configurable cross-origin resource sharing | A05 — Security Misconfiguration |
| **Input Validation** | Elysia.js schema validation on all endpoints | A03 — Injection |

---

## Deployment

The application is deployed on **[Railway](https://railway.app)** with continuous deployment from the `main` branch.

| Environment | URL |
|---|---|
| **Production** | [civicinsight-ai-backend.up.railway.app](https://civicinsight-ai-backend.up.railway.app) |
| **API Docs** | [civicinsight-ai-backend.up.railway.app/docs](https://civicinsight-ai-backend.up.railway.app/docs) |
| **Health Check** | [civicinsight-ai-backend.up.railway.app/health](https://civicinsight-ai-backend.up.railway.app/health) |

Deployment is triggered automatically on every push to `main`.

---

## Related Repositories

| Repository | Description |
|---|---|
| 🖥️ [CivicInsight AI Frontend](https://github.com/PadukaArif/CivicInsight-AI) | Next.js frontend application |
| ⚙️ [CivicInsight AI Backend](https://github.com/PadukaArif/CivicInsight-AI-Backend) | This repository |

---

## Author

**Arif**
- 📧 Email: [arifraffyfadlurahman@gmail.com](mailto:arifraffyfadlurahman@gmail.com)
- 🐙 GitHub: [@PadukaArif](https://github.com/PadukaArif)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Arif

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Made with ❤️ for LKS Nasional 2026
</p>
