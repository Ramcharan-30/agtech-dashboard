# AgTech Dashboard - Project Documentation

## Project Overview

**AgTech Intel** is a full-stack web application designed as a market intelligence platform for the agricultural technology sector. It enables users to analyze competitor data, generate SWOT analyses, track market trends, and access comprehensive analytics about the AgTech market.

**Repository:** https://github.com/Ramcharan-30/agtech-dashboard

**Language Composition:**
- JavaScript: 75.1%
- CSS: 24.4%
- HTML: 0.5%

---

## Architecture Overview

### Tech Stack

#### Frontend
- **Framework:** React 19.2.7
- **Build Tool:** Vite 8.1.1
- **Routing:** React Router DOM 7.18.1
- **Styling:** Tailwind CSS 4.3.2
- **HTTP Client:** Axios 1.18.1
- **Charting:** Recharts 3.9.1
- **Icons:** React Icons 5.7.0
- **Compiler:** React Compiler with Babel
- **Linter:** Oxlint 1.71.0

#### Backend
- **Runtime:** Node.js with ES Modules
- **Framework:** Express 5.2.1
- **Database:** MongoDB with Mongoose 9.7.3
- **Authentication:** JWT (jsonwebtoken 9.0.3) + Google OAuth
- **Password Hashing:** bcryptjs 3.0.3
- **CORS:** Enabled via cors middleware
- **Environment:** dotenv 17.4.2
- **Google Auth:** google-auth-library 10.9.0

---

## Project Structure

```
agtech-dashboard/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── main.jsx            # Application entry point
│   │   ├── App.jsx             # Root component with routing
│   │   ├── App.css             # Global styles (sidebar, navigation)
│   │   ├── index.css           # Design system tokens & Tailwind imports
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state management
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Email/password + Google OAuth login
│   │   │   ├── Register.jsx    # User registration page
│   │   │   ├── Dashboard.jsx   # Main dashboard (market overview)
│   │   │   ├── Competitors.jsx # Competitor list view
│   │   │   ├── CompetitorDetail.jsx # Individual competitor detail
│   │   │   ├── SwotAnalysis.jsx    # SWOT analysis interface
│   │   │   ├── MarketTrends.jsx    # Market trends visualization
│   │   │   ├── Analytics.jsx       # Analytics dashboard
│   │   │   └── Settings.jsx        # User settings & preferences
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx # Main layout with sidebar
│   │   ├── services/
│   │   │   └── api.js          # Axios API client & requests
│   │   └── components/         # Reusable UI components
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .oxlintrc.json         # Oxlint configuration
│
└── backend/                    # Express.js API server
    ├── server.js              # Express app setup & port configuration
    ├── config/
    │   └── db.js             # MongoDB connection configuration
    ├── models/
    │   ├── User.js           # User schema with password hashing
    │   └── Competitor.js     # Competitor data model
    ├── controllers/
    │   ├── authController.js      # Auth logic (register, login, OAuth)
    │   ├── competitorController.js # Competitor CRUD operations
    │   └── swotController.js       # SWOT analysis engine
    ├── routes/
    │   ├── authRoutes.js      # Auth endpoints
    │   ├── competitorRoutes.js # Competitor endpoints
    │   └── swotRoutes.js       # SWOT analysis endpoints
    ├── middleware/
    │   └── auth.js            # JWT token verification middleware
    ├── package.json
    └── .env                   # Environment variables
```

---

## Core Features & Functionality

### 1. Authentication System

#### Frontend (AuthContext.jsx)
- **State Management:** React Context API for global auth state
- **Key Features:**
  - Email/password login and registration
  - Google OAuth 2.0 integration
  - JWT token storage in localStorage
  - Token validation on app mount
  - Automatic redirect based on auth status
  - User profile management

- **Methods:**
  - `login(email, password)` - Email login
  - `register(name, email, password)` - User registration
  - `googleLogin(credential)` - Google OAuth callback
  - `logout()` - Clear auth state and storage
  - `updateUserProfile(userData)` - Update user info

#### Backend (authController.js)
- **Register:** Validates input, checks for duplicates, hashes password with bcryptjs (salt=12)
- **Login:** Verifies email/password, prevents Google-only accounts from using password auth
- **Google Auth:** Verifies Google ID token, creates/retrieves user
- **JWT Token:** Signed with 7-day expiration
- **Password Security:** Never stored in plain text, compared using bcryptjs.compare()

### 2. Protected Routes & Authorization

#### ProtectedRoute Component (App.jsx)
```javascript
- Checks authentication status
- Shows loading state while validating
- Redirects unauthenticated users to /login
- Wraps dashboard routes
```

#### Backend Middleware (middleware/auth.js)
```javascript
- Extracts Bearer token from Authorization header
- Verifies JWT signature and expiration
- Attaches authenticated user to req.user
- Returns 401 if token invalid/expired/missing
```

### 3. Competitor Management

#### Data Model (models/Competitor.js)
```javascript
- name: String (unique, required)
- description: String
- marketShare: Number (percentage)
- revenue: Number (in millions)
- businessModel: Enum (Direct Sales, Machinery-as-a-Service, B2G, Subscription, Hybrid)
- adoptionMetrics: {
    activeFarmers: Number,
    acreageCovered: Number
  }
- techStack: [String] (array of technologies)
- timestamps: auto-generated createdAt/updatedAt
```

#### API Endpoints (competitorController.js)
- `GET /api/competitors` - Fetch all competitors
- `POST /api/competitors` - Create competitor (with duplicate check)
- `PUT /api/competitors/:id` - Update competitor (validates + runs validators)
- `DELETE /api/competitors/:id` - Remove competitor

### 4. SWOT Analysis Engine

#### Algorithm (swotController.js)
**Comparative SWOT between two competitors:**

1. **Market Share & Revenue Comparison**
   - Identifies market leader vs follower
   - Generates strength/weakness statements based on financial metrics
   
2. **Tech Stack Differentiation**
   - Finds unique technologies for each competitor
   - Highlights proprietary advantages and niche opportunities
   
3. **Adoption & Customer Base**
   - Compares active farmers and acreage coverage
   - Assesses grassroots adoption threats

4. **Rule-Based Strategic Insights**
   - Generates actionable SWOT categories
   - Produces comparative threat analysis

### 5. User Interface & Styling

#### Design System (index.css)
**Color Palette (Dark Theme):**
- Brand Green: #10b981 (Emerald)
- Background: #0b1120 to #1a2332 (Deep Navy)
- Text: #f1f5f9 (Light Gray)
- Borders: Subtle gray with 8-12% opacity

**CSS Custom Properties (CSS Variables):**
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--accent`, `--accent-hover`, `--accent-glow`
- `--border-subtle`, `--border-default`, `--border-strong`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`

#### Sidebar Navigation (App.css)
- **Collapsible Design:** 260px expanded → 68px collapsed
- **Smooth Animations:** 0.3s cubic-bezier transitions
- **Active State:** Green accent bar on left + background glow
- **Responsive Behavior:** Icon-only mode when collapsed
- **Gradient Accent:** Linear gradient on logo text

---

## Key Pages & Components

### 1. Login Page (Login.jsx)
- Email/password form with validation
- Google Sign-In button (dynamically rendered)
- Error handling with alert display
- Auto-redirect if already authenticated
- React hooks: useState, useEffect, useCallback, useRef

### 2. Register Page (Register.jsx)
- Name, email, password fields
- Password confirmation validation (min 6 chars)
- Google Sign-Up integration
- Duplicate email detection
- Same redirect/error handling as login

### 3. Dashboard Layout (DashboardLayout.jsx)
- **Persistent Sidebar:** State saved in localStorage
- **Navigation Items:** 6 main routes (Market Overview, Competitors, SWOT, Trends, Analytics, Settings)
- **User Avatar:** Initials generated from name
- **Active Route Detection:** Highlights current page in nav
- **Logout Button:** Clears auth context

### 4. Competitors Page (Competitors.jsx)
- Displays list of competitors
- Link to individual competitor details
- Card-based layout with company metrics
- Integration with /api/competitors endpoint

### 5. SWOT Analysis Page (SwotAnalysis.jsx)
- Dropdown/selector for two competitors
- Calls `/api/swot/compare` POST endpoint
- Displays comparative insights in SWOT format
- Visual organization of Strengths, Weaknesses, Opportunities, Threats

### 6. Settings Page (Settings.jsx)
- **Theme Toggle:** Dark/light mode with localStorage persistence
- **Profile Management:** Name/email editing
- **Notifications:** Toggle for email alerts, market updates, competitor alerts
- **Data Export:** Export competitors as JSON file
- **Save Status:** Visual feedback (saving → saved)

---

## API Routes & Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Create new user | No |
| POST | `/login` | Login with credentials | No |
| POST | `/google` | Google OAuth callback | No |
| GET | `/me` | Get current user data | Yes |
| PUT | `/me` | Update user profile | Yes |

### Competitor Routes (`/api/competitors`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Fetch all competitors | No |
| POST | `/` | Create competitor | No |
| PUT | `/:id` | Update competitor | No |
| DELETE | `/:id` | Delete competitor | No |

### SWOT Routes (`/api/swot`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/compare` | Generate SWOT comparison | No |

---

## Data Flow & Key Interactions

### Authentication Flow
```
User Login → Frontend sends email/password → Backend verifies → 
Hash comparison with bcryptjs → JWT token generated → 
Token stored in localStorage → AuthContext updated → 
Redirect to dashboard
```

### Google OAuth Flow
```
Google Sign-In button click → Google callback with credential → 
Frontend sends credential to backend → Backend verifies with Google → 
User created/retrieved from DB → JWT token generated → 
Same flow as email login
```

### Competitor Data Flow
```
Frontend requests /api/competitors → Backend queries MongoDB → 
Returns array of competitor docs → Frontend populates UI → 
User clicks competitor → Routes to CompetitorDetail with ID → 
Individual view with SWOT analysis option
```

### SWOT Analysis Flow
```
User selects two competitors → Submits to /api/swot/compare → 
Backend loads both competitor documents → 
Rule engine analyzes market share, tech stack, adoption → 
Generates SWOT insights → Returns to frontend → 
Displayed in organized UI sections
```

---

## State Management Strategy

### Frontend State (React)
1. **AuthContext:** Global auth state (user, token, isAuthenticated, isLoading)
2. **Local Component State:** Form inputs, UI toggles (useState)
3. **Router State:** Current route via useLocation()
4. **Browser Storage:** JWT token, theme preference, sidebar state (localStorage)

### Backend State (Express)
1. **Database:** MongoDB stores users, competitors, auth data
2. **In-Memory:** Request context (req.user from middleware)
3. **JWT Claims:** User ID encoded in token, decoded on verification

---

## Security Considerations

### Frontend
- ✅ Protected routes prevent unauthorized access
- ✅ JWT stored in localStorage (consider httpOnly cookie for production)
- ✅ Token validation on app startup
- ✅ Auto-logout on token expiration
- ✅ Google OAuth 2.0 for third-party auth

### Backend
- ✅ Password hashing with bcryptjs (salt rounds: 12)
- ✅ JWT verification middleware on protected routes
- ✅ Google ID token verification via google-auth-library
- ✅ CORS configured to allow trusted origins
- ✅ Input validation on all POST/PUT endpoints
- ✅ MongoDB schema validation with Mongoose

### Recommendations for Production
- Use httpOnly cookies for JWT instead of localStorage
- Add rate limiting on auth endpoints
- Implement HTTPS/TLS for all connections
- Add request validation schemas (Joi, Zod)
- Add audit logging for sensitive operations
- Implement refresh token rotation
- Add CSRF protection

---

## File-by-File Code Breakdown

### Frontend Entry Point (main.jsx)
```javascript
- Imports React 19 StrictMode
- Creates root element using createRoot
- Renders App.jsx in StrictMode
```

### App Component (App.jsx)
- Sets up React Router with BrowserRouter
- AuthProvider wraps all routes
- ProtectedRoute HOC for dashboard routes
- PublicRoute HOC for login/register (redirects if authenticated)
- Defines 7 routes + catch-all fallback

### Design System (index.css)
- Tailwind CSS imports with @import "tailwindcss"
- @theme block defines custom color tokens
- :root defines 50+ CSS custom properties
- Supports dark theme by default

### Sidebar Styles (App.css)
- `.sidebar` - 260px width, flex column layout, smooth transitions
- `.sidebar-collapsed` - 68px width, centers icons
- `.nav-item` - 10px 14px padding, color transitions, active state indicator
- `.sidebar-logo-text` - Gradient text effect using -webkit-background-clip

### Authentication Context (AuthContext.jsx)
- Provides auth state to entire app via context
- Methods for login, register, googleLogin, logout, updateProfile
- Validates token on mount (useEffect)
- Automatically saves/retrieves from localStorage

### Backend Server (server.js)
- Express app with JSON middleware
- CORS enabled
- Routes mounted: /api/auth, /api/competitors, /api/swot
- Listens on PORT (default 5000)

### Database Config (config/db.js)
- Mongoose async connection
- Error handling with process.exit(1)
- Logs connection success/failure

### User Model (models/User.js)
- Schema fields: name, email, password, avatar, authProvider, googleId
- Timestamps: createdAt, updatedAt
- Pre-save hook: Hashes password if modified
- Methods: matchPassword() for comparison

### Competitor Model (models/Competitor.js)
- Schema fields: name, description, marketShare, revenue, businessModel, adoptionMetrics, techStack
- Enum for businessModel (5 options)
- Nested adoptionMetrics object
- Auto-generated timestamps

### Auth Middleware (middleware/auth.js)
- Extracts Bearer token from Authorization header
- Verifies JWT using JWT_SECRET
- Decodes token and fetches user from DB
- Attaches user to req.user for downstream handlers

### Auth Controller (authController.js)
- `register()` - Validates fields, checks duplicate email, creates user
- `login()` - Selects password field, compares with bcryptjs, returns JWT
- `googleAuth()` - Verifies Google token, finds/creates user, returns JWT
- `getMe()` - Protected route, returns current user (protected middleware)
- `updateProfile()` - Protected route, updates user fields

### Competitor Controller (competitorController.js)
- `getCompetitors()` - Simple find() query
- `createCompetitor()` - Validates data, checks duplicate name, saves
- `updateCompetitor()` - Finds competitor, updates with runValidators
- `deleteCompetitor()` - Finds and removes competitor

### SWOT Controller (swotController.js)
- `generateComparativeSWOT()` - Main logic
- Takes competitorOneId, competitorTwoId
- Compares market share, revenue, tech stack, adoption
- Returns structured SWOT analysis with 4 categories

---

## Performance Considerations

### Frontend
- **Vite:** Fast build/dev server with HMR
- **React Compiler:** Auto-optimization of components
- **Code Splitting:** Route-based splitting via React Router
- **Lazy Loading:** Images and components can be lazily loaded
- **Caching:** Leverages browser cache headers

### Backend
- **Mongoose Indexing:** Can be added to frequently queried fields (email, name)
- **Query Optimization:** Use `.select()` to fetch only needed fields
- **Pagination:** Not yet implemented but recommended for large competitor lists
- **Connection Pooling:** MongoDB through Mongoose handles this

### Optimization Opportunities
1. Add `.select()` in competitor queries to exclude unnecessary fields
2. Implement pagination on /api/competitors
3. Add Redis caching for SWOT analysis results
4. Use CDN for static assets
5. Implement API rate limiting
6. Add request compression (gzip)

---

## Dependencies Summary

### Frontend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.7 | UI framework |
| react-router-dom | 7.18.1 | Client-side routing |
| axios | 1.18.1 | HTTP client |
| recharts | 3.9.1 | Charts/graphs |
| tailwindcss | 4.3.2 | CSS utility framework |
| react-icons | 5.7.0 | Icon library |

### Backend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.2.1 | Web framework |
| mongoose | 9.7.3 | MongoDB ODM |
| jsonwebtoken | 9.0.3 | JWT auth |
| bcryptjs | 3.0.3 | Password hashing |
| google-auth-library | 10.9.0 | Google OAuth |
| cors | 2.8.6 | Cross-origin support |

---

## Environment Variables Required

### Frontend (.env)
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000 (or production URL)
```

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/agtech-dashboard
JWT_SECRET=your_secret_key_min_32_chars
GOOGLE_CLIENT_ID=same_as_frontend
PORT=5000
NODE_ENV=development
```

---

## Deployment Considerations

### Frontend Deployment (Vite)
```bash
npm run build  # Creates dist/ folder
# Deploy dist/ to Vercel, Netlify, or static host
```

### Backend Deployment
```bash
npm start  # Production mode
# Deploy to Heroku, AWS, DigitalOcean, Railway, etc.
# Ensure MONGO_URI points to production MongoDB
# Set JWT_SECRET to strong random string
```

### Database
- Use MongoDB Atlas for managed cloud database
- Enable IP whitelist for security
- Set up automated backups

---

## Testing Recommendations

### Frontend Unit Tests
- Test AuthContext methods (login, logout, updateProfile)
- Test Protected/Public Route components
- Test form validation (Login, Register)
- Test API integration with axios mocks

### Backend Unit Tests
- Test auth controller functions with mocked DB
- Test competitor CRUD operations
- Test SWOT analysis engine with sample data
- Test middleware token verification

### Integration Tests
- Full auth flow (register → login → access protected route)
- Competitor creation → SWOT analysis flow
- Google OAuth callback handling
- Token expiration scenarios

---

## Future Enhancement Ideas

1. **Real-time Updates:** WebSocket integration for live market data
2. **Advanced Analytics:** Charts, trends, forecasting
3. **Email Notifications:** Send SWOT reports via email
4. **API Documentation:** Swagger/OpenAPI specs
5. **Search & Filters:** Advanced competitor search
6. **Historical Data:** Track changes over time
7. **User Roles:** Admin vs regular user permissions
8. **Batch Operations:** Import competitors from CSV
9. **Favorites:** Bookmark preferred competitors
10. **Comments:** Add notes/discussions on competitors

---

## Interview Preparation Guide

### Questions You Should Be Able to Answer

#### Architecture & Design
1. **How is this project structured?** (Full-stack, monorepo pattern, frontend/backend separation)
2. **Why was React chosen for the frontend?** (Component-based, state management, ecosystem)
3. **Why Express + MongoDB?** (Lightweight, flexible schema, JSON-native)
4. **How does authentication work?** (JWT tokens, Google OAuth)

#### Frontend-Specific
5. **How do you manage global state?** (React Context API, AuthContext)
6. **Explain the routing structure.** (Protected routes, PublicRoutes, nested routes)
7. **How is styling organized?** (Tailwind CSS + CSS custom properties)
8. **How do you handle localStorage?** (Token persistence, sidebar state, theme)
9. **What are the React hooks used?** (useState, useEffect, useContext, useCallback, useRef)

#### Backend-Specific
10. **How is the database connected?** (Mongoose, connection pooling)
11. **Explain the auth middleware.** (JWT verification, Bearer token extraction)
12. **How are passwords stored securely?** (bcryptjs with salt=12)
13. **What is the SWOT analysis algorithm?** (Comparative analysis based on metrics)
14. **How do you validate data?** (Mongoose schema validation, field checks)

#### Security
15. **How would you prevent SQL injection?** (MongoDB + Mongoose schema validation)
16. **How is CORS configured?** (Enabled at app level, can restrict origins)
17. **What security improvements would you make?** (httpOnly cookies, rate limiting, HTTPS)
18. **How are sensitive fields protected?** (Password select: false, JWT expiration)

#### Performance & Optimization
19. **How would you optimize the competitor list?** (Pagination, indexing, lazy loading)
20. **What caching strategies could you implement?** (Redis, browser caching, CDN)
21. **How does Vite improve build performance?** (ES modules, HMR, tree-shaking)

#### Problem-Solving
22. **How would you add real-time notifications?** (WebSocket, Socket.io, Server-Sent Events)
23. **How would you implement competitor filtering?** (Query parameters, MongoDB query operators)
24. **How would you handle large competitor datasets?** (Pagination, virtual scrolling, server-side filtering)
25. **How would you test the SWOT analysis?** (Unit tests with mock data, integration tests)

### Code Review Topics

#### Frontend Code Quality
- Proper error handling with try/catch
- Loading states and user feedback
- Component reusability
- Prop validation
- Accessibility considerations

#### Backend Code Quality
- Input validation before processing
- Error responses with appropriate HTTP status codes
- Middleware composition
- Database query efficiency
- Separation of concerns (models, controllers, routes)

### Live Coding Scenario Ideas

1. **"Add a search/filter feature to competitors list"** (Query params, filtering logic)
2. **"Implement pagination for large competitor lists"** (Frontend + backend)
3. **"Add email notification for competitor changes"** (Backend service integration)
4. **"Create a competitor comparison feature"** (New page, data visualization)
5. **"Add audit logging for user actions"** (Middleware, database logging)

---

## Glossary

- **SWOT:** Strengths, Weaknesses, Opportunities, Threats analysis
- **JWT:** JSON Web Token for stateless authentication
- **OAuth:** Open Authorization standard for third-party authentication
- **Mongoose:** ODM (Object Document Mapper) for MongoDB
- **Middleware:** Functions that execute during request processing
- **Context API:** React feature for global state management
- **Protected Route:** Route that requires authentication to access
- **bcryptjs:** Library for securely hashing passwords
- **Vite:** Build tool that uses ES modules for faster development
- **Tailwind CSS:** Utility-first CSS framework
- **RESTful API:** API using standard HTTP methods (GET, POST, PUT, DELETE)
- **HMR:** Hot Module Replacement for instant dev server updates

---

## How to Use This Documentation with ChatGPT

### For Code Explanation
```
"Here's a code snippet from my project:
[paste code]

Based on the PROJECT_DOCUMENTATION.md, explain what this does and how it relates to the overall architecture."
```

### For Interview Prep
```
"Ask me one of the backend-specific interview questions from the documentation 
and evaluate my answer."
```

### For Debugging
```
"I have an error in [component/endpoint]. Here's the error:
[paste error]

Reference the relevant section from PROJECT_DOCUMENTATION.md and help me debug."
```

### For Feature Implementation
```
"How would I add [new feature] to the AgTech dashboard based on 
the existing architecture documented in PROJECT_DOCUMENTATION.md?"
```

---

## Contact & Support

**Repository:** https://github.com/Ramcharan-30/agtech-dashboard

**Created by:** Ramcharan-30

This documentation provides a comprehensive guide to understanding the entire codebase, suitable for interview preparation and code walkthroughs. Use it as a reference when discussing the project with interviewers or explaining code to ChatGPT.

**Last Updated:** August 2026

---

## Quick Reference

### Key Files to Review Before Interview
- `frontend/src/App.jsx` - Routing & protected routes
- `frontend/src/context/AuthContext.jsx` - State management
- `backend/server.js` - Express setup
- `backend/controllers/authController.js` - Auth logic
- `backend/controllers/swotController.js` - Core algorithm
- `backend/models/User.js` & `Competitor.js` - Data models

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run Oxlint
npm run preview  # Preview production build
```

### Backend Commands
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
```

### Quick Feature Overview
- 🔐 Authentication with JWT + Google OAuth
- 🏢 Competitor management (CRUD operations)
- 📊 SWOT analysis engine (comparative analysis)
- 🎨 Dark theme with Tailwind CSS
- 📱 Responsive sidebar navigation
- ⚙️ User settings & profile management
