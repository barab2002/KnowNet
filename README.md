<p align="center">
  <h1 align="center">KnowNet</h1>
  <p align="center">
    Academic knowledge-sharing platform for posts, AI summaries, semantic search, and social interactions.
  </p>
  <p align="center">
    <a href="#architecture">Architecture</a> &middot;
    <a href="#services-and-ports">Services & Ports</a> &middot;
    <a href="#backend-api">Backend API</a> &middot;
    <a href="#frontend-ui">Frontend UI</a> &middot;
    <a href="#database-schema">Database Schema</a> &middot;
    <a href="#deployment">Deployment</a>
  </p>
</p>

---

## Features

- **Knowledge Posts**: create rich posts with optional images, hashtags, and comments.
- **AI Summaries & Tags**: automatic summaries and AI tag generation (Groq/Gemini) with keyword fallback.
- **Semantic Search**: full‑text search by tags/content with relevance scoring.
- **Social Interactions**: like, bookmark, comment, and profile stats.
- **Profiles**: bio, academic major, graduation year, and profile image upload.
- **Auth**: Firebase Authentication on the client, exchanged for API JWT access tokens + refresh cookies.
- **Dark Mode**: theme toggle via Tailwind configuration.
- **Swagger**: API docs at `/api/docs`.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router DOM |
| **Backend** | NestJS 11, Passport (JWT), Firebase Admin SDK |
| **Database** | MongoDB + Mongoose |
| **AI** | Groq + Google Generative AI (Gemini) |
| **Testing** | Jest, Cypress, Vitest |
| **Monorepo** | Nx 22 |
| **Deployment** | Docker, Docker Compose, Nginx, PM2 |

---

## Project Structure

```
KnowNet/
├── api/                        # NestJS backend (port 3000)
│   └── src/
│       ├── auth/               # JWT + Firebase token exchange
│       ├── posts/              # Posts CRUD, likes, comments, search
│       ├── users/              # Profiles & activity stats
│       ├── ai/                 # Groq/Gemini summarization + tagging
│       └── main.ts             # App bootstrap + Swagger
├── client/                     # React frontend (port 4200 in dev)
│   └── src/
│       ├── features/           # Pages (auth, feed, search, profile, settings)
│       ├── components/         # Reusable UI (PostCard, Modals, Editor)
│       ├── api/                # Axios HTTP clients
│       └── contexts/           # Auth state
├── docker-compose.yml          # Dev: MongoDB + Mongo Express
├── docker-compose.prod.yml     # Prod: Nginx + API + Client
├── Dockerfile                  # API image
├── Dockerfile.client           # Client image (Nginx)
└── nginx.conf                  # Reverse proxy for /, /api, /uploads
```

---

## Architecture

```
┌─────────────┐         ┌─────────────────┐         ┌──────────┐
│   React 19  │  Axios  │    NestJS 11    │Mongoose  │ MongoDB  │
│   + Vite    │────────>│   REST API      │────────> │          │
│  port 4200  │<────────│   port 3000     │<──────── │  :27017  │
└─────────────┘   JSON  └────────┬────────┘          └──────────┘
                                 │
                                 │ Groq/Gemini SDKs
                                 v
                          ┌────────────────┐
                          │   AI Providers │
                          └────────────────┘
```

- **Frontend** stores auth state in React Context and auto‑attaches JWTs via Axios.
- **Backend** is modular (Auth, Posts, Users, AI) with `/api` global prefix.
- **AI** operations generate summaries/tags and embeddings; failures fall back to keywords.

---

## Services and Ports

### Development

| Service | Port | Notes |
| --- | --- | --- |
| Client (Vite) | 4200 | React dev server |
| API (NestJS) | 3000 | `/api` base path |
| MongoDB (Docker) | 27017 | `docker-compose.yml` |
| Mongo Express | 8081 | Admin UI |

### Production (Docker + Nginx)

| Service | Port | Notes |
| --- | --- | --- |
| Nginx | 443 | TLS termination + reverse proxy |
| Client (Nginx) | 5000 | Internal only |
| API (NestJS) | 3000 | Internal only |

**Nginx routing** (see nginx.conf):

- `/` → client container (port 5000)
- `/api` → API container (port 3000)
- `/uploads` → API container (port 3000)

---

## Backend API

Base URL: `/api`

### Auth model

- Client signs in via **Firebase Auth** (email/password or Google).
- Client sends Firebase **ID token** to `POST /api/auth/firebase`.
- API verifies the token using **Firebase Admin SDK**, then issues:
  - **Access token (JWT)** in response body.
  - **Refresh token** in an **HTTP‑only cookie**.

### Routes

#### Health

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/` | Welcome message | — |
| GET | `/api/health` | DB + service health | — |

#### Auth

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/firebase` | Exchange Firebase ID token for JWT | Firebase ID token |
| POST | `/api/auth/register` | Register local user (bcrypt) | — |
| POST | `/api/auth/login` | Login local user (bcrypt) | — |
| POST | `/api/auth/refresh` | Rotate refresh token (cookie) | Refresh cookie |
| POST | `/api/auth/logout` | Revoke refresh token (cookie) | Refresh cookie |
| GET | `/api/auth/profile` | Get current user profile | JWT |

#### Posts

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/posts` | Create post (+ optional images) | JWT |
| GET | `/api/posts` | List posts (pagination) | — |
| PATCH | `/api/posts/:id` | Update content/images (author) | JWT |
| DELETE | `/api/posts/:id` | Delete post (author) | JWT |
| POST | `/api/posts/:id/like` | Toggle like | — |
| POST | `/api/posts/:id/save` | Toggle bookmark | — |
| POST | `/api/posts/:id/comment` | Add comment | — |
| GET | `/api/posts/:id/comments` | List comments | — |
| DELETE | `/api/posts/:id/comments/:commentId` | Delete comment | JWT |
| POST | `/api/posts/:id/comments/:commentId/delete` | Delete comment (alias) | JWT |
| POST | `/api/posts/:id/summarize` | Generate AI summary | — |
| GET | `/api/posts/search` | Full‑text search | — |
| GET | `/api/posts/tags` | Unique tags | — |
| GET | `/api/posts/user/:userId` | User posts | — |
| GET | `/api/posts/user/:userId/total-likes` | Total likes count | — |
| GET | `/api/posts/liked/:userId` | Posts liked by user | — |
| GET | `/api/posts/saved/:userId` | Posts saved by user | — |

#### Users

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api/users/:userId` | Get profile | — |
| POST | `/api/users` | Create/sync user | — |
| PUT | `/api/users/:userId` | Update profile | — |
| POST | `/api/users/:userId/profile-image` | Upload avatar (max 5 MB) | — |

### Firebase usage

- **Frontend** uses Firebase Web SDK (`VITE_FIREBASE_*` env vars) for sign‑in.
- **Backend** uses Firebase Admin SDK (`FIREBASE_*` env vars) to verify the ID token.

### Tokens & security notes

- **Access token** is a JWT in the `Authorization: Bearer <token>` header.
- **Refresh token** is stored in an **HTTP‑only cookie** (`refreshToken`).
- Refresh rotation is enforced; reuse or revoked tokens invalidate all user refresh tokens.

---

## Frontend UI

Main routes (see client/src/app/app.tsx):

- **/login**: Firebase email/password login + Google sign‑in.
- **/register**: Firebase email/password sign‑up.
- **/forgot-password**: password recovery flow.
- **/**: feed with infinite scroll, post creation, like/save/comment.
- **/post-details**: single post view with comments and summary.
- **/semantic-search**: search by text and tags with relevance highlights.
- **/user-profile**: profile view/edit, activity stats, avatar upload.
- **/settings**: account settings and preferences.

Key UI capabilities:

- **Create/Edit Post** with rich text editor and multi‑image upload.
- **AI Summary** button for on‑demand summaries.
- **Tag UX**: hashtag extraction + AI tags with chips/badges.
- **Bookmarks** and **likes** synced per user.
- **Profile image upload** with validation and immediate preview.
- **Dark mode** and responsive layout.

---

## Database Schema

### User (api/src/users/schemas/user.schema.ts)

| Field | Type | Notes |
| --- | --- | --- |
| `_id` | string | Firebase UID or generated ID |
| `email` | string | Unique |
| `passwordHash` | string? | For local auth endpoints |
| `googleId` | string? | Optional legacy field |
| `name` | string | Display name |
| `bio` | string? | Profile bio |
| `major` | string? | Academic major |
| `graduationYear` | string? | Expected graduation year |
| `profileImageUrl` | string? | Stored under `/uploads/profile-images` |
| `joinedDate` | Date | Account creation |
| `postsCount` | number | Aggregate counter |
| `likesReceived` | number | Aggregate counter |
| `aiSummariesCount` | number | Aggregate counter |
| `refreshTokens` | object[] | Rotation + revoke metadata |

`refreshTokens` entry:

- `token`, `createdAt`, `expiresAt`, `revoked`, `replacedByToken`

### Post (api/src/posts/schemas/post.schema.ts)

| Field | Type | Notes |
| --- | --- | --- |
| `content` | string | Rich text or plain text |
| `tags` | string[] | Merged user + AI tags |
| `userTags` | string[] | Extracted hashtags |
| `aiTags` | string[] | AI‑generated tags |
| `summary` | string? | AI summary |
| `imageUrls` | string[] | Base64 data URLs |
| `imageUrl` | string? | First image shortcut |
| `authorId` | string? | User reference |
| `likes` | string[] | User IDs |
| `savedBy` | string[] | User IDs |
| `comments` | object[] | `{ userId, content, createdAt, userName? }` |
| `embedding` | number[] | Vector (not selected by default) |
| `createdAt` | Date | Auto timestamp |
| `updatedAt` | Date | Auto timestamp |

Indexes:

- Text index on `content` + `tags` for search.

---

## Storage

- **Post images** are stored as **base64 data URLs** inside the Post document.
- **Profile images** are stored on disk under `uploads/profile-images` and served via `/uploads`.

---

## Environment Variables

Create `.env.development` (local) and `.env.production` (server). Do **not** commit secrets.

### Backend

- `MONGO_URI` – MongoDB connection string
- `FRONTEND_URL` – allowed CORS origin
- `PORT` – API port (default 3000)
- `JWT_SECRET` (or `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`)
- `JWT_ACCESS_EXPIRES_IN` (default `15m`)
- `JWT_REFRESH_EXPIRES_IN` (default `30d`)
- `GEMINI_API_KEY` – Gemini access
- `GROQ_API_KEY` – Groq access
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

### Frontend

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

---

## Local Development

```bash
npm install
npm run dev
```

Services:

- Client: http://localhost:4200
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Mongo Express: http://localhost:8081

---

## Deployment

### Option A: Docker + Nginx (docker-compose.prod.yml)

1. Ensure TLS certs exist under `cert/` (mapped into nginx).
2. Create `.env.production` for the API container.
3. Export frontend Firebase env vars so they’re baked into the client build.
4. Build and run:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**Routing:** Nginx terminates TLS on 443 and proxies `/api` + `/uploads` to the API container.

### Option B: PM2 (native on VM)

```bash
npm run prod:build
npm run prod:start
```

PM2 processes:

- `knownet-api` (port 3000)
- `knownet-client` (port 4200)

---

## How to Deploy a New Version

### Docker + Nginx

1. Pull latest code:

```bash
git pull origin main
```

2. Update `.env.production` and frontend Firebase env vars if needed.
3. Rebuild and restart:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

4. (Optional) prune old images:

```bash
docker image prune -f
```

### PM2

1. Pull latest code and install deps:

```bash
git pull origin main
npm ci
```

2. Rebuild and restart:

```bash
npm run prod:build
npm run prod:restart
```

---

## Testing

```bash
npm test
npm run e2e:client
```

---

## License

MIT
