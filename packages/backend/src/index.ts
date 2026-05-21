import dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "cors";
import express from "express";

import { config } from "./config.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import healthRouter from "./routes/health.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(healthRouter);
app.use(authRouter);
app.use(adminRouter);

if (isProduction) {
  const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health") {
      next();
      return;
    }

    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});
