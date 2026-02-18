
---

## Phase 0 – Decide enhancement & branch (10–15 min)

**Goal:** Freeze the plan and isolate work.

**What to do**

* Create a new git branch, e.g. `w06-test-drive-enhancement`.
* Confirm enhancement scope:

  * Only **logged-in** users can submit a **test drive request** for a vehicle.
  * Each request ties to:
    `inv_id`, `account_id`, `preferred_date`, `preferred_time`, `contact_phone`, `message`, `status` (default `"Pending"`), `created_at`.
  * There will be:

    * A **request form** from the vehicle detail page.
    * A **management view** listing requests (with vehicle info).

*No file changes yet.*

---

## Phase 1 – Database design & sync (MOST IMPORTANT) (45–60 min)

**Goal:** Create the new table and keep **local + Render** in sync.

### 1.1. Design the table

Table: `public.testdrive_request` (or similar, just be consistent).

Columns:

* `testdrive_id` SERIAL PRIMARY KEY
* `inv_id` INT NOT NULL REFERENCES inventory(inv_id)
* `account_id` INT NOT NULL REFERENCES account(account_id)
* `preferred_date` DATE NOT NULL
* `preferred_time` VARCHAR(10) NOT NULL
* `contact_phone` VARCHAR(20) NOT NULL
* `message` TEXT
* `status` VARCHAR(20) DEFAULT 'Pending'
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 1.2. Files to update for schema

1. **Main schema file**
   (e.g. `database/assignment2.sql` / `database/init.sql` / `database/cse-motors.sql`)

   * Append a full:

     ```sql
     CREATE TABLE IF NOT EXISTS testdrive_request (...);
     ```

2. **`render-cse340.session.sql`**

   * Append the **same** `CREATE TABLE testdrive_request` block.

> **DB sync rule:** Any time you add/change tables → update local schema file(s) **and** `render-cse340.session.sql` together.

### 1.3. Apply DB changes

* **Local DB**

  * Run the `CREATE TABLE` block (or re-run schema file with `\i`).

* **Render DB**

  * Run the same `CREATE TABLE` block via `psql` or Render console.

* **Quick sanity check**

  ```sql
  SELECT * FROM testdrive_request LIMIT 1;
  ```

Should return 0 rows, no errors.

---

## Phase 2 – Model layer (test drive model) (30–45 min)

**Goal:** Encapsulate DB access using best practices (prepared statements, async, joins).

### Files to create / modify

1. **`models/testdrive-model.js`** (NEW)

Follow your existing `inventory-model.js` style:

* Import DB pool/connection.

* Export async functions:

  ```js
  async function createTestdriveRequest({ inv_id, account_id, preferred_date, preferred_time, contact_phone, message }) { ... }

  async function getRequestsByAccountId(account_id) { ... }     // optional but nice

  async function getAllRequests() { ... }                       // for management view

  async function updateTestdriveStatus(testdrive_id, newStatus) { ... } // simple admin action
  ```

* Use **prepared statements** with placeholders (`$1`, `$2`, …).

* In `getAllRequests()`, use a **JOIN** so the management view shows real info:

  * Join `testdrive_request` with `inventory` (e.g. `inv_make`, `inv_model`, maybe `inv_year`).

2. **`models/index.js`** (if you have one)

* Re-export the test drive model:

  * e.g. `export * as testdriveModel from "./testdrive-model.js";`

**No DB schema change here, just queries.**

---

## Phase 3 – Validation utilities (20–30 min)

**Goal:** Full marks for **client + server validation**.

### Files to create / modify

1. **`utilities/testdrive-validation.js`** (NEW)

Pattern it after your existing validation utilities (e.g. `account-validation.js`):

* Import from `express-validator`:

  ```js
  import { body } from "express-validator";
  ```

* Export:

  ```js
  const testdriveRules = () => [
    body("preferred_date")
      .trim()
      .notEmpty().withMessage("Preferred date is required.")
      .isISO8601().withMessage("Preferred date must be a valid date."),
    body("preferred_time")
      .trim()
      .notEmpty().withMessage("Preferred time is required."),
    body("contact_phone")
      .trim()
      .notEmpty().withMessage("Contact phone is required.")
      .isLength({ min: 7 }).withMessage("Contact phone seems too short."),
    body("message")
      .optional()
      .isLength({ max: 500 }).withMessage("Message must be 500 characters or less."),
  ];

  const checkTestdriveData = (req, res, next) => {
    // mirror your existing pattern: collect errors, if any re-render the form
  };
  ```

* Ensure `checkTestdriveData`:

  * Grabs validation errors with `validationResult(req)`.
  * If errors → re-render `testdrive/request` with:

    * `errors`
    * `testdriveData` (so form stays filled)
    * `vehicle` (so page still shows car info)

2. **`utilities/index.js`** (if you centralize exports)

* Export `testdriveRules` and `checkTestdriveData`.

**Server-side validation is now covered. Client-side comes in Phase 5.**

---

## Phase 4 – Controller + routes wiring (45–60 min)

**Goal:** New controller logic that uses the model, validation, and error handling.

### 4.1. New controller

Create: **`controllers/testdriveController.js`**

Add async handlers, all with `try { … } catch (error) { next(error); }`:

1. `buildTestdriveForm` (GET `/test-drive/request/:inv_id`)

   * Use `inventory-model` to get vehicle:

     ```js
     const vehicle = await inventoryModel.getVehicleById(inv_id);
     if (!vehicle) {
       req.flash("notice", "Vehicle not found.");
       return res.redirect("/inv");
     }
     ```

   * Render `testdrive/request` with:

     * `vehicle`
     * `errors` (empty or from validation)
     * `testdriveData` (for repopulating form)
     * `notice` (flash notice if any)

2. `processTestdriveRequest` (POST `/test-drive/request/:inv_id`)

   * After `testdriveRules()` + `checkTestdriveData` middlware runs, assume data is valid.
   * Pull `account_id` from `res.locals.accountData.account_id` (or your project’s pattern).
   * Call `testdriveModel.createTestdriveRequest(...)` inside `try/catch`.
   * On success:

     * `req.flash("notice", "Your test drive request has been submitted.");`
     * `res.redirect("/inv/detail/" + inv_id);`
   * If insert fails (rowCount 0 or error):

     * Flash a generic error and re-render form with previous inputs.

3. `buildTestdriveManagement` (GET `/test-drive/manage`)

   * Optionally restrict to managers or just logged-in users (per your project rules).
   * Use `getAllRequests()`:

     * This should return joined data (request + vehicle info).
   * Render `testdrive/management` with the list.

4. (Optional) `updateTestdriveStatus` (POST or POST/PUT route)

   * Use `updateTestdriveStatus(testdrive_id, newStatus)`.
   * Redirect back to `/test-drive/manage` with a flash notice.

### 4.2. New route file

Create: **`routes/testdriveRoute.js`**

* Import:

  * `express`
  * `testdriveController`
  * Auth middleware (e.g. `utilities/account-validation.js` or `accountRoute`’s middleware)
  * `testdriveRules`, `checkTestdriveData`

* Define routes:

  ```js
  router.get(
    "/request/:inv_id",
    accountController.checkLogin,       // or your project’s auth middleware
    testdriveController.buildTestdriveForm
  );

  router.post(
    "/request/:inv_id",
    accountController.checkLogin,
    testdriveRules(),
    checkTestdriveData,
    testdriveController.processTestdriveRequest
  );

  router.get(
    "/manage",
    accountController.checkLogin,       // maybe extra manager check
    testdriveController.buildTestdriveManagement
  );
  ```

### 4.3. Wire into `server.js`

* At top:

  ```js
  import testdriveRouter from "./routes/testdriveRoute.js";
  ```

* In routing section:

  ```js
  app.use("/test-drive", testdriveRouter);
  ```

---

## Phase 5 – Views + CSS + client-side validation (45–60 min)

**Goal:** New views that look consistent, show errors, and include client-side checks.

### 5.1. EJS views

1. **`views/testdrive/request.ejs`** (NEW)

   * Use your main `layout.ejs`.

   * Show:

     * Vehicle info (make, model, year).
     * Flash notice.
     * Validation errors block.

   * Test drive form:

     ```html
     <form action="/test-drive/request/<%= vehicle.inv_id %>" method="post" class="inv-form" id="testdriveForm">
       <!-- Errors -->
       <% if (errors && errors.length) { %>
         <div class="errors">
           <ul>
             <% errors.forEach(error => { %>
               <li><%= error.msg %></li>
             <% }) %>
           </ul>
         </div>
       <% } %>

       <!-- Preferred Date -->
       <div class="form__field">
         <label for="preferred_date">Preferred Date</label>
         <input
           type="date"
           id="preferred_date"
           name="preferred_date"
           required
           value="<%= testdriveData?.preferred_date || '' %>"
         />
       </div>

       <!-- Preferred Time -->
       <div class="form__field">
         <label for="preferred_time">Preferred Time</label>
         <input
           type="time"
           id="preferred_time"
           name="preferred_time"
           required
           value="<%= testdriveData?.preferred_time || '' %>"
         />
       </div>

       <!-- Contact Phone -->
       <div class="form__field">
         <label for="contact_phone">Contact Phone</label>
         <input
           type="tel"
           id="contact_phone"
           name="contact_phone"
           required
           value="<%= testdriveData?.contact_phone || '' %>"
         />
       </div>

       <!-- Message -->
       <div class="form__field">
         <label for="message">Message (optional)</label>
         <textarea
           id="message"
           name="message"
           maxlength="500"
         ><%= testdriveData?.message || '' %></textarea>
       </div>

       <button type="submit" class="button--primary">
         Submit Test Drive Request
       </button>
     </form>
     ```

   * **Client-side validation** (simple, optional but nice):

     ```html
     <script>
       const form = document.getElementById("testdriveForm");
       form.addEventListener("submit", (event) => {
         const date = form.preferred_date.value.trim();
         const time = form.preferred_time.value.trim();
         const phone = form.contact_phone.value.trim();

         if (!date || !time || !phone) {
           // simple guard; server does deeper checks
           alert("Preferred date, time, and phone are required.");
           event.preventDefault();
         }
       });
     </script>
     ```

   This + HTML5 `required` gives you **client-side validation**.

2. **`views/testdrive/management.ejs`** (NEW, recommended)

   * Display a table of requests using the joined data from `getAllRequests()`:

     * Columns: Vehicle (make+model), preferred date, time, phone, status, created_at, maybe actions (update status).

3. **Modify existing views to link to the feature**

   * **`views/inventory/detail.ejs`**:

     * Add a clear button:

       ```html
       <a href="/test-drive/request/<%= inv_id %>" class="button--primary">
         Request Test Drive
       </a>
       ```

     * Place it near your main “call to action” area.

   * **Account / management page** (e.g. `views/account/management.ejs` or `views/inventory/management.ejs`):

     ```html
     <a href="/test-drive/manage" class="button--secondary">
       View Test Drive Requests
     </a>
     ```

### 5.2. CSS updates

* **`public/css/styles.css`**

  * Reuse existing class names: `.inv-form`, `.form__field`, `.button--primary`, `.errors`, `.notice`.
  * If needed, define something like `.testdrive-list` or `.testdrive-table` for the management page, but keep it minimal.

---

## Phase 6 – Validation, error-handling & testing pass (45–60 min)

**Goal:** Prove every rubric line is satisfied **before** you deploy.

### 6.1. Local manual tests

1. **Auth flow**

   * As **not logged in**:

     * Go to `/inv/detail/:inv_id`, click “Request Test Drive”.
     * Should be redirected to login (auth middleware).
   * After login:

     * Return and confirm the form loads with vehicle info.

2. **Validation**

   * Submit empty form → should stay on same page with error messages.
   * Invalid data (e.g. short phone) → get proper error messages from server-side validation.
   * Valid data → success flash, redirect to `/inv/detail/:inv_id`.

3. **DB check**

   * In psql:

     ```sql
     SELECT * FROM testdrive_request ORDER BY testdrive_id DESC LIMIT 3;
     ```

   * Confirm values match the form inputs.

4. **Management view**

   * Visit `/test-drive/manage` while logged in as the right role.
   * Confirm the list shows:

     * Request + vehicle data (from JOIN).
     * Status field.

5. **Error handling**

   * Temporarily break a query in `testdrive-model.js` (e.g. wrong column name).
   * Hit `/test-drive/manage`:

     * Confirm it goes through `next(error)` into your global error handler page (no raw stack dump).
   * Fix it back.

### 6.2. Deploy to Render & sync DB

1. **Push to GitHub**

   * Ensure all new/updated files are committed:

     * `models/testdrive-model.js`
     * `controllers/testdriveController.js`
     * `routes/testdriveRoute.js`
     * `utilities/testdrive-validation.js`
     * SQL schema files
     * New views and CSS tweaks

2. **Render DB**

   * If not already done: run the same `CREATE TABLE testdrive_request` on Render DB.

3. **Redeploy app**

   * Trigger redeploy and test on **live URL**:

     * `/inv/detail/:inv_id` → Request Test Drive → form + submission.
     * `/test-drive/manage` → list of requests.

---

## Phase 7 – Canvas submission checklist (10–15 min)

**Goal:** Present the enhancement clearly so graders give full credit.

1. **Check against the 6 rubric pieces**

   * **Database:** New `testdrive_request` table, used by model & controller, JOIN with `inventory`.
   * **Model:** `testdrive-model.js` with async functions, prepared statements, and at least one extra behavior (`updateTestdriveStatus`).
   * **Controller:** `testdriveController.js` with `try/catch`, `next(error)`, friendly flashes, “vehicle not found” handling.
   * **View:** `testdrive/request.ejs` + `testdrive/management.ejs` + updated `inventory/detail.ejs` link.
   * **Validation:** Client-side (HTML5 + JS) + server-side (`testdriveRules` + `checkTestdriveData`) with errors shown in the view.
   * **Error handling:** All DB calls wrapped; global error handler catches unexpected errors.

2. **Submission package**

   * GitHub repo link (branch merged into main).
   * Render live URL.
   * Any zipped source (if teacher wants it, minus `node_modules`).

3. **Canvas comment (very important)**

   In our submission comment, we'll write something like:

   > “For my Week 06 enhancement, I added a **Test Drive Request** feature. Logged-in users can visit any vehicle detail page (`/inv/detail/:inv_id`) and click **‘Request Test Drive’** to submit a form with preferred date, time, phone, and an optional message. Requests are saved in a new `testdrive_request` database table and can be viewed on `/test-drive/manage` in a management view that joins test drive requests with the vehicle data. The feature includes client-side and server-side validation, and all DB interactions use prepared statements with proper error handling.”

---
