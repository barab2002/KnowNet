<p align="center">
  <h1 align="center">KnowNet</h1>
  <p align="center">
    An academic knowledge-sharing platform where students and scholars create posts, interact through likes and comments, and leverage AI-powered summarization.
  </p>
  <p align="center">
    <a href="#features">Features</a> &middot;
    <a href="#tech-stack">Tech Stack</a> &middot;
    <a href="#getting-started">Getting Started</a> &middot;
    <a href="#api-reference">API Reference</a> &middot;
    <a href="#testing">Testing</a>
  </p>
</p>

---

## Features

**Knowledge Posts** -- Create and share academic content with text and optional image attachments. Posts support hashtag extraction, full-text search, and infinite-scroll pagination.

**AI Summarization** -- One-click post summaries powered by Google Gemini 2.5 Flash. Summaries are also generated automatically in the background when a new post is created.

**Smart Tagging** -- User-defined `#hashtags` are extracted automatically from post content. When none are provided, the AI generates keyword-based fallback tags.

**Semantic Search** -- Full-text search across post content and tags using MongoDB text indexes, with results ranked by relevance score.

**Social Interactions** -- Like, save/bookmark, and comment on posts. Activity stats are tracked per user (total posts, likes received, AI summaries generated).

**User Profiles** -- Profile pages with bio, academic major, graduation year, and profile image upload (up to 5 MB).

**Authentication** -- Google OAuth 2.0 login with JWT-based session management. Supports "Remember Me" for persistent sessions.

**Dark Mode** -- Full dark theme via Tailwind CSS.

**Swagger API Docs** -- Auto-generated, interactive API documentation at `/api/docs`.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router DOM |
| **Backend** | NestJS 11, Passport (JWT + Google OAuth), Multer |
| **Database** | MongoDB with Mongoose ODM |
| **AI** | Google Generative AI (Gemini 2.5 Flash) |
| **Testing** | Jest, Cypress, Vitest |
| **Monorepo** | Nx 22 |
| **Deployment** | Docker, Docker Compose, Nginx, PM2 |

---

## Project Structure

```
KnowNet/
├── api/                        # NestJS backend (port 3000)
│   └── src/
│       ├── auth/               # Google OAuth & JWT authentication
│       ├── posts/              # Posts CRUD, likes, comments, search
│       │   ├── schemas/        # Mongoose Post model
│       │   └── dto/            # Request validation
│       ├── users/              # User profiles & activity stats
│       │   ├── schemas/        # Mongoose User model
│       │   └── dto/            # Profile update validation
│       ├── ai/                 # Gemini AI integration (summarize, tag)
│       ├── common/             # Shared utilities
│       └── main.ts             # Entry point & Swagger setup
│
├── client/                     # React frontend (port 4200)
│   └── src/
│       ├── features/           # Page components
│       │   ├── auth/           # Login, Register, OAuth callback
│       │   ├── feed/           # Main feed with infinite scroll
│       │   ├── semantic-search/# Full-text search page
│       │   ├── user-profile/   # Profile & activity stats
│       │   ├── post-details/   # Single post view
│       │   └── settings/       # User settings
│       ├── components/         # Reusable UI (PostCard, Modal, Layout, etc.)
│       ├── api/                # Axios HTTP clients
│       ├── contexts/           # Auth state (React Context API)
│       └── theme/              # Dark mode configuration
│
├── client-e2e/                 # Cypress E2E tests
├── api-e2e/                    # Backend integration tests
│
├── docker-compose.yml          # Dev: MongoDB + Mongo Express containers
├── Dockerfile                  # API container
├── Dockerfile.client           # Client container (Nginx)
└── nginx.conf                  # Reverse proxy config
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.12+
- **MongoDB** (local install or Docker)
- **Gemini API key** -- [get one here](https://aistudio.google.com/apikey)
- **Google OAuth credentials** -- [create them here](https://console.cloud.google.com/apis/credentials) (optional, for Google login)

### 1. Clone and install

```bash
git clone https://github.com/barab2002/KnowNet.git
cd KnowNet
npm install
```

### 2. Configure environment

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

`.env` reference:

```env
# AI -- required for summarization and smart tagging
GEMINI_API_KEY=your_gemini_api_key

# Google OAuth -- required for Google login
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/redirect

# Security
JWT_SECRET=a_strong_random_string

# App URLs
FRONTEND_URL=http://localhost:4200
MONGO_URI=mongodb://localhost:27017/knownet
PORT=3000
```

### 3. Start development

```bash
npm run dev
```

This starts MongoDB + Mongo Express via Docker and then runs the API and client locally with hot-reload:

| Service | URL |
| --- | --- |
| Frontend (Vite) | http://localhost:4200 |
| API (NestJS) | http://localhost:3000/api |
| Swagger Docs | http://localhost:3000/api/docs |
| Mongo Express | http://localhost:8081 |

To stop the MongoDB containers:

```bash
npm run dev:down
```

You can also run services individually (requires MongoDB running separately):

```bash
npm run dev:api      # Backend only with hot-reload
npm run dev:client   # Frontend only (Vite dev server)
```

---

## API Reference

Full interactive docs are available at `/api/docs` (Swagger UI) when the server is running.

### Authentication

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/auth/google` | Start Google OAuth flow | -- |
| GET | `/api/auth/google/redirect` | Google OAuth callback | -- |
| GET | `/api/auth/profile` | Get authenticated user | JWT |

### Posts

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/posts` | Create a post (text + optional image) | JWT |
| GET | `/api/posts?limit=10&skip=0` | List posts (paginated, newest first) | -- |
| DELETE | `/api/posts/:id` | Delete a post (author only) | JWT |
| POST | `/api/posts/:id/like` | Toggle like | -- |
| POST | `/api/posts/:id/save` | Toggle bookmark | -- |
| POST | `/api/posts/:id/comment` | Add a comment | -- |
| POST | `/api/posts/:id/summarize` | Generate AI summary | -- |
| GET | `/api/posts/search?q=query` | Full-text search | -- |
| GET | `/api/posts/tags` | List all unique tags | -- |
| GET | `/api/posts/user/:userId` | Posts by a specific user | -- |
| GET | `/api/posts/user/:userId/total-likes` | Total likes received | -- |
| GET | `/api/posts/liked/:userId` | Posts liked by user | -- |
| GET | `/api/posts/saved/:userId` | Posts saved by user | -- |

### Users

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/users/:userId` | Get user profile | -- |
| POST | `/api/users` | Create / sync user | -- |
| PUT | `/api/users/:userId` | Update profile (bio, major, year) | -- |
| POST | `/api/users/:userId/profile-image` | Upload profile image (5 MB max) | -- |

---

## Database Schema

### User

| Field | Type | Description |
| --- | --- | --- |
| `_id` | string | Google ID or generated UUID |
| `email` | string | Unique email address |
| `name` | string | Display name |
| `bio` | string? | Short biography |
| `major` | string? | Academic major |
| `graduationYear` | string? | Expected graduation year |
| `profileImageUrl` | string? | Avatar URL |
| `postsCount` | number | Total posts created |
| `likesReceived` | number | Total likes across all posts |
| `aiSummariesCount` | number | AI summaries generated |
| `joinedDate` | Date | Account creation timestamp |

### Post

| Field | Type | Description |
| --- | --- | --- |
| `content` | string | Post body text |
| `tags` | string[] | Combined user + AI tags |
| `userTags` | string[] | Hashtags extracted from content |
| `aiTags` | string[] | AI-generated keywords |
| `summary` | string? | AI-generated summary |
| `imageUrl` | string? | Attached image |
| `authorId` | string | Reference to User `_id` |
| `likes` | string[] | User IDs who liked |
| `savedBy` | string[] | User IDs who bookmarked |
| `comments` | object[] | `{ userId, content, createdAt }` |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

A compound text index on `content` and `tags` powers full-text search.

---

## Testing

### Unit Tests (Jest)

```bash
npm test                # Run all API unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

Test suites cover:
- `auth.service` -- authentication logic
- `posts.service` -- post CRUD and interactions
- `users.service` -- profile management
- `string.utils` -- utility functions (100% coverage enforced)

### E2E Tests (Cypress)

```bash
npm run e2e:client        # Run all E2E tests (headless)
npm run e2e:client:smoke  # Run smoke tests only
npm run e2e:client:open   # Open Cypress UI for interactive testing
```

E2E test suites:
- **Smoke** -- redirect guards, login form, authentication flow
- **Navigation** -- route transitions and menu interactions
- **Profile** -- profile editing and backend sync
- **Semantic Search** -- search queries and result rendering

---

## Production Deployment (PM2)

In production, MongoDB is already running on the VM (port 21771 with authentication). The app runs natively via PM2.

### Prerequisites

- **Node.js** 18.12+
- **MongoDB** running on the VM (port 21771)
- **PM2** installed globally: `npm install -g pm2`
- **serve** installed globally: `npm install -g serve`

### 1. Clone and install

```bash
git clone https://github.com/barab2002/KnowNet.git
cd KnowNet
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.production
# Edit .env.production with your production values (MONGO_URI, GEMINI_API_KEY, etc.)
```

Make sure `MONGO_URI` points to your VM's MongoDB (`mongodb://admin:password@localhost:21771/knownet?authSource=admin`) and update `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` to match your server's domain/IP.

### 3. Build and start

```bash
npm run prod:build
npm run prod:start
```

This starts two PM2 processes:

| Process | Description | Port |
| --- | --- | --- |
| `knownet-api` | NestJS backend | 3000 |
| `knownet-client` | Static file server (React build) | 4200 |

### 4. Useful commands

```bash
npm run prod:status     # Check PM2 process status
npm run prod:logs       # View PM2 live logs
npm run prod:restart    # Restart PM2 processes
npm run prod:stop       # Stop all PM2 processes
```

### 5. Auto-start on reboot

```bash
pm2 startup            # Generate startup script (follow the printed instructions)
pm2 save               # Save current process list
```

### 6. (Optional) Nginx reverse proxy

If you want to serve the client on port 80 and proxy `/api` to the backend, install Nginx and use the included [nginx.conf](nginx.conf) as a reference. Update `proxy_pass` to point to `http://localhost:3000` instead of `http://api:3000`.

---

## Scripts

| Command | Description |
| --- | --- |
| **Dev** | |
| `npm run dev` | Start MongoDB (Docker) + API + client with hot-reload |
| `npm run dev:down` | Stop and remove MongoDB containers |
| `npm run dev:api` | Backend only with hot-reload (no Docker) |
| `npm run dev:client` | Frontend only via Vite dev server (no Docker) |
| **Prod (PM2)** | |
| `npm run prod:build` | Build API + client for production |
| `npm run prod:start` | Start all services with PM2 |
| `npm run prod:stop` | Stop all PM2 services |
| `npm run prod:restart` | Restart PM2 processes |
| `npm run prod:logs` | View PM2 live logs |
| `npm run prod:status` | Check PM2 process status |
| **Testing** | |
| `npm test` | Run API unit tests |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:coverage` | Unit test coverage report |
| `npm run e2e:client` | Run Cypress E2E tests |
| `npm run e2e:client:smoke` | Run smoke tests only |
| `npm run e2e:client:open` | Open Cypress interactive UI |

---

## Architecture

```
┌─────────────┐         ┌─────────────────┐         ┌──────────┐
│   React 19  │  Axios  │    NestJS 11    │Mongoose  │ MongoDB  │
│   + Vite    │────────>│   REST API      │────────> │          │
│  port 4200  │<────────│   port 3000     │<──────── │  :27017  │
└─────────────┘   JSON  └────────┬────────┘          └──────────┘
                                 │
                                 │ Google Generative AI SDK
                                 v
                          ┌──────────────┐
                          │ Gemini 2.5   │
                          │ Flash API    │
                          └──────────────┘
```

- **Frontend** uses React Context API for auth state and Axios with interceptors for automatic JWT attachment.
- **Backend** follows NestJS module architecture with dedicated modules for Auth, Posts, Users, and AI.
- **AI processing** runs asynchronously -- posts are created immediately and summaries/tags are added in the background.

---

## License

MIT
