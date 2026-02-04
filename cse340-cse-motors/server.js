// server.js - esm mdules

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import indexRouter from "./routes/index.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout"); // uses views/layout.ejs

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);

// Local Server Information (with safe fallbacks)
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
