/**
 * CSE Motors Server
 * Production-ready Express Configuration
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

// Make utilities available to all EJS views
app.locals.utils = utils;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global template vars
app.locals.year = new Date().getFullYear();

// Session Middleware (Required for flash messages)
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey123",
  resave: false,
  saveUninitialized: true,
}));

// Flash Middleware
app.use(flash());

// Routes
app.use("/", indexRoutes);

app.use("/inv", inventoryRoutes);

// Making flash messages available in all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// 404 handler
app.use((req, res) => {
  res.status(404).render("layout", {
    title: "Page Not Found",
    view: "errors/404"
  });
});

// ⭐ Central error middleware 
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).render("layout", {
    title: "Server Error",
    view: "errors/500",
    message: err.message
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚗 CSE Motors server running at http://localhost:${PORT}`);
});

export default app;
