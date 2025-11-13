/**
 * CSE Motors Server
 * -----------------
 * Production-ready Express configuration with:
 *  - EJS view engine
 *  - Static asset serving
 *  - Centralized routing
 *  - Environment variable support
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";

import indexRoutes from "./routes/index.js";

// ────────────────────────────────────────────────
// Environment Setup
// ────────────────────────────────────────────────
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging for both local + production (disable in tests)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// ────────────────────────────────────────────────
// View Engine Configuration
// ────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Define year globally using app.locals
app.locals.year = new Date().getFullYear();

// ────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────
app.use("/", indexRoutes);

// ────────────────────────────────────────────────
// Health Check & Error Handling
// ────────────────────────────────────────────────
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// 404 Handler
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "Page Not Found" });
});

// Global Error Handler (centralized for future routes)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).render("errors/500", { title: "Server Error", message: err.message });
});

// ────────────────────────────────────────────────
// Server Startup
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚗 CSE Motors server running at http://localhost:${PORT}`);
  if (process.env.NODE_ENV === "production") {
    console.log("✅ Environment: Production build");
  } else {
    console.log("🧩 Environment: Development build");
  }
});

export default app;
