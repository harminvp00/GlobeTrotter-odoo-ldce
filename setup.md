# Step-by-Step Setup Guide

This guide describes how to set up the local development environment for GlobeTrotter.

---

## A. Prerequisites
Make sure the following are installed on your machine:
- **Node.js**: Version 18.0.0 or higher (verify via `node -v`)
- **npm**: Version 9.0.0 or higher (verify via `npm -v`)
- **PostgreSQL**: Version 14 or higher (verify via `psql --version`)
- **Git**

---

## B. Clone Repository
```bash
git clone <repository_url> globetrotter
cd globetrotter
```

---

## C. PostgreSQL Database Creation
Open a terminal and connect to your local PostgreSQL server, or run the following command to create the database:
```bash
createdb globetrotter
```
If your local PostgreSQL requires a user connection (e.g. `postgres` or `harmin`):
```bash
createdb -U harmin globetrotter
```

---

## D. Server Installation
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```

---

## E. Server Environment Configuration (`server/.env`)
1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and configure your variables:
   ```env
   # PostgreSQL connection string
   # Peer authentication Unix Socket connection string format (default for local linux):
   DATABASE_URL="postgresql://harmin@/globetrotter?host=/var/run/postgresql"
   
   # Or TCP/IP connection string (requires password setup):
   # DATABASE_URL="postgresql://harmin:yourpassword@localhost:5432/globetrotter"
   
   PORT=5000
   CLIENT_URL="http://localhost:5173"
   ```

---

## F. Prisma 6 Setup, Generation, and Migration
> [!IMPORTANT]
> All Prisma commands MUST be executed inside the `server/` directory. There is no root-level `prisma` folder.

1. Generate the Prisma Client using the configured schema:
   ```bash
   npx prisma generate
   ```
2. Create and apply the initial migration to your local PostgreSQL instance:
   ```bash
   npx prisma migrate dev --name init
   ```
3. (Optional) Run Prisma Studio to visually inspect your database tables:
   ```bash
   npx prisma studio
   ```

---

## G. Client Installation
1. Open a new terminal window/tab and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```

---

## H. Running the Applications

### Starting the Backend (Server)
Inside the `server/` directory:
```bash
npm run dev
```
The server will start on port `5000` (e.g., http://localhost:5000).

### Starting the Frontend (Client)
Inside the `client/` directory:
```bash
npm run dev
```
The Vite development server will start on port `5173` (e.g., http://localhost:5173).

---

## I. Verifying the Setup
1. Verify the database tables were created:
   ```bash
   psql -d globetrotter -c "\dt"
   ```
   You should see tables like `users`, `trips`, `cities`, `trip_stops`, etc.
2. Open http://localhost:5173 in your browser and check if the React application is running.

---

## J. Common Setup Problems
- **Problem: Peer Authentication Failed**
  - *Cause*: PostgreSQL is configured to use Peer authentication for TCP/IP or your configuration mismatch.
  - *Solution*: Verify you are using the Unix Socket connection string `postgresql://username@/dbname?host=/var/run/postgresql` on Linux, or check your `pg_hba.conf` configuration.
- **Problem: Port 5000 or 5173 Already in Use**
  - *Solution*: Edit the port configurations in your environment settings or terminate the processes currently occupying those ports.
