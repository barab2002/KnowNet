# KnowNet

An academic knowledge-sharing platform where students and scholars create posts, interact through likes and comments, and leverage AI-powered summarization.

Built with **React 19**, **NestJS**, **MongoDB**, and **Google Gemini AI**.

---

## Features

- **Knowledge Posts** -- Create and share posts with text and images. Supports hashtag extraction and full-text search.
- **AI Summarization** -- One-click post summaries powered by Google Gemini 2.5 Flash.
- **Smart Tagging** -- User-defined `#hashtags` are extracted automatically. When none are provided, AI generates fallback tags.
- **Social Interactions** -- Like, save, and comment on posts.
- **User Profiles** -- Profile pages with bio, major, graduation year, profile image upload, and activity stats (posts, likes received, AI summaries generated).
- **Authentication** -- Email/password registration and Google OAuth 2.0 with JWT-based sessions.
- **Dark Mode** -- Full dark theme support.
- **Swagger API Docs** -- Auto-generated API documentation at `/api/docs`.

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19, Vite, Tailwind CSS, React Router DOM  |
| Backend    | NestJS 11, Passport (JWT + Google OAuth), Multer |
| Database   | MongoDB (Mongoose ODM)                          |
| AI         | Google Generative AI (Gemini 2.5 Flash)         |
| Monorepo   | Nx                                              |
| Deployment | Docker, Docker Compose, Nginx                   |

---

## Project Structure

```
KnowNet/
├── api/                    # NestJS backend
│   └── src/
│       ├── auth/           # Google OAuth & JWT authentication
│       ├── posts/          # Posts CRUD, likes, comments, search
│       ├── users/          # User profiles & stats
│       ├── ai/             # Gemini AI integration
│       └── main.ts         # Entry point & Swagger setup
├── client/                 # React frontend
│   └── src/
│       ├── features/       # Page components (feed, profile, search, etc.)
│       ├── components/     # Reusable UI components
│       ├── api/            # Axios API clients
│       ├── contexts/       # Auth context (React Context API)
│       └── theme/          # Dark mode provider
├── docker-compose.yml      # MongoDB + API + Client containers
├── Dockerfile              # API container
├── Dockerfile.client       # Client container (Nginx)
└── nginx.conf              # Production Nginx config
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.12+
- **MongoDB** (local install or Docker)
- **Gemini API key** (for AI features) -- [Get one here](https://aistudio.google.com/apikey)
- **Google OAuth credentials** (optional, for Google login)

### 1. Clone and install

```bash
git clone https://github.com/barab2002/KnowNet.git
cd KnowNet
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=mongodb://localhost:27017/knownet
PORT=3000
FRONTEND_URL=http://localhost:4200
```

### 3. Run with Docker (recommended)

```bash
docker-compose up --build
```

This starts MongoDB, the API server, and the client. Access the app at **http://localhost**.

### 4. Or run locally

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 -- API (with hot-reload)
npm run dev:api

# Terminal 2 -- Client (Vite dev server)
npm start
```

- Frontend: **http://localhost:4200**
- API: **http://localhost:3000/api**
- Swagger docs: **http://localhost:3000/api/docs**

Or run both at once:

```bash
npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/api/auth/google`          | Start Google OAuth flow  |
| GET    | `/api/auth/google/redirect` | Google OAuth callback    |
| GET    | `/api/auth/profile`         | Get current user profile |

### Posts
| Method | Endpoint                             | Description              |
| ------ | ------------------------------------ | ------------------------ |
| POST   | `/api/posts`                         | Create a post            |
| GET    | `/api/posts`                         | Get all posts            |
| DELETE | `/api/posts/:id`                     | Delete a post            |
| POST   | `/api/posts/:id/like`                | Toggle like              |
| POST   | `/api/posts/:id/save`                | Toggle save              |
| POST   | `/api/posts/:id/comment`             | Add a comment            |
| POST   | `/api/posts/:id/summarize`           | Generate AI summary      |
| GET    | `/api/posts/search?q=query`          | Search posts             |
| GET    | `/api/posts/user/:userId`            | Get user's posts         |
| GET    | `/api/posts/user/:userId/total-likes`| Get total likes received |

### Users
| Method | Endpoint                            | Description            |
| ------ | ----------------------------------- | ---------------------- |
| GET    | `/api/users/:userId`                | Get user profile       |
| POST   | `/api/users`                        | Create/sync user       |
| PUT    | `/api/users/:userId`                | Update profile         |
| POST   | `/api/users/:userId/profile-image`  | Upload profile image   |

---

## Scripts

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `npm start`       | Start frontend dev server (port 4200)   |
| `npm run start:api` | Start backend dev server (port 3000)  |
| `npm run dev:api` | Backend with webpack watch + nodemon    |
| `npm run dev`     | Start frontend and backend together     |
| `npm run build`   | Production build                        |

---

## License

MIT
