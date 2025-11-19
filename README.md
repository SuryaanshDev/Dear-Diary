## Dear Diary – MERN + Vercel

Dear Diary is a minimalistic diary application built with MongoDB, Express.js, React, and Node.js. The project is deployable to Vercel with a single click and uses Vercel Serverless Functions for all backend APIs.

### Features
- Secure auth (JWT + bcrypt) with protected routes and logout
- User-specific diary entries with full CRUD support
- Filter entries by date and view, edit, or delete individual posts
- Responsive React UI with light/dark themes (persisted in `localStorage`)
- Form validation, loading states, and helpful error messaging
- Ready-to-deploy configuration for Vercel (frontend + serverless backend)

### Project Structure
```
.
├── api/                    # Serverless functions (backend)
│   ├── auth/
│   │   ├── login.js
│   │   └── register.js
│   └── entries/
│       ├── index.js
│       ├── [id].js
│       └── date/[date].js
├── src/                    # React frontend
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── utils/
├── models/                 # Mongoose models
├── middleware/             # Auth middleware
├── utils/                  # Shared server-side helpers
├── public/                 # Static assets
├── index.html              # Vite entry
├── vercel.json             # Vercel config
├── .env.example            # Required environment variables
└── package.json
```

### Environment Variables
Copy `.env.example` to `.env` (for local dev) and to Vercel project settings:

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong secret for signing JWTs |
| `NODE_ENV` | `development` locally, `production` on Vercel |
| `FRONTEND_ORIGIN` | Origin allowed for CORS (e.g., `http://localhost:5173`) |
| `VITE_API_BASE_URL` | Defaults to `/api` for Vercel |

### MongoDB Atlas (Free Tier) Setup
1. Create a cluster at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user and password
3. Network Access → allow IP `0.0.0.0/0` so Vercel can reach the cluster
4. Copy the SRV connection string and paste it into `MONGODB_URI`

### Local Development
```bash
npm install
cp .env.example .env # fill in values
npx vercel dev       # runs Vercel emulation (frontend + serverless)
```

The Vercel CLI spins up both the Vite dev server and the serverless API routes so requests to `/api/*` work locally. If you prefer plain `npm run dev`, point `VITE_API_BASE_URL` to an already deployed backend (or run `vercel dev` in a separate terminal).

### Deploy to Vercel
1. Push this repository to GitHub/GitLab
2. Click “New Project” on Vercel and import the repo
3. Set the environment variables listed above
4. Deploy – build command `npm run build`, output `dist` (already specified in `vercel.json`)

You can also use the generic “Deploy with Vercel” button below after hosting the repository:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<YOUR_REPO_URL>)

### API Summary
| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/entries` | List entries for current user |
| `POST` | `/api/entries` | Create entry |
| `GET` | `/api/entries/:id` | Fetch entry |
| `PUT` | `/api/entries/:id` | Update entry |
| `DELETE` | `/api/entries/:id` | Delete entry |
| `GET` | `/api/entries/date/:date` | Filter by `dd/mm/yyyy` date |

All protected routes require an `Authorization: Bearer <token>` header (JWT from login/register).

### Tech Decisions
- **Serverless ready:** DB connections are cached per invocation to avoid re-connecting on every request.
- **Validation everywhere:** Shared Yup schemas keep payloads clean on both the backend and frontend.
- **Simple theming:** Light/dark theme stored in `localStorage` and synced through context.
- **Single package.json:** React + backend dependencies share the same install for Vercel simplicity.

### Future Enhancements
- Add rich-text editing for entries
- Calendar-based dashboard view
- Offline-first caching with service workers
- Automated testing (unit & integration)

