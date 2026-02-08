
* The assignment **requires** the utilities function in `utilities/index.js`, not anywhere else. 
* The **detail view** must live in `views/inventory/` and hit the Frontend Checklist (valid HTML/CSS, responsive, WAVE-clean).
* Error handling must be **global** (all routes) *plus* the **footer-based intentional 500** that flows through MVC + middleware.
* You must submit **both URLs** and they must be working (GitHub + Render).

Your existing plan actually hits all of that. I’ll just restate a **clean, repo-aligned timeline** using your real directories so you can follow it like a checklist.

---

## Clean Timeline for 100/100 (no code, just phases)

I’ll use what you already have:

Top level:

* `controllers/`
* `models/`
* `routes/`
* `database/`
* `public/css/styles.css`
* `views/` (with `partials/footer.ejs` etc.)

We’ll add one new folder: `utilities/`.

---

### Phase 0 – Sanity check (before touching anything)

**Files to just verify**

* `server.js`
* `routes/index.js`
* `views/layout.ejs`
* `views/index.ejs`
* `.env` (PORT + DB URL you’re using: local or Render external)

**Goal**

* `npm install` (if needed), run (`npm run dev` or `node server.js` depending on your setup).
* Hit `http://localhost:<port>` and make sure:

  * Layout + nav + footer render.
  * No startup errors.

> This doesn’t hit rubric directly, but prevents you from debugging stuff unrelated to Assignment 3.

---

### Phase 1 – DB connection + inventory model function (Obj. 4)

**New / edited files**

* **NEW** `database/index.js` (or `database/pool.js` – just be consistent).
* **NEW** `models/inventory-model.js`.

**What you do**

* In `database/`, export your `pg.Pool` using the correct `DATABASE_URL` or local connection string.
* In `models/inventory-model.js`, add *one* function that:

  * Takes `inv_id`.
  * Runs a **parameterized** SQL query on `inventory` (uses `$1`, not string concatenation).
  * Returns the one row.

**Rubric it hits**

* Objective 4: “A function exists in the inventory model to get data for a particular vehicle, uses a Prepared Statement approach, and works.” 

---

### Phase 2 – Inventory controller (Obj. 2 + Obj. 3 part)

**New / edited files**

* **NEW** `controllers/inventoryController.js`.

**What you do**

* Import the model function from `models/inventory-model.js`.
* Plan to call a utility function from `utilities/index.js` (Phase 4).
* Create a controller like `buildVehicleDetail(req, res, next)` that:

  * Reads `invId` from `req.params`.
  * Calls the model to get the vehicle.
  * If not found → pass an error to `next()`.
  * Passes data + HTML grid + title into the view (Phase 5).

**Rubric**

* Controller exists and correctly delivers the vehicle detail data. 

---

### Phase 3 – Inventory route for detail view (Obj. 2 + Obj. 3)

**New / edited files**

* **NEW** `routes/inventoryRoute.js`.
* **EDIT** `server.js`.

**What you do**

* In `routes/inventoryRoute.js`:

  * Create an Express router.
  * Add route for something like `/detail/:invId` that uses `inventoryController.buildVehicleDetail`.
* In `server.js`:

  * Import the inventory router.
  * Mount it with `app.use("/inv", inventoryRoute);`.

**Rubric**

* “A route exists to handle the incoming request and responds to the request.” 
* Starts the MVC chain (route → controller → model).

---

### Phase 4 – Utilities HTML builder (Obj. 2 + Obj. 3)

**New / edited files**

* **NEW** folder `utilities/` (top-level).
* **NEW** `utilities/index.js`.

**What you do**

* In `utilities/index.js`:

  * Add a function (e.g., `buildVehicleDetailGrid(vehicle)`).
  * That function **returns a string of HTML** with:

    * Make, model, year, price, mileage, description, image.
    * Price formatted as USD (with `$` and commas).
    * Mileage with commas.

* Make sure to export this function and any existing ones (like `getNav` if you already use it).

**Rubric**

* “A new custom function exists in the utilities > index.js file to build HTML around the vehicle detail data…”

---

### Phase 5 – Vehicle detail view + CSS (Obj. 1: frontend + formatting)

**New / edited files**

* **NEW** folder: `views/inventory/`.
* **NEW** `views/inventory/detail.ejs`.
* **EDIT** `public/css/styles.css`.

**What you do**

* In `views/inventory/detail.ejs`:

  * Use layout (`layout.ejs`).
  * Output the `title` (make + model) in `<title>` and `<h1>`.
  * Use `<%- grid %>` where you want the vehicle HTML from utilities to appear.
* In `public/css/styles.css`:

  * Add styles for the detail page:

    * **Large screens**: image + text side by side (flex or CSS grid).
    * **Small screens**: stacked layout.
    * No horizontal scrolling at any width.

**Rubric**

* Frontend standards (valid HTML/CSS, WAVE clean, no broken content).
* Responsiveness (multi-column on large, stacked on small).
* Price & mileage formatting (USD, commas).

---

### Phase 6 – Global error handling + error view (Obj. 5)

**New / edited files**

* **EDIT** `server.js`.
* **NEW** folder `views/errors/`.
* **NEW** `views/errors/error.ejs`.

**What you do**

* In `server.js`:

  * After **all** `app.use("/something", ...)` routes:

    1. Add a 404 handler (creates an Error with status 404, passes to next).
    2. Add a general error-handling middleware that:

       * Logs error.
       * Sets status (404 or 500+).
       * Renders `views/errors/error.ejs` with `status`, `title`, `message`.
* In `views/errors/error.ejs`:

  * Build a clean error page that passes the Frontend Checklist.

**Rubric**

* Error handling implemented throughout routes, delivering error views when errors are detected.

---

### Phase 7 – Footer-based intentional 500 error (Obj. 3 + Obj. 5)

**New / edited files**

* **EDIT** `views/partials/footer.ejs`.
* **EDIT / NEW** in `routes/`:

  * Either extend `routes/index.js` or add `routes/errorRoute.js`.
* **NEW (optional but clean)** `controllers/errorController.js`.

**What you do**

* In `views/partials/footer.ejs`:

  * Add a link, e.g. `href="/error-test"`.
* In router:

  * Route `/error-test` that points to a controller function.
* In `controllers/errorController.js` (or inline in router if your instructor is okay with that, but MVC is nicer):

  * Create a function that **throws or passes an intentional error** (status 500).
* Because of Phase 6, the error goes into your error middleware and renders `errors/error.ejs`.

**Rubric**

* “The footer-based error process works and uses an MVC approach.”
* “The footer-based error link is present and works to generate an error … caught and handled using the error handler middleware.” 

---

### Phase 8 – Frontend Checklist + behavior tests (Obj. 1, 5)

**Files you test (no new files)**

* `views/inventory/detail.ejs`
* `views/errors/error.ejs`
* `public/css/styles.css`

**Checklist**

* From nav → classification view → click vehicle → **detail page** shows correct info and looks professional. 
* Resize window from mobile to desktop → responsive, no horizontal scroll.
* Run:

  * HTML validator.
  * CSS validator.
  * WAVE (no errors/contrast errors).
* Manually hit:

  * A fake route (e.g. `/this-does-not-exist`) → 404 via error view.
  * Footer error link → 500 via error view.

---

### Phase 9 – Deploy + submit (Obj. 6)

**What you do**

* Commit and push all changes to **GitHub**.
* On Render, manually deploy your web service.
* Test the **production** URL exactly like Phase 8.
* Submit to Canvas:

  * GitHub repo URL.
  * Render production URL.
  * ZIP of source (if your Canvas assignment requires it — the W03 Canvas page asks for all three). 

---

### So… is the original plan “right” for 100/100?

Yes – your earlier agent’s phases already matched the assignment very closely.
What I’ve done here is:

* Align it **exactly** with:

  * Your real project structure.
  * The official **Assignment 3 directions**, **Frontend Checklist**, and **Canvas rubric**.
* Make sure every line of the rubric is explicitly covered by a phase + specific file.

If we follow this timeline **in order**, we’re set up to hit 100/100.

