/**
 * CSE Motors Server
 * Cleaned & Production-ready Express Configuration
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";

import indexRoutes from "./routes/index.js";
import * as utils from "./utilities/index.js";
import { handleError } from "./controllers/errorController.js";
import inventoryRoutes from "./routes/inventory.js";
import session from "express-session";
import flash from "connect-flash";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ----------------------------
// Middleware setup
// ----------------------------

// Sessions + Flash (single clean setup)
app.use(session({
  secret: process.env.SESSION_SECRET || "super-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
}));

app.use(flash());

// Make flash data available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash("notice");
  res.locals.errors = req.flash("error");
  next();
});

// Utilities accessible in all EJS templates
app.locals.utils = utils;

// Built-in parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (skip in tests)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global template vars
app.locals.year = new Date().getFullYear();

// ----------------------------
// Routes
// ----------------------------
app.use("/", indexRoutes);
app.use("/inv", inventoryRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// 404 handler
app.use((req, res) => {
  res.status(404).render("layout", {
    title: "Page Not Found",
    view: "errors/404",
  });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).render("layout", {
    title: "Server Error",
    view: "errors/500",
    message: err.message,
  });
});

// ----------------------------
// Server starting
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(` CSE Motors server running at http://localhost:${PORT}`);
});

export default app;
