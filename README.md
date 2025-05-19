# 🔐 DrivenPass

![Build](https://img.shields.io/github/actions/workflow/status/victortsrodrigues/drivenpass/ci-cd.yml?branch=main)  
![Docker Pulls](https://img.shields.io/docker/pulls/victortsrodrigues/drivenpass)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**DrivenPass is a secure, production-grade password manager API built with Node.js, Express, TypeScript, and PostgreSQL. It enables users to safely store, retrieve, update, and delete credentials for various services, with robust authentication, encryption, and error handling.**

🔗 **Production URL**: [https://drivenpass-a2ns.onrender.com](https://drivenpass-a2ns.onrender.com)

---

## 🚀 Features

✅ **User Authentication**
  - Sign up with name, email, and password (bcrypt-hashed).
  - Sign in with JWT-based authentication.
  - Secure token validation middleware for protected routes.

✅ **Credential Management**
  - Create, read, update, and delete credentials (title, url, username, password).
  - Passwords are encrypted at rest using Cryptr.
  - Unique credential titles per user.
  - All credential operations require authentication.

✅ **Account Deletion**
  - Users can delete their account and all associated credentials in a single operation.

✅ **Validation & Error Handling**
  - Centralized schema validation with Joi.
  - Unified error handler for all routes.
  - Meaningful HTTP status codes for all error scenarios (422, 409, 404, 401, 400, etc.).

✅ **Health Check**
  - `/health` endpoint for uptime monitoring.

✅ **Demo User**
  - Database seeded with a demo user for easy testing.

---

## 🛡️ Security Highlights

- Passwords are never stored in plain text (bcrypt).
- Credential passwords are encrypted with an application secret (Cryptr).
- JWT tokens are required for all sensitive operations.
- Input validation prevents common attack vectors.

---

## 🚀 Technologies

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (managed via Prisma ORM)
- **Authentication:** JWT, bcrypt
- **Encryption:** Cryptr
- **Validation:** Joi
- **Testing:** Jest, Supertest
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions

---

## ⚙️ Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL (local or Docker)
- [Optional] Docker & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/your-username/drivenpass.git
cd drivenpass
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your secrets, or use the provided `.env` for local development.

### 4. Set up the database

Make sure PostgreSQL is running and accessible according to your `.env` configuration.

Run migrations and seed the demo user:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## 🐳 Docker

### Run with Docker Compose

```bash
docker compose up --build
```

This will start both the backend and a PostgreSQL database (see `docker-compose.yml`).  
The API will be available at `http://localhost:5000`.

### Environment Variables

You can override environment variables using a `.env` file or by editing the `docker-compose.yml` file.

---

## 🧪 Automated Testing

- **Unit & Integration:**  
  ```bash
  npm run test
  ```
- **Coverage:**  
  ```bash
  npm run test:coverage
  ```

---

## 🔁 CI/CD

The GitHub Actions pipeline (`.github/workflows/ci-cd.yml`) automates:
1. Unit & Integration Tests
2. Docker Build & Push to Docker Hub
3. Deploy via Render Deploy Hook

Make sure to set these GitHub Secrets:
- DOCKERHUB_USERNAME, DOCKERHUB_TOKEN
- RENDER_DEPLOY_HOOK_URL

---

## 📝 API Endpoints

### Auth

- `POST /sign-up` — Register a new user
- `POST /sign-in` — Authenticate and receive JWT

### Credentials (Protected)

- `POST /credentials` — Create credential
- `GET /credentials` — List all credentials
- `GET /credentials/:id` — Get credential by ID
- `PUT /credentials/:id` — Update credential
- `DELETE /credentials/:id` — Delete credential

### Account

- `DELETE /erase` — Delete user account and all credentials

### Health

- `GET /health` — Returns `"I'm OK"` if the server is running

---

## 🧑‍💻 Demo User

A demo user is seeded automatically:

```json
{
  "name": "Demo",
  "email": "demo@driven.com.br",
  "password": "demo123"
}
```

---

## 📬 Contributing
Pull requests are welcome!  
For major changes, please open an issue first to discuss what you'd like to change.

To contribute:
1. Fork the repository  
2. Create a feature branch  
3. Commit your changes with clear messages  
4. Ensure tests are included if applicable  
5. Open a pull request 

---

## 🛡️ License
MIT © [Victor Rodrigues](https://github.com/victortsrodrigues)

---

> Project developed for Driven – Module 21.
> Demonstrates proficiency in Node.js, Express, TypeScript, PostgreSQL, Docker, CI/CD, error handling, API architecture, security best practices and more.