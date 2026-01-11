/**
 * CSE Motors Server — Phase 3 Integration (Stabilized)
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import { verifyToken, globalAuthContext } from "./middleware/authMiddleware.js";

// Routes
import indexRoutes from "./routes/index.js";
import inventoryRoutes from "./routes/inventory.js";
import accountRoutes from "./routes/account.js";
import * as utils from "./utilities/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =======================================================
   SECURITY HEADERS (Relaxed CSP for Inline JS & Styles)
======================================================= */
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self' data: blob:",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
      "https://res.cloudinary.com;",
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
    ].join(" ")
  );
  next();
});

/* =======================================================
   MIDDLEWARE SETUP — ORDER MATTERS
======================================================= */

// 1. Parse cookies first
app.use(cookieParser());

// 2. Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 }, // 5 min session
  })
);

// 3. Flash messages
app.use(flash());

// 4. Make flash data available in all EJS views
app.use((req, res, next) => {
  res.locals.messages = req.flash("notice");
  res.locals.errors = req.flash("error");
  next();
});

// 5. Body parsers (must come BEFORE JWT + routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. JWT Verification & Global Context (login flow)
app.use(verifyToken);
app.use(globalAuthContext);

// 7. Utilities and app locals
app.locals.utils = utils;

// 8. Request logger (skip in test mode)
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// 9. Serve static assets
app.use(express.static(path.join(__dirname, "public")));

// 10. View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.locals.year = new Date().getFullYear();

/* =======================================================
   ROUTES (Must precede 404 & Error Handlers)
======================================================= */
app.use("/", indexRoutes);
app.use("/inv", inventoryRoutes);
app.use("/account", accountRoutes);

// Temporary debug route
app.post("/debug-register", (req, res) => {
  console.log("Received register POST:", req.body);
  res.json({ received: true, body: req.body });
});

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

/* =======================================================
   ERROR HANDLERS
======================================================= */
// 404 Not Found
app.use((req, res) => {
  res.status(404).render("layout", {
    title: "Page Not Found",
    view: "errors/404",
  });
});

// 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).render("layout", {
    title: "Server Error",
    view: "errors/500",
    message: err.message,
  });
});

/* =======================================================
   SERVER START
======================================================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`CSE Motors server running at http://localhost:${PORT}`);
});

export default app;
