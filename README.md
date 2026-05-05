# Definitely Not Wordle

A full-stack Wordle clone built with React, TypeScript, Express, and PostgreSQL. Guess the hidden 5-letter word in 6 tries. Letters are color-coded after each guess to indicate how close you are.

## Live Demo

🚧 Coming soon

## Tech Stack

**Frontend**

- React 19 + TypeScript
- Tailwind CSS v4
- Axios

**Backend**

- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- express-session with connect-pg-simple

## Features

- Anonymous session-based persistence via cookies — no login required
- Daily word derived from a fixed word list by days elapsed since launch
- Guess validation against a 2,000+ word dictionary
- Color-coded tile and keyboard feedback (green, yellow, gray)
- Win/loss detection with correct word reveal on loss
- Stats tracking — win percentage, current streak, max streak, guess distribution
- Physical keyboard support

## Project Structure

```
/DefinitelyNotWordle
  /frontend        # React + Vite app
  /backend         # Express API + Prisma
  package.json     # Root scripts for running both together
```

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL running locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/DefinitelyNotWordle.git
cd DefinitelyNotWordle
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

Create a `.env` file in `/backend`:

```
DATABASE_URL="postgresql://yourusername@localhost/notwordle"
SESSION_SECRET="your-secret-here"
```

Create a `.env` file in `/frontend`:

```
VITE_API_URL=http://localhost:3000
```

### 4. Set up the database

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 5. Run the app

From the project root:

```bash
npm run dev
```

This starts both the frontend at `http://localhost:5173` and the backend at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint      | Description                          |
| ------ | ------------- | ------------------------------------ |
| GET    | `/game/today` | Fetch or create today's game session |
| POST   | `/game/guess` | Submit a guess                       |
| GET    | `/game/stats` | Fetch user stats                     |

## License

MIT
