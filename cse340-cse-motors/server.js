// server.js (ESM, no CommonJS)

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";

dotenv.config();

const app = express();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);

// Local Server Information (with safe fallbacks)
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

// Log statement to confirm server operation
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

