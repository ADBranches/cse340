/**
 * CSE Motors Server — Phase 3 Integration
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

// ----------------------------
// Security Headers (CSP)
// ----------------------------
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' data: blob: https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://res.cloudinary.com;"
  );
  next();
});

// ----------------------------
// Middleware setup (ORDER MATTERS)
// ----------------------------

// 1️⃣ Parse cookies first
app.use(cookieParser());

// 2️⃣ Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// 3️⃣ Flash messages
app.use(flash());

// 4️⃣ Expose flash data to all templates
app.use((req, res, next) => {
  res.locals.messages = req.flash("notice");
  res.locals.errors = req.flash("error");
  next();
});

// 5️⃣ Verify JWT (after flash/session initialized)
app.use(verifyToken);

// 6️⃣ Global account context
app.use(globalAuthContext);

// 7️⃣ Utils + body parsers
app.locals.utils = utils;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 8️⃣ Logger (optional for production)
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// 9️⃣ Static assets
app.use(express.static(path.join(__dirname, "public")));

// 🔟 View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.locals.year = new Date().getFullYear();

// ----------------------------
// Routes (MUST come before 404)
// ----------------------------
app.use("/", indexRoutes);
app.use("/inv", inventoryRoutes);
app.use("/account", accountRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// ----------------------------
// Error Handlers
// ----------------------------
app.use((req, res) => {
  res.status(404).render("layout", {
    title: "Page Not Found",
    view: "errors/404",
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).render("layout", {
    title: "Server Error",
    view: "errors/500",
    message: err.message,
  });
});

// ----------------------------
// Server start
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ CSE Motors server running → http://localhost:${PORT}`)
);

export default app;
