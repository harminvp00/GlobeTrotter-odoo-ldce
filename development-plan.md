# GlobeTrotter — Development Plan

This document serves as the shared contract and reference guide for the three developers (Harmin, Ashish V., and Ashish G.) working on GlobeTrotter.

---

## 1. Project Description & Architecture
GlobeTrotter is a personalized travel planner that helps users build multi-city itineraries, manage budgets, discover local spots/activities, and share travel plans.
The project uses a decoupled **React client** and an **Express.js server** with a **PostgreSQL** database managed via **Prisma 6**.

---

## 2. Team Responsibilities
- **Harmin Vekariya (Frontend Developer)**:
  - React, TypeScript, Context API for client-side state.
  - Responsive layouts using Tailwind CSS.
  - Client-side validation (dates, inputs, budgets).
  - API integration based on the documented contracts.
- **Ashish Vekariya (Backend Developer)**:
  - Express.js, TypeScript, Zod validation.
  - Authentication (password hashing, session/token management).
  - Secure routes with authorization and ownership checks.
  - Prisma database queries.
- **Ashish Gokani (Testing & Integration Developer)**:
  - Pull and test feature branches before merging.
  - Integration testing between client and server.
  - Boundary and validation failure checks.
  - Mobile responsiveness and layout testing.

---

## 3. Git Workflow
The workflow consists of dedicated feature branches that merge into `main` after verification:
```
Ashish Vekariya (Backend Development)
        ↓ (push)
Branch: server-[feature] (e.g. server-auth)
        ↓ (Harmin pulls)
Harmin Vekariya (Frontend Integration & UI)
        ↓ (push)
Branch: client-[feature] (e.g. client-auth)
        ↓ (Ashish Gokani pulls)
Ashish Gokani (Testing & Validation Checks)
        ↓ (Approve and Merge)
Branch: main
```
*Note*: No force-pushing on `main`. All merges require test approval.

---

## 4. Folder Structure
```
globetrotter/
├── client/
│   ├── public/
│   └── src/
│       ├── components/    # Common and reusable UI modules
│       ├── pages/         # Page-level components
│       ├── context/       # Context API files for global state
│       ├── services/      # API communication methods
│       ├── types/         # Core TypeScript definitions
│       ├── App.tsx
│       └── main.tsx
└── server/
    ├── prisma/
    │   └── schema.prisma  # Schema source of truth (Prisma 6)
    └── src/
        ├── controllers/   # Route handler actions
        ├── routes/        # Express route definitions
        ├── middleware/    # Auth, validation, error-handling middleware
        ├── schemas/       # Zod verification validation models
        ├── lib/           # Prisma Client helper instance
        └── server.ts      # Server listener configuration
```

---

## 5. Database Entities & Relationships
### Schema Models
- **User**: System user record with secure hashed passwords.
- **UserPreference**: Settings linked to a single user (e.g., preferred language).
- **Trip**: High-level trip details (budget, dates, visibility).
- **City**: Static database of cities (cost index, lat/long).
- **TripStop**: Specific cities/stops planned inside a trip, sequenced via an `order` field.
- **Activity**: Curated activities corresponding to cities.
- **StopActivity**: Specific activities assigned by a user to a trip stop.
- **Expense**: Expenditures tracked inside a trip.
- **TripShare**: Access permissions allowing other users to view/edit.
- **SavedDestination**: User's wishlist of cities.

### Relationships
```
User
 ├── Trip
 │    ├── TripStop
 │    │    ├── City
 │    │    └── StopActivity ── Activity
 │    ├── Expense
 │    └── TripShare
 ├── UserPreference
 └── SavedDestination ── City
```

---

## 6. Wireframe-First & Module Creation Rules
> [!IMPORTANT]
> **Wireframe-First Rule**: Do not create or implement a page UI unless a wireframe has been provided. If the user requests a page without a wireframe, request the wireframe.
>
> **Module Creation Rule**: Avoid creating empty files or placeholder folders for features not yet under development. Build only what is actively required for the current feature block.

---

## 7. API Conventions
- **RESTful Routes**: Prefer nouns, correct HTTP verbs, and nested resource endpoints.
- **Format**: All success and error payloads must return consistent JSON structures.
- **Keys**: CamelCase (e.g. `tripId`, `startDate`, `passwordHash`).
- **Validation**: All incoming payloads (body, query, params) must be validated with Zod.
- **Security**: Verification checks must occur on every resource access request to ensure users only mutate or view their own private resources.

---

## 8. API Contracts

### A. Authentication
#### Register
- **Endpoint**: `POST /api/auth/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "message": "Login successful",
    "data": {
      "token": "jwt-token-string",
      "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```

#### Logout
- **Endpoint**: `POST /api/auth/logout`
- **Auth Required**: Yes
- **Success Response (200)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Auth Required**: Yes
- **Success Response (200)**:
  ```json
  {
    "data": {
      "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```

---

### B. Trips
#### Create Trip
- **Endpoint**: `POST /api/trips`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "Europe Summer Tour",
    "description": "Exploring major European cities",
    "startDate": "2026-08-22",
    "endDate": "2026-09-05",
    "budget": 200000.00,
    "currency": "INR",
    "visibility": "PRIVATE"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "message": "Trip created successfully",
    "data": {
      "id": "trip-uuid",
      "name": "Europe Summer Tour",
      ...
    }
  }
  ```

#### List Trips
- **Endpoint**: `GET /api/trips`
- **Auth Required**: Yes
- **Success Response (200)**:
  ```json
  {
    "data": [
      {
        "id": "trip-uuid",
        "name": "Europe Summer Tour",
        "startDate": "2026-08-22",
        "endDate": "2026-09-05",
        "visibility": "PRIVATE"
      }
    ]
  }
  ```

#### Get Trip Detail
- **Endpoint**: `GET /api/trips/:id`
- **Auth Required**: Yes (or Public if TripVisibility is PUBLIC)
- **Success Response (200)**:
  ```json
  {
    "data": {
      "id": "trip-uuid",
      "name": "Europe Summer Tour",
      "stops": [],
      "expenses": []
    }
  }
  ```

---

### C. Stops
#### Create Stop
- **Endpoint**: `POST /api/trips/:tripId/stops`
- **Auth Required**: Yes (Ownership of tripId verified)
- **Request Body**:
  ```json
  {
    "cityId": "city-uuid",
    "startDate": "2026-08-22",
    "endDate": "2026-08-25",
    "order": 1,
    "notes": "First stop of the trip"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "message": "Trip stop created",
    "data": {
      "id": "stop-uuid",
      "tripId": "trip-uuid",
      "cityId": "city-uuid",
      "order": 1
    }
  }
  ```

---

### D. Cities
#### List Cities
- **Endpoint**: `GET /api/cities`
- **Query Params**: `?q=paris&country=France`
- **Auth Required**: Yes
- **Success Response (200)**:
  ```json
  {
    "data": [
      {
        "id": "city-uuid",
        "name": "Paris",
        "country": "France",
        "costIndex": 85.50
      }
    ]
  }
  ```

---

### E. Expenses
#### Create Expense
- **Endpoint**: `POST /api/trips/:tripId/expenses`
- **Auth Required**: Yes (Ownership verified)
- **Request Body**:
  ```json
  {
    "tripStopId": "stop-uuid",
    "category": "TRANSPORT",
    "description": "Train ticket from Paris to Brussels",
    "amount": 4500.00,
    "currency": "INR",
    "date": "2026-08-23"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "message": "Expense added successfully",
    "data": {
      "id": "expense-uuid",
      "amount": 4500.00,
      "category": "TRANSPORT"
    }
  }
  ```

---

## 9. Testing & Validation Checklist (Ashish Gokani)
- **Authentication checks**:
  - Test registration with an email that already exists (should fail with 400).
  - Test login with correct password vs incorrect password.
  - Test access to `/api/trips/:id` where the trip belongs to another user (should fail with 403 Forbidden).
- **Format checks**:
  - Validate date parameters. `endDate` must be greater than or equal to `startDate`.
  - Validate number boundaries (e.g. trip budgets and stop order numbers cannot be negative).
- **Responsive views**:
  - Check the rendering on iPhone SE width (375px) up to Full HD (1920px).
