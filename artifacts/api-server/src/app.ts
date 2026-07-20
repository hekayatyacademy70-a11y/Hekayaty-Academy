import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ─── Security & Performance Middlewares ───
app.use(helmet()); // Sets secure HTTP headers
app.use(compression()); // Compress responses (gzip/brotli)

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per `window`
  standardHeaders: true, 
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});
app.use("/api/", globalLimiter);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// ─── Global Error Handler ───
// Handles Multer errors, Zod validation, and all other errors uniformly
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Multer file size / type errors
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({ error: "File too large. Maximum allowed size is 200MB." });
    return;
  }
  if (err.message?.startsWith("File type not allowed")) {
    res.status(415).json({ error: err.message });
    return;
  }
  // Zod validation errors
  if (err.issues) {
    res.status(400).json({ error: "Validation failed", details: err.issues });
    return;
  }
  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  // Generic server error — log and return 500
  logger.error({ err, url: req.originalUrl, method: req.method }, "Unhandled server error");
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : (err.message || "Internal server error"),
  });
});

export default app;
