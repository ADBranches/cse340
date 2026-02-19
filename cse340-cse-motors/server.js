// server.js - esm modules
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import indexRouter from "./routes/index.js";
import inventoryRouter from "./routes/inventoryRoute.js";
import errorRouter from "./routes/errorRoute.js";
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import authMiddleware from "./utilities/auth-middleware.js";
import accountRouter from "./routes/accountRoute.js";
import testdriveRouter from "./routes/testdriveRoute.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout");

// Body parsers for form + JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware (required for flash)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cse340-super-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set true only if using HTTPS
  })
);

// Flash middleware
app.use(flash());

// Making flash messages available in all views as `notice`
app.use((req, res, next) => {
  res.locals.notice = req.flash("notice");
  next();
});

// Parsing cookies so we can read JWT
app.use(cookieParser());

// Attaching account data (from JWT) to res.locals
app.use(authMiddleware.attachAccountData);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/inv", inventoryRouter);
app.use("/", errorRouter);
app.use("/test-drive", testdriveRouter); 


// Ignore Chrome DevTools /.well-known requests so they don't spam the logs
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  return res.status(204).end(); // 204 No Content, no error
});

// 404 handler
app.use((req, res, next) => {
  console.log("404 middleware hit for:", req.url);
  const err = new Error("The page you requested could not be found.");
  err.status = 404;
  next(err);
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;

  // Only logging real server errors (500+), not expected 404s
  if (status >= 500) {
    console.error(err);
  }

  const title = status === 404 ? "404 Not Found" : "Server Error";

  res.status(status).render("errors/error", {
    title,
    status,
    message: err.message,
  });
});

// Local Server Information (with safe fallbacks)
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
