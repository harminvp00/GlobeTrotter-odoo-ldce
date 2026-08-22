# GlobeTrotter — Development Plan

This document serves as the official design blueprint, shared contract, and reference guide for the GlobeTrotter development team (Harmin, Ashish V., and Ashish G.).

---

## 1. Project Vision, Mission, & Problem Statement
*As specified in `GlobeTrotter.pdf`:*

### Vision
To become a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. The platform empowers users to dream, design, and organize trips with ease by offering an end-to-end travel planning tool that combines flexibility, interactivity, cost-effective decision-making, and public community sharing.

### Mission
To build a user-centric, responsive application that simplifies the complexity of planning multi-city travel. The platform provides travelers with intuitive tools to:
*   Add and manage travel stops and durations.
*   Explore cities and activities of interest.
*   Estimate trip budgets automatically.
*   Visualize timelines and plans.
*   Share trip plans with others.

### Problem Statement
Design and develop a complete travel planning application supporting customized multi-city itineraries, assignment of travel dates, activities, and budgets, discovery via search, financial cost breakdowns, visual calendars, and public sharing capability—backed by a secure relational database.

---

## 2. Decoupled Architecture & Team Responsibilities

### Harmin Vekariya (Frontend Developer)
*   **Technologies**: React, TypeScript, Context API, Tailwind CSS v4.
*   **Responsibilities**:
    *   Build clean, modern, and accessible layouts based on the Excalidraw mockups.
    *   Implement user interfaces that scale responsively from 375px (mobile) to 1920px (Full HD).
    *   Leverage global React Context to manage active login sessions and active trip configurations.
    *   Implement client-side date boundary verification (e.g. stop dates must lie within trip dates).

### Ashish Vekariya (Backend Developer)
*   **Technologies**: Express.js, Node.js, TypeScript, Prisma 6 ORM, PostgreSQL.
*   **Responsibilities**:
    *   Formulate a secure, stateless JSON REST API.
    *   Validate all incoming request bodies, parameters, and query parameters via Zod schemas.
    *   Build secure authentication utilizing JWTs stored and transmitted securely.
    *   Implement rigorous ownership validation: users must not read, edit, or delete another user's private data.

### Ashish Gokani (Testing & Integration Developer)
*   **Responsibilities**:
    *   Validate API request/response structures against the specifications below.
    *   Perform security boundary checking (e.g. verifying that a user receives `403 Forbidden` when accessing unauthorized private trips).
    *   Verify responsive design layouts on key device viewports.
    *   Approve pull requests and merge feature branches into `main` after verifying integration.

---

## 3. Git Branching Workflow
To maintain code sanity and support parallel developer iteration, we enforce a strict branching protocol:
```
Ashish Vekariya (Backend Development)
        ↓ (Pushes tested backend features)
Branch: server-[feature] (e.g., server-auth, server-trips)
        ↓ (Harmin pulls server branch to integrate and develop client UI)
Harmin Vekariya (Frontend Integration & UI)
        ↓ (Pushes completed integration)
Branch: client-[feature] (e.g., client-auth, client-trips)
        ↓ (Ashish Gokani pulls client branch for verification checks)
Ashish Gokani (Testing & Validation Checks)
        ↓ (Approves and merges)
Branch: main (Production Branch)
```
> [!IMPORTANT]
> **No Direct Pushes to Main**: All code additions must flow through the above pipeline. No merge is allowed on `main` without verification by Ashish Gokani.

---

## 4. Product Modules & Screen Mapping (13 Screens)
Below is the mapping of all 13 screens defined in the project specification to their code locations:

| ID | Screen Name (from PDF) | React Component Location | Express Router Location | Core Database Entities |
|----|-------------------------|--------------------------|-------------------------|-----------------------|
| 1 | **Login / Signup** | `client/src/pages/Auth.tsx` | `server/src/routes/auth.ts` | `User` |
| 2 | **Dashboard / Home** | `client/src/pages/Dashboard.tsx` | `server/src/routes/dashboard.ts` | `Trip`, `City`, `User` |
| 3 | **Create Trip** | `client/src/pages/CreateTrip.tsx` | `server/src/routes/trips.ts` | `Trip` |
| 4 | **My Trips (List)** | `client/src/pages/MyTrips.tsx` | `server/src/routes/trips.ts` | `Trip` |
| 5 | **Itinerary Builder** | `client/src/pages/ItineraryBuilder.tsx` | `server/src/routes/stops.ts` | `TripStop`, `City` |
| 6 | **Itinerary View** | `client/src/pages/ItineraryView.tsx` | `server/src/routes/trips.ts` | `Trip`, `TripStop`, `StopActivity` |
| 7 | **City Search** | `client/src/components/CitySearch.tsx` | `server/src/routes/cities.ts` | `City` |
| 8 | **Activity Search** | `client/src/components/ActivitySearch.tsx` | `server/src/routes/activities.ts` | `Activity` |
| 9 | **Trip Budget & Cost Breakdown** | `client/src/pages/BudgetBreakdown.tsx` | `server/src/routes/expenses.ts` | `Expense`, `Trip` |
| 10 | **Trip Calendar / Timeline** | `client/src/pages/TripCalendar.tsx` | `server/src/routes/trips.ts` | `TripStop`, `StopActivity` |
| 11 | **Shared/Public Itinerary View** | `client/src/pages/SharedTrip.tsx` | `server/src/routes/shares.ts` | `Trip`, `TripShare` |
| 12 | **User Profile / Settings** | `client/src/pages/ProfileSettings.tsx` | `server/src/routes/profile.ts` | `User`, `UserPreference`, `SavedDestination` |
| 13 | **Admin / Analytics Dashboard** | `client/src/pages/AdminDashboard.tsx` | `server/src/routes/admin.ts` | `Trip`, `City`, `User` |

---

## 5. Development Phases
Implementation will be executed in 6 logical, incremental phases:

### Phase 1: Authentication & Profile Settings (Screens 1 & 12)
*   **Backend**: Setup `/api/auth` endpoints (register, login, logout, me) with bcrypt password hashing and JWT payload creation. Add profile management (`/api/profile`) endpoints to read/update user preferences and delete accounts.
*   **Frontend**: Build login/signup page with forms for name, email, password, and basic front-end checks. Develop the settings screen for language selection and account management.

### Phase 2: Trip Creation & Dashboard (Screens 2, 3 & 4)
*   **Backend**: Setup `/api/trips` CRUD routes. Establish `/api/dashboard` returning aggregate analytics (active trip count, upcoming trip summary, total budget, saved destinations).
*   **Frontend**: Build the home dashboard showing upcoming trip cards and the "Plan New Trip" trigger. Create forms to define trip parameters (name, dates, description, currency).

### Phase 3: Cities & Activities Discovery (Screens 7 & 8)
*   **Backend**: Build index queries for cities with name-matching fuzzy search and category filtering. Provide activity indexes for each city based on popularity and cost metrics.
*   **Frontend**: Build the search panel interface allowing users to filter cities by region and browse local activities (e.g. food, sightseeing) with simple visual cards.

### Phase 4: Itinerary Building & Calendars (Screens 5, 6 & 10)
*   **Backend**: Configure stops management (`/api/trips/:tripId/stops`) ensuring strict chronological and order sorting logic. Build routes to assign specific activities to trip stops (`/api/stops/:stopId/activities`).
*   **Frontend**: Develop the day-by-day Itinerary Builder. Implement drag-and-drop or sequential reordering of stops. Add the calendar view mode.

### Phase 5: Budget Planning & Expenses (Screen 9)
*   **Backend**: Build expense endpoints (`/api/trips/:tripId/expenses`) enabling categorical cost tracking (Stay, Meal, Transport, Activity, Other).
*   **Frontend**: Create the budget visualizer containing category breakdowns (charts) and trigger warnings if accumulated stop/activity costs exceed the trip budget.

### Phase 6: Public Sharing & Admin Panel (Screens 11 & 13)
*   **Backend**: Setup public itinerary access routes via `shareSlug` and toggle visibility configurations. Add analytics routes for administrators.
*   **Frontend**: Build the read-only public layout containing a "Copy Trip" option. Develop the admin panel with usage graphs.

---

## 6. Specific API Contracts

All endpoints return a uniform payload structure:
*   **Success**: `{ "message": "Success status msg", "data": { ... } }`
*   **Error**: `{ "error": "Reason for failure", "details": [ ... ] }`

### Auth Headers
Protected endpoints require:
`Authorization: Bearer <JWT_TOKEN>`

---

### A. Authentication
#### 1. Register User (`POST /api/auth/register`)
*   **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "Password123"
    }
    ```
*   **Success (201 Created)**:
    ```json
    {
      "message": "User registered successfully",
      "data": {
        "user": {
          "id": "u-uuid",
          "name": "Jane Doe",
          "email": "jane@example.com"
        }
      }
    }
    ```

#### 2. Login User (`POST /api/auth/login`)
*   **Request Body**:
    ```json
    {
      "email": "jane@example.com",
      "password": "Password123"
    }
    ```
*   **Success (200 OK)**:
    ```json
    {
      "message": "Login successful",
      "data": {
        "token": "jwt-token-string",
        "user": {
          "id": "u-uuid",
          "name": "Jane Doe",
          "email": "jane@example.com"
        }
      }
    }
    ```

#### 3. Logout User (`POST /api/auth/logout`)
*   **Auth Required**: Yes
*   **Success (200 OK)**:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

#### 4. Get Current User (`GET /api/auth/me`)
*   **Auth Required**: Yes
*   **Success (200 OK)**:
    ```json
    {
      "data": {
        "user": {
          "id": "u-uuid",
          "name": "Jane Doe",
          "email": "jane@example.com"
        }
      }
    }
    ```

#### 5. Forgot Password (`POST /api/auth/forgot-password`)
*   **Request Body**:
    ```json
    {
      "email": "jane@example.com"
    }
    ```
*   **Success (200 OK)**:
    ```json
    {
      "message": "If this email is registered, a password reset link has been sent."
    }
    ```

#### 6. Reset Password (`POST /api/auth/reset-password`)
*   **Request Body**:
    ```json
    {
      "token": "reset-token-value",
      "newPassword": "NewPassword123"
    }
    ```
*   **Success (200 OK)**:
    ```json
    {
      "message": "Password reset successful. You can now log in with your new password."
    }
    ```

---

### B. Dashboard
#### 1. Retrieve Dashboard Data (`GET /api/dashboard`)
*   **Success (200 OK)**:
    ```json
    {
      "data": {
        "welcomeMessage": "Hello, Jane Doe!",
        "stats": {
          "totalTrips": 3,
          "savedDestinationsCount": 5,
          "totalPlannedBudget": 150000.00
        },
        "recentTrips": [
          {
            "id": "t-uuid",
            "name": "Goa Getaway",
            "startDate": "2026-10-01",
            "endDate": "2026-10-05",
            "stopCount": 2
          }
        ],
        "recommendations": [
          {
            "id": "c-uuid",
            "name": "Shimla",
            "country": "India",
            "popularity": 95
          }
        ]
      }
    }
    ```

---

### C. Trips
#### 1. Create Trip (`POST /api/trips`)
*   **Request Body**:
    ```json
    {
      "name": "Monalisa & Alps",
      "description": "Paris and Zurich trip",
      "startDate": "2026-09-01T00:00:00.000Z",
      "endDate": "2026-09-10T00:00:00.000Z",
      "budget": 250000.00,
      "currency": "INR",
      "visibility": "PRIVATE"
    }
    ```
*   **Success (201 Created)**:
    ```json
    {
      "message": "Trip created successfully",
      "data": {
        "id": "t-uuid",
        "name": "Monalisa & Alps",
        "startDate": "2026-09-01T00:00:00.000Z",
        "endDate": "2026-09-10T00:00:00.000Z"
      }
    }
    ```

#### 2. Get Trip Details (`GET /api/trips/:id`)
*   **Success (200 OK)**:
    ```json
    {
      "data": {
        "id": "t-uuid",
        "name": "Monalisa & Alps",
        "budget": 250000.00,
        "currency": "INR",
        "visibility": "PRIVATE",
        "shareSlug": "slug-xyz",
        "stops": [
          {
            "id": "ts-uuid",
            "city": { "name": "Paris", "country": "France" },
            "startDate": "2026-09-01T00:00:00.000Z",
            "endDate": "2026-09-05T00:00:00.000Z",
            "order": 1,
            "activities": []
          }
        ]
      }
    }
    ```
    
---

### D. Itinerary Builder (Stops & Stop Activities)
#### 1. Add Stop to Trip (`POST /api/trips/:tripId/stops`)
*   **Request Body**:
    ```json
    {
      "cityId": "c-uuid",
      "startDate": "2026-09-01T00:00:00.000Z",
      "endDate": "2026-09-05T00:00:00.000Z",
      "order": 1,
      "notes": "Exploring Paris"
    }
    ```
*   **Success (201 Created)**:
    ```jsoni
    {
      "message": "Stop added successfully",
      "data": {
        "id": "ts-uuid",
        "tripId": "t-uuid",
        "cityId": "c-uuid",
        "order": 1
      }
    }
    ```

#### 2. Assign Activity to Stop (`POST /api/stops/:stopId/activities`)
*   **Request Body**:
    ```json
    {
      "activityId": "a-uuid",
      "date": "2026-09-02T00:00:00.000Z",
      "startTime": "2026-09-02T10:00:00.000Z",
      "endTime": "2026-09-02T12:00:00.000Z",
      "order": 1,
      "customCost": 1500.00,
      "notes": "Eiffel Tower tickets booked online"
    }
    ```
*   **Success (201 Created)**:
    ```json
    {
      "message": "Activity assigned successfully",
      "data": {
        "id": "sa-uuid",
        "tripStopId": "ts-uuid",
        "activityId": "a-uuid",
        "date": "2026-09-02"
      }
    }
    ```

---

### E. City & Activity Search
#### 1. Search Cities (`GET /api/cities`)
*   **Query Params**: `q=paris`
*   **Success (200 OK)**:
    ```json
    {
      "data": [
        {
          "id": "c-uuid",
          "name": "Paris",
          "country": "France",
          "region": "Europe",
          "costIndex": 85.00,
          "popularity": 98
        }
      ]
    }
    ```

#### 2. Search Activities (`GET /api/activities`)
*   **Query Params**: `cityId=c-uuid&type=SIGHTSEEING`
*   **Success (200 OK)**:
    ```json
    {
      "data": [
        {
          "id": "a-uuid",
          "name": "Louvre Museum Tour",
          "type": "SIGHTSEEING",
          "estimatedCost": 2200.00,
          "durationMinutes": 180
        }
      ]
    }
    ```

---

### F. Trip Budget & Expenses
#### 1. Add Expense (`POST /api/trips/:tripId/expenses`)
*   **Request Body**:
    ```json
    {
      "tripStopId": "ts-uuid",
      "category": "STAY",
      "description": "Hotel Ibis Paris",
      "amount": 25000.00,
      "currency": "INR",
      "date": "2026-09-01T00:00:00.000Z"
    }
    ```
*   **Success (201 Created)**:
    ```json
    {
      "message": "Expense logged successfully",
      "data": {
        "id": "e-uuid",
        "category": "STAY",
        "amount": 25000.00
      }
    }
    ```

---

### G. Public Sharing
#### 1. Retrieve Public Itinerary (`GET /api/shares/:shareSlug`)
*   **Success (200 OK)**:
    ```json
    {
      "data": {
        "tripName": "Monalisa & Alps",
        "creator": "Jane Doe",
        "startDate": "2026-09-01",
        "endDate": "2026-09-10",
        "stops": [
          {
            "city": "Paris",
            "country": "France",
            "durationDays": 4,
            "activities": ["Louvre Museum Tour"]
          }
        ]
      }
    }
    ```

---

## 7. Testing & Validation Checklist

### Backend & API Validations (Ashish V.)
- [ ] **Auth Enforcement**: Try fetching `/api/trips` without a Bearer JWT (must return `401 Unauthorized`).
- [ ] **Resource Isolation**: Request a trip belonging to user B while logged in as user A (must return `403 Forbidden`).
- [ ] **Zod Schema Rejection**: Submit negative amounts for budgets or invalid date strings (must return `400 Bad Request` with exact Zod validation failures).
- [ ] **Chronological Order Checking**: Submit a `tripStop` where the `startDate` is after the `endDate` (must return `400 Bad Request`).

### UI Layout & Responsiveness Checklist (Harmin V.)
- [ ] **Mobile Layout (375px)**: Dashboard, list items, and form panels collapse into vertical linear cards. Bottom navigation or side drawer adjusts properly.
- [ ] **Tablet Layout (768px)**: Calendar timelines adjust. Columns transition to 2-grid formats.
- [ ] **Desktop Layout (1024px to 1920px)**: Builder panels render alongside side search elements without stretching content excessively.
- [ ] **Dynamic Theme Palette**: Ensure the Purple + White theme remains visually unified across components. Primary buttons have hover states.

### Quality Assurance checks (Ashish G.)
- [ ] **Fuzzy Search checks**: Validate city search works with partial name queries (e.g. `par` successfully locates `Paris`).
- [ ] **Budget Warning System**: Set a trip budget to 10,000 INR, log an expense of 12,000 INR, and check if the frontend displays warning alerts.
- [ ] **Shared Link Duplication**: Test the "Copy Trip" option on a shared link page using a different logged-in account (validating trip stops copy over).
