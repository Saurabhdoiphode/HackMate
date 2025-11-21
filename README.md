# HackMate AI

HackMate AI — AI-powered platform to find hackathon teammates automatically.

## Stack
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB Atlas (Free Tier)
- AI: Local models via Ollama / LM Studio (LLaMA/Mistral/Gemma family)

## Features (Initial Scaffold)
- User auth (register/login)
- Profile fetch/update
- Basic matchmaking search + auto-match (heuristic + AI placeholder)
- Team creation / join endpoints
- Real-time team room chat (Socket.IO)
- Project idea generation (LLM prompt)
- AI assistant chat placeholder

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (Free cluster)
- Ollama (https://ollama.ai) or LM Studio installed locally for AI models

### Setup Steps
1. Clone repository
2. Copy `server/.env.example` to `server/.env` and fill values
3. Install dependencies:
```
cd server
npm install
cd ../client
npm install
```
4. Run backend:
```
cd server
npm run dev
```
5. Run frontend:
```
cd client
npm run dev
```
6. Open browser at `http://localhost:5173`

### MongoDB Atlas
Create a free cluster, add a Database User, whitelist your IP (or 0.0.0.0/0 for dev), obtain the connection string and place it in `MONGO_URI`.

### Ollama Example
Install Ollama, then pull a model (e.g. `ollama pull llama2`).
Default API runs at `http://localhost:11434`.
Set `OLLSAMA_MODEL=llama2` in `.env`.

### LM Studio Alternative
Run a local server in LM Studio and set its URL as `OLLSAMA_API_URL`.

## Deployment (Render)

### Option A: Two Services (Recommended)
Use the provided `render.yaml` for infrastructure-as-code.

`render.yaml` defines:
- `hackmate-server` (Node web service)
- `hackmate-client` (Static site built by Vite)

Steps:
1. Push repo to GitHub.
2. In Render dashboard choose "New +" → "Blueprint" → point to repo.
3. Render reads `render.yaml` and creates both services.
4. Set required environment variables (see table below).
5. Deploy; initial build installs dependencies and starts services.

### Option B: Manual Creation
Create a Web Service for `server/` and a Static Site for `client/`:

Backend settings:
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Auto deploy: On

Frontend settings:
- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

### Environment Variables (Server)
| Key | Description |
|-----|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `DISABLE_LOCAL_AI` | Set to `true` on Render to skip Ollama calls |
| `AI_MODE` | `fallback` to force heuristic responses |
| `OLLAMA_API_URL` | (Optional) External reachable Ollama endpoint |
| `OLLAMA_MODEL` | (Optional) Model name (e.g. `llama2`) |

### Environment Variables (Client)
| Key | Description |
|-----|-------------|
| `VITE_API_BASE_URL` | Base URL of backend (e.g. `https://hackmate-server.onrender.com`) |

In production, fetch calls should use `import.meta.env.VITE_API_BASE_URL` instead of hardcoded `http://localhost:4000`. Update Axios base config accordingly before deployment.

### Production Axios Base Setup Example
Create `client/src/lib/api.js`:
```js
import axios from 'axios';
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
});
```
Replace direct `axios.post('http://localhost:4000/...` with `api.post('/ai/idea', {...})` etc.

### Building Locally for Verification
```bash
cd client
npm run build
npx serve dist   # or vite preview
```

### Health Check
Backend exposes `/health` returning `{ status: 'ok' }`. Configure Render health check if desired.

### AI Fallback Behavior
Because Ollama cannot run on Render Free tiers, `DISABLE_LOCAL_AI=true` makes AI endpoints respond with structured fallback content immediately, avoiding long timeouts.

### Common Issues
| Issue | Fix |
|-------|-----|
| 404 on API calls | Ensure `VITE_API_BASE_URL` matches deployed server URL |
| CORS errors | Add allowed origins or set `cors()` with proper config in `server/index.js` |
| Long AI timeouts | Set `DISABLE_LOCAL_AI=true` or provide external accessible model |
| Empty idea/chat response | Verify environment vars; check logs for Ollama connection errors |

### Post-Deployment Enhancements
- Add logging (`pino` or `winston`).
- Attach monitoring (Render Metrics + health alerts).
- Introduce rate limiting for auth & AI routes.

---
## Alternative Hosting
Frontend: Vercel / Netlify. Backend: Railway / Fly.io / AWS EC2. Steps similar; ensure env vars and open correct port.

## Roadmap (Next Enhancements)
- Role assignment engine
- Graph-based cluster recommendations
- Leaderboard & badges
- File sharing + Kanban tasks board
- Enhanced AI parsing (structured JSON reliability)

## License
MIT (free use). No paid APIs included.

---
Refer to inline code for current scaffold; extend models & routes as needed.
