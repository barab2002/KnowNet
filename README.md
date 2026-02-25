<div align="center">

# KnowNet

**A student knowledge-sharing platform powered by AI semantic search**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![NX](https://img.shields.io/badge/NX-22-143055?logo=nx&logoColor=white)](https://nx.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Cypress](https://img.shields.io/badge/Cypress-15-69D3A7?logo=cypress&logoColor=white)](https://www.cypress.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Project Structure](#-project-structure) · [Testing](#-testing) · [Deployment](#-deployment)

</div>

---

## What is KnowNet?

KnowNet is a social knowledge platform built for academic communities. Students create rich-text posts (notes, study material, questions), and the platform automatically organises them using AI-generated topic tags, vector embeddings, and multi-signal semantic search — so finding the right content is fast and natural, even with vague queries.

Think of it as a campus social feed crossed with a searchable knowledge base, where everything is intelligently tagged and retrievable by meaning, not just keywords.

---

## Features

### Posts & Rich Text
- Create, edit, and delete posts using a full **Tiptap** rich-text editor (bold, italic, underline, colour, text alignment, lists, blockquotes)
- Attach multiple images per post (stored as base64 data URIs, previewed inline)
- Infinite-scroll feed powered by `IntersectionObserver` pagination (10 posts/page)

### AI-Powered Semantic Search
- Natural-language queries expanded into 10–15 related terms by **Gemini 2.0 Flash**
- Vector similarity scoring with **Gemini `text-embedding-004`** embeddings
- Multi-signal relevance fusion: semantic vector · textual match · tag synergy · freshness
- `#tag` autocomplete with keyboard navigation (↑ ↓ Tab Enter Esc)
- Match snippets with colour-coded highlights — **green** = exact word match, **yellow** = partial
- Score tooltip breaking down Semantic % / Textual % / Tag Synergy % per result

### AI Tagging & Summaries
- Auto-generates 5–12 topic tags on every post create/edit
- Three swappable model backends:
  - **Llama 3.3 70B** via Groq *(default)*
  - **Llama 3.1 8B** via Groq *(fastest)*
  - **Gemini 2.0 Flash** via Google AI
- User `#hashtags` extracted as `userTags`; AI-generated stored as `aiTags`; merged into a unified `tags` array (user-first, deduped)
- On-demand one-sentence post summaries with the same model choices

### Comments, Likes & Saves
- Threaded comments with author name and avatar
- Like / unlike any post; total likes aggregated on the user profile
- Save / unsave posts as bookmarks; dedicated **Saved** tab on profile

### User Profiles
- Avatar upload (5 MB max, JPEG / PNG / GIF / WebP)
- Bio, academic major, graduation year
- Stats: posts count · total likes received · AI summaries generated
- **My Posts**, **Liked**, and **Saved** tabs
- Editable via an inline modal form

### Authentication
- Email/password register and login
- Google OAuth via Firebase `signInWithPopup`
- JWT access tokens (15 min) + rotating refresh tokens (30 days, HttpOnly cookie)
- Refresh token **reuse detection** — invalidates the entire token family on replay attack
- "Remember Me" toggle persists state to `localStorage` vs. `sessionStorage`

### Settings
- Light / Dark / System theme picker (persisted client-side via `ThemeProvider`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, React Router v7, Vite, Tailwind CSS v3, Tiptap, Axios, DOMPurify |
| **Backend** | NestJS 11, TypeScript, Passport.js (JWT strategy), Multer, cookie-parser, Swagger/OpenAPI |
| **Database** | MongoDB via Mongoose ODM |
| **AI / ML** | Google Gemini 2.0 Flash (tagging, query expansion), Gemini `text-embedding-004` (vector search), Groq API (Llama 3.3 70B, Llama 3.1 8B) |
| **Auth** | Firebase Auth (client login/OAuth), Firebase Admin SDK (server token verification), JWT (`@nestjs/jwt`, `passport-jwt`), bcrypt |
| **Monorepo** | NX 22 (`@nx/react`, `@nx/nest`, `@nx/vite`, `@nx/cypress`, `@nx/webpack`) |
| **Testing** | Jest (unit), Cypress 15 (E2E), Vitest (frontend unit) |
| **Containers** | Docker multi-stage builds (Node 22 Alpine), Docker Compose |
| **Reverse Proxy** | Nginx (TLS termination, `/api` → NestJS, `/` → React SPA) |
| **CI/CD** | GitHub Actions → GHCR image publish on push to `main` |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  Browser                                                             │
│                                                                      │
│  ┌─────────────────────────────┐   ┌────────────────────────────┐   │
│  │  React 19 (Vite, port 4200) │   │ Firebase Auth SDK          │   │
│  │                             │   │ (email/pass + Google OAuth) │   │
│  │  AuthContext → Axios        │   └──────────┬─────────────────┘   │
│  │  interceptors (JWT)         │              │ ID token             │
│  └──────────┬──────────────────┘              │                      │
└─────────────┼──────────────────────────────── ┼────────────────────-─┘
              │  REST / JSON                     │
              ▼                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  NestJS 11  (port 3000, global prefix /api)                         │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐ │
│  │  Auth    │  │  Posts   │  │  Users   │  │  AI Service         │ │
│  │  Module  │  │  Module  │  │  Module  │  │  (Gemini + Groq)    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────────┘ │
│        │              │                              │               │
└────────┼──────────────┼──────────────────────────── ┼───────────────┘
         │              │                              │
         ▼              ▼                              ▼
  Firebase Admin    MongoDB                   Gemini API / Groq API
  SDK (token        (Mongoose)                (tags, embeddings,
  verification)                                query expansion)
```

### Key design decisions

| Decision | Rationale |
|---|---|
| JWT access + HttpOnly refresh cookie | XSS-resistant session management with silent renewal |
| Refresh token rotation + reuse detection | Prevents stolen-token replay without user re-login |
| Post embeddings stored in MongoDB | No separate vector DB required; cosine similarity runs in-process |
| NX monorepo | Shared TypeScript paths, unified test/build pipeline, no cross-repo friction |
| Multi-stage Docker builds | Minimal production images; build tools never reach the runtime container |

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 22+ |
| Docker Desktop | Latest |

### 1 — Clone the repo

```bash
git clone https://github.com/barab2002/KnowNet.git
cd KnowNet
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Configure environment variables

```bash
cp .env.example .env.development
# then fill in your keys — see the Environment Variables section below
```

### 4 — Start the full dev stack

```bash
npm run dev
```

This single command starts MongoDB and Mongo Express via Docker Compose, then concurrently starts the NestJS API (with hot-reload) and the Vite dev server.

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API | http://localhost:3000/api |
| Swagger docs | http://localhost:3000/api/docs |
| Mongo Express | http://localhost:8081 |

---

## Environment Variables

Copy `.env.example` to `.env.development` for local dev, or to `.env.production` for Docker deployment.

> **Security note:** Never commit `.env.*` files. The `.env.example` file documents the shape only.

### Backend (read by NestJS at runtime)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string, e.g. `mongodb://localhost:27017/knownet` |
| `PORT` | No | API listen port (default `3000`) |
| `FRONTEND_URL` | Yes | Allowed CORS origin, e.g. `http://localhost:4200` |
| `JWT_ACCESS_SECRET` | Yes | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Yes | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | No | Access token lifetime (default `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh token lifetime (default `30d`) |
| `GEMINI_API_KEY` | Yes | Google AI key — used for embeddings, query expansion, Gemini tagging |
| `GROQ_API_KEY` | Yes | Groq key — used for Llama tagging and summaries |
| `FIREBASE_PROJECT_ID` | Yes | From Firebase Console → Project Settings → Service Accounts |
| `FIREBASE_CLIENT_EMAIL` | Yes | From Firebase service account JSON |
| `FIREBASE_PRIVATE_KEY` | Yes | From Firebase service account JSON (keep `\n` newlines in the string) |

### Frontend (baked into the Vite bundle at **build time**)

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase web app API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

> `VITE_*` variables must be present at build time. For local dev, Vite reads them from `.env.development`. In the Docker production build, they are injected as `ARG` / `ENV` and baked into the static bundle — no server-side exposure.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Full dev stack: Docker (MongoDB) + API hot-reload + Vite client |
| `npm run dev:api` | NestJS only (nodemon hot-reload) |
| `npm run dev:client` | Vite dev server only |
| `npm run dev:kill` | Stop Docker + kill ports 3000 and 4200 |
| `npm run start` | `docker compose up -d` (MongoDB + Mongo Express only) |
| `npm run stop` | `docker compose down` |
| `npm test` | Jest unit tests for the API |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Jest with HTML coverage report (opens automatically via jest-stare) |
| `npm run e2e:client` | Cypress E2E suite (headless Electron, CI mode) |
| `npm run e2e:client:open` | Cypress interactive GUI |
| `npm run e2e:client:smoke` | Smoke test only (`app.cy.ts`) |
| `npm run prod:start` | Build + launch production Docker stack |
| `npm run prod:stop` | Stop production containers |
| `npm run prod:restart` | Restart production containers |
| `npm run prod:logs` | Tail production container logs |

---

## API Reference

Base URL: `/api` · Interactive docs: `http://localhost:3000/api/docs`

### Health

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Welcome message |
| `GET` | `/health` | DB connection status, uptime, timestamp |

### Authentication

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/firebase` | Firebase ID token | Exchange Firebase ID token for JWT session |
| `POST` | `/auth/register` | — | Email/password registration (bcrypt) |
| `POST` | `/auth/login` | — | Email/password login |
| `POST` | `/auth/refresh` | Refresh cookie | Rotate refresh token |
| `POST` | `/auth/logout` | Refresh cookie | Revoke token + clear cookie |
| `GET` | `/auth/profile` | JWT | Get current user |

### Posts

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/posts` | — | Paginated feed (`?limit=10&skip=0`) |
| `POST` | `/posts` | JWT | Create post + optional images |
| `PATCH` | `/posts/:id` | JWT (author) | Update post content / images |
| `DELETE` | `/posts/:id` | JWT (author) | Delete post |
| `GET` | `/posts/search?q=` | — | AI semantic search |
| `GET` | `/posts/tags` | — | All unique tags |
| `GET` | `/posts/user/:userId` | — | Posts by a user |
| `GET` | `/posts/liked/:userId` | — | Posts liked by a user |
| `GET` | `/posts/saved/:userId` | — | Posts saved by a user |
| `GET` | `/posts/user/:userId/total-likes` | — | Aggregate like count |
| `POST` | `/posts/:id/like` | — | Toggle like |
| `POST` | `/posts/:id/save` | — | Toggle bookmark |
| `POST` | `/posts/:id/comment` | — | Add comment |
| `GET` | `/posts/:id/comments` | — | Get all comments |
| `DELETE` | `/posts/:id/comments/:commentId` | JWT | Delete comment |
| `POST` | `/posts/:id/summarize` | — | Generate AI summary (pass `model` in body) |

### Users

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/users` | — | Find or create user (used post-OAuth) |
| `GET` | `/users/:userId` | — | Get user profile |
| `PUT` | `/users/:userId` | — | Update name, bio, major, graduation year |
| `POST` | `/users/:userId/profile-image` | — | Upload avatar (5 MB max, image/\* only) |

---

## Project Structure

```
KnowNet/                              NX monorepo root
│
├── api/                              NestJS backend (port 3000)
│   └── src/
│       ├── main.ts                   Bootstrap: global /api prefix, CORS, Swagger, cookies
│       ├── app/                      Root module + health check controller
│       ├── auth/                     JWT strategy, Firebase token exchange, Google OAuth,
│       │                             refresh token rotation + reuse detection
│       ├── posts/                    CRUD, pagination, like/save/comment, AI search
│       │   ├── posts.controller.ts
│       │   ├── posts.service.ts      Search pipeline + multi-signal scoring fusion
│       │   └── schemas/post.schema.ts
│       ├── users/                    Profile management, avatar upload
│       └── ai/
│           └── ai.service.ts         Tag generation, summaries, embeddings, query expansion
│
├── client/                           React 19 frontend (Vite, port 4200)
│   └── src/
│       ├── app/app.tsx               Router tree + AuthProvider
│       ├── features/
│       │   ├── feed/                 Infinite-scroll post feed
│       │   ├── semantic-search/      Search UI, tag autocomplete, score tooltips
│       │   ├── user-profile/         Profile page (tabs: posts / liked / saved)
│       │   ├── settings/             Theme picker
│       │   └── auth/                 Login, Register, ForgotPassword pages
│       ├── components/               PostCard, CreatePostForm, RichTextEditor,
│       │                             EditPostModal, EditProfileModal, Layout, etc.
│       ├── contexts/AuthContext.tsx  Global auth state + Axios request/response interceptors
│       ├── api/                      Typed API client functions (auth.ts, posts.ts, users.ts)
│       ├── lib/firebase.ts           Firebase client SDK + GoogleAuthProvider init
│       └── theme/ThemeProvider.tsx   Light / Dark / System theme management
│
├── client-e2e/                       Cypress E2E test suite
│   └── src/e2e/
│       ├── app.cy.ts                 Smoke: redirect, login form, feed
│       ├── auth.cy.ts                Register form client-side validation
│       ├── posts.cy.ts               Feed render, like, save, delete, create
│       ├── comments.cy.ts            Open, add, and render comments
│       ├── navigation.cy.ts          Navbar + sidebar routing
│       └── semantic-search.cy.ts     No-results state + results with cards
│
├── Dockerfile                        API multi-stage build (Node 22 Alpine)
├── Dockerfile.client                 Client multi-stage build (Node 22 → Nginx Alpine)
├── docker-compose.yml                Dev: MongoDB + Mongo Express
├── docker-compose.prod.yml           Prod: Nginx + API + Client
├── nginx.conf                        Production TLS reverse proxy config
├── nginx.client.conf                 SPA fallback for the client Nginx container
├── .env.example                      Environment variable template
├── nx.json                           NX workspace config (plugins, generators)
└── package.json                      Monorepo root package (all deps live here)
```

---

## Database Schema

### User document

| Field | Type | Notes |
|---|---|---|
| `_id` | `string` | Firebase UID or generated ID |
| `email` | `string` | Unique |
| `passwordHash` | `string?` | For local email/password auth |
| `name` | `string` | Display name |
| `bio` | `string?` | Profile bio |
| `major` | `string?` | Academic major |
| `graduationYear` | `string?` | Expected graduation year |
| `profileImageUrl` | `string?` | Path under `/uploads/profile-images/` |
| `joinedDate` | `Date` | Account creation timestamp |
| `postsCount` | `number` | Aggregate counter |
| `likesReceived` | `number` | Aggregate counter |
| `aiSummariesCount` | `number` | Aggregate counter |
| `refreshTokens` | `object[]` | Each entry: `{ token, createdAt, expiresAt, revoked, replacedByToken }` |

### Post document

| Field | Type | Notes |
|---|---|---|
| `content` | `string` | HTML from Tiptap rich-text editor |
| `userTags` | `string[]` | `#hashtags` extracted from content |
| `aiTags` | `string[]` | AI-generated topic tags |
| `tags` | `string[]` | Merged (userTags first, deduped) |
| `summary` | `string?` | AI one-sentence summary |
| `imageUrls` | `string[]` | Base64 data URI images |
| `authorId` | `ref User` | Post author |
| `likes` | `string[]` | User IDs who liked |
| `savedBy` | `string[]` | User IDs who saved |
| `comments` | `object[]` | `{ userId, content, createdAt, userName? }` |
| `embedding` | `number[]` | Vector from Gemini `text-embedding-004` — excluded from default queries (`select: false`) |
| `createdAt` | `Date` | Auto timestamp |
| `updatedAt` | `Date` | Auto timestamp |

**Indexes:** text index on `content` + `tags` for full-text search.

---

## How Semantic Search Works

All search logic executes server-side in a single `GET /api/posts/search?q=` call:

```
User query
    │
    ├──► Gemini text-embedding-004     ──────────────────────────────────────┐
    │    (generate query embedding)                                           │
    │                                                                         │
    └──► Gemini 2.0 Flash expandSearchQuery                                  │
         (produce 10–15 related terms)                                        │
                  │                                                            │
                  ▼                                                            │
       MongoDB candidate retrieval                                             │
       ($or: exact phrase · keywords · expanded tags · recency fallback)       │
                  │                                                            │
                  ▼                                                            ▼
       Per-candidate scoring fusion                                 cosine similarity
       ┌──────────────────────────────────────────────────────────────────┐
       │  vScore    × 0.20  →  vector cosine similarity                   │
       │  mScore    × 0.10  →  text match (phrase / partial word)         │
       │  tagQuality × 0.30 →  exact or contains tag match                │
       │  peak      × 0.40  →  max(mScore, tagQuality)                    │
       │  freshnessBonus    →  up to +4% for posts < 180 days old         │
       └──────────────────────────────────────────────────────────────────┘
                  │
                  ▼
       Sort: exact tag matches → contains tag → exact text → score desc
       Top 50 results with matchSnippet · _score · _debug (vScore, mScore, tScore)
```

Post embeddings are generated **asynchronously** (non-blocking) after creation and stored in the `embedding` field. They are never returned in regular feed queries (`select: false`).

---

## How Authentication Works

```
Client                                          Server
  │                                               │
  ├─ Firebase signIn (email/pass or Google) ─►   │
  ◄─ Firebase ID token ─────────────────────── Firebase Auth
  │                                               │
  ├─ POST /auth/firebase { idToken } ───────────► │
  │                                               ├─ Firebase Admin verifyIdToken()
  │                                               ├─ findOrCreate user in MongoDB
  │                                               ├─ sign JWT access token  (15m)
  │                                               └─ sign JWT refresh token (30d) → store in DB
  ◄─ { accessToken } ────────────────────────────┤
  ◄─ Set-Cookie: refreshToken (HttpOnly) ─────── │
  │                                               │
  ├─ Any request (Authorization: Bearer token) ─► JWT strategy validates
  │                                               │
  │   (access token expires)                      │
  ├─ POST /auth/refresh ────────────────────────► reads HttpOnly cookie
  │                                               ├─ verify + check not revoked
  │                                               ├─ reuse detected? → revoke ALL user tokens
  ◄─ { newAccessToken } ─────────────────────────┤
  ◄─ Set-Cookie: new refreshToken ────────────── │
```

---

## Testing

### Unit tests (Jest + jest-stare)

```bash
npm test                   # run all API unit tests
npm run test:coverage      # run with HTML report (auto-opens in browser)
```

Coverage thresholds enforced in `api/jest.config.ts`:
- `src/common/` — **100%** branches · functions · lines · statements

### End-to-end tests (Cypress 15)

```bash
npm run e2e:client         # headless run (CI mode, Electron)
npm run e2e:client:open    # interactive Cypress Studio
npm run e2e:client:smoke   # smoke only (app.cy.ts)
```

All E2E tests use `cy.intercept()` stubs — **no real backend or Firebase calls** are made.

| Spec | Tests | What it covers |
|---|---|---|
| `app.cy.ts` | 3 | Auth redirect, login form render, feed load |
| `auth.cy.ts` | 5 | Register form validation (name, email, password, confirm) |
| `posts.cy.ts` | 6 | Feed render, like, save, delete, create post |
| `comments.cy.ts` | 3 | Open section, add comment, render existing |
| `navigation.cy.ts` | 2 | Navbar profile link, sidebar routing |
| `semantic-search.cy.ts` | 2 | No-results state, results with result cards |
| **Total** | **21** | |

---

## Deployment

### Production Docker stack

```bash
npm run prod:start
# equivalent to:
# docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

Three containers are started:

| Container | Exposed port | Role |
|---|---|---|
| `nginx` | **443** (public HTTPS) | TLS termination, routes `/api` → api, `/` → client |
| `api` | 3000 (internal) | NestJS application server |
| `client` | 5000 (internal) | Nginx serving the React SPA |

TLS certificates are bind-mounted from `./cert/` into the Nginx container.

### CI/CD — GitHub Actions

On every push to `main`, GitHub Actions builds and pushes both images to GHCR:

```
ghcr.io/barab2002/knownet-api:latest
ghcr.io/barab2002/knownet-api:<git-sha>

ghcr.io/barab2002/knownet-client:latest
ghcr.io/barab2002/knownet-client:<git-sha>
```

Firebase `VITE_*` variables are injected from GitHub Secrets at build time and baked into the static client bundle.

### Manual publish to GHCR

```bash
GHCR_TOKEN=<your-pat> bash scripts/publish.sh
# with a version tag:
GHCR_TOKEN=<your-pat> bash scripts/publish.sh --tag v1.2.0
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes following conventional commits
4. Ensure all E2E tests pass: `npm run e2e:client`
5. Open a pull request against `main`

---

## License

[MIT](LICENSE)
