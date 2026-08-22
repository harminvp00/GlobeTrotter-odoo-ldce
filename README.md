
# GlobeTrotter
GlobeTrotter is a personalized travel planning web application designed to help users create, manage, and share multi-city travel itineraries.

## 1. Project Overview
GlobeTrotter allows users to search for destinations, build stops, schedule activities, plan budgets, and visualize their travel plans dynamically via a calendar/timeline view. The application includes user authentication and public read-only trip sharing.

## 2. Features
- User registration and login (password hashed, secure JWT/Session validation).
- Travel Dashboard to view own trips.
- Trip creation & management (CRUD) with visibility control (Private vs Public).
- Multi-city itinerary planning (adding/reordering stops with custom dates).
- Activity search and addition to specific stops.
- Expense tracking and budget visualization (Transport, Stay, Activity, Meal, Other).
- Dynamic timeline/calendar itinerary visualization.
- Public read-only trip sharing via clean unique slug.
- Profile management and Saved Destinations (wishlist).

## 3. Technology Stack
- **Frontend**: React (TypeScript), Tailwind CSS, Context API (no external state managers like Redux or Zustand), React Router.
- **Backend**: Node.js, Express.js (TypeScript), Zod validation.
- **Database / ORM**: PostgreSQL, Prisma ORM (Version 6 specifically).
- **HTTP Client**: Axios or native Fetch.

## 4. Architecture
GlobeTrotter follows a clean, decoupled client-server split architecture. The database relations are strictly maintained in PostgreSQL using Prisma ORM. 

```
globetrotter/
├── client/          # Frontend React + TypeScript + Tailwind
└── server/          # Backend Express + TypeScript + Prisma
```

## 5. Folder Structure
```
globetrotter/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       └── types/
└── server/
    ├── prisma/
    │   └── schema.prisma
    └── src/
        ├── controllers/
        ├── routes/
        ├── middleware/
        ├── schemas/
        └── lib/
```

## 6. Team & Responsibilities
- **Harmin Vekariya (Frontend Developer)**: React UI, TypeScript, Tailwind CSS, API integration, context state.
- **Ashish Vekariya (Backend Developer)**: Express APIs, Prisma, PostgreSQL, Zod validation, auth, secure routes.
- **Ashish Gokani (Testing/Integration)**: Feature branch verification, API testing, frontend-backend flow integration, responsive layouts.

## 7. Git Workflow
The repository utilizes feature branches off the main branch:
1. **Backend**: Developer works on a backend branch (e.g., `server-auth`).
2. **Frontend**: Pulls `server-auth` and integrates frontend on a matching client branch (e.g., `client-auth`).
3. **Testing**: Pulls final combined code, runs checks, and approves before merging into `main`.

No direct force-pushes.

## 8. Prerequisites
- **Node.js**: v18+ (v22.x recommended)
- **PostgreSQL**: v14+ running locally or remotely.
- **npm** or **yarn**

## 9. Installation
Clone the repository:
```bash
git clone <repo-url> globetrotter
cd globetrotter
```

### PostgreSQL Setup
1. Create a local PostgreSQL database named `globetrotter`:
   ```bash
   createdb globetrotter
   ```
2. Adjust environment variables inside `server/.env` to point to this database.

### Server Setup (Backend)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (copied from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Perform Prisma migration and client generation:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Client Setup (Frontend)
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```

## 10. Running the Project
Once running:
- **Frontend (Client)**: http://localhost:5173
- **Backend (Server)**: http://localhost:5000

## 11. Environment Variables
### Server (`server/.env`)
- `DATABASE_URL`: PostgreSQL connection string.
- `PORT`: Server port (default `5000`).
- `CLIENT_URL`: React application endpoint (default `http://localhost:5173`).
- `JWT_SECRET`: A secure key for token generation (if applicable).
