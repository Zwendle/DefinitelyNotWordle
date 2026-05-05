import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import gameRouter from "./routes/games.routes.js";

const app = express();
app.set("trust proxy", 1);
const PgStore = connectPgSimple(session);
const port = 3000;

const databaseUrl = process.env.DATABASE_URL;
const sessionSecret = process.env.SESSION_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  session({
    store: new PgStore({ conString: databaseUrl }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true, // set to true to create session for every user, even if they don't log in; temporary change
    cookie: {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ message: err.message });
});

app.use("/game", gameRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
