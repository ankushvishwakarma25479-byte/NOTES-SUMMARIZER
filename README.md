# AI Notes Summarizer + Q&A (Premium Edition)

A full-stack, AI-powered web application that turns any document into concise summaries, key highlights, and an interactive Q&A workspace.

## 🚀 Features
- **Smart AI Summarization**: Uses OpenAI's `gpt-4o-mini` to instantly summarize lengthy documents (PDFs & TXTs).
- **Intelligent Q&A Chat**: Context-aware chatbot that answers questions based *strictly* on the document context, while maintaining chat history across sessions.
- **Explain Simply**: Explains complex text to readers like they are 5 years old.
- **Generate Questions**: Generates thought-provoking test questions from the document for studying.
- **Highlight Key Points**: Extracts the 3-5 most important points.
- **Premium SaaS UI**: Features beautiful loading skeletons, toast notifications, responsive design, dark mode, and micro-animations via Framer Motion.
- **Security**: Robust rate-limiting, JWT authentication, error handling, and `express-validator` security.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT, Multer, `pdf-parse`.
- **AI Integration**: OpenAI API (`gpt-4o-mini`).

## ⚙️ Setup & Installation

### 1. Backend
Navigate to the `backend` folder:
```bash
cd backend
npm install
```
Create a `.env` file based on `.env.example`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-notes
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```
Run the dev server:
```bash
npm run dev
```

### 2. Frontend
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
```
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```
Run the dev server:
```bash
npm run dev
```

## ☁️ Deployment
- The React setup allows caching and optimal builds with `npm run build`.
- Environment variables (`OPENAI_API_KEY`, etc.) should be injected securely by your hosting provider (Vercel/Render).
- The Express app includes CORS configuration that accepts traffic from any domain by default; ensure you restrict this for production.
