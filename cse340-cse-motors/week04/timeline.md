Nice, your structure is already in great shape for W03 🙌
Here’s a **W04 dev timeline** targeted at getting **100/100** on the rubric, with concrete files + dirs.

---

## Phase 0 – Prep (short)

* Re-read **Assignment 4** + W04 Canvas instructions & rubric.
* Create a **week04 branch** (optional but clean): `git checkout -b week04-add-inventory`.
* Confirm local DB is seeded (`database/db-sql-code.sql`, `database/inventory-data.sql`).

---

## Phase 1 – Management View (`/inv`)  ✅ (Tasks + Rubric: data processing + MVC)

**Goal:** New Inventory Management page with two links + flash area. 

1. **View:** `views/inventory/management.ejs`

   * Title + `<h1>Vehicle Management`.
   * Two links (no hard-coded direct view links):

     * “Add New Classification” → route that serves add-classification view.
     * “Add New Vehicle” → route that serves add-inventory view.
   * Slot to show flash messages + errors (e.g. where you already show `locals.message`).

2. **Controller:** `controllers/inventoryController.js`

   * Add `buildManagementView(req, res)` that:

     * Builds the nav (you probably already do this in other actions).
     * Renders `inventory/management`.

3. **Route:** `routes/inventoryRoute.js`

   * Add `router.get("/", utilities.handleErrors(invController.buildManagementView))`.
   * Ensure error-handling middleware wrapper (same approach as W03).

4. Test:

   * Hit `http://localhost:PORT/inv/` and confirm view renders, nav works, no console errors.
   * Check styling meets **Frontend Checklist**. 

---

## Phase 2 – Add Classification Feature  🧱

**Goal:** Add new classification with client- & server-side validation + messages. 

### 2.1 View – `views/inventory/add-classification.ejs`

* Form:

  * Single input: `name="classification_name"` (or `classification_name` / `classification_name` – just keep DB/form/controller naming aligned). 
  * Text telling user **no spaces or special characters**.
  * Client-side validation:

    * `required`
    * `pattern="^[A-Za-z0-9]+$"` (or similar).
* Include:

  * Error list (from server-side validation).
  * Flash message region.

### 2.2 Model – `models/inventory-model.js`

Add function like:

```js
async function addClassification(classification_name) {
  const sql = `INSERT INTO public.classification (classification_name)
               VALUES ($1) RETURNING *`;
  return pool.query(sql, [classification_name]);
}
```

(Use your existing `database/index.js` connection.)

### 2.3 Validation Middleware – `utilities/inventory-validation.js`

Create file:

* `classRules` – `express-validator` rules for `classification_name`.
* `checkClassData` – collects errors, if any:

  * Re-renders `inventory/add-classification` with:

    * `errors`
    * Sticky `classification_name` value.

### 2.4 Controller – `controllers/inventoryController.js`

Add:

* `buildAddClassification(req, res)` → renders the form.
* `registerClassification(req, res)`:

  * Calls `invModel.addClassification`.
  * On success:

    * Set success message on session (e.g., `req.flash("notice", "The new classification was successfully added.")`).
    * Rebuild nav.
    * Render **management view** with message (per spec). 
  * On failure:

    * Set failure message.
    * Re-render `add-classification` with sticky value.

### 2.5 Routes – `routes/inventoryRoute.js`

* `router.get("/add-classification", handleErrors(invController.buildAddClassification));`
* `router.post("/add-classification",
  invValidate.classRules(),
  invValidate.checkClassData,
  handleErrors(invController.registerClassification)
  );`

### 2.6 Test

* Invalid values (spaces, symbols) → blocked by client & server; sticky input; errors visible.
* Valid value inserts; new classification appears immediately in nav without refresh (nav rebuild).

---

## Phase 3 – Add Inventory Feature (New Vehicle) 🚗

**Goal:** Full add-vehicle flow with sticky form + dropdown classification select. 

### 3.1 Utility – Classification `<select>` builder

In `utilities/index.js`:

* Implement `Util.buildClassificationList(classification_id = null)` exactly like sample in assignment (adapted to your DB access). 

### 3.2 View – `views/inventory/add-inventory.ejs`

* Fields for **all columns except PK**:

  * `classification_id` (select dropdown – inject `classificationList` string from controller).
  * `inv_make`, `inv_model`, `inv_description`, `inv_image`, `inv_thumbnail`, `inv_price`, `inv_year`, `inv_miles`, `inv_color`, etc (match your DB schema).
* Client-side validation:

  * `required` on all.
  * Min length for make/model (`minlength="3"`).
  * Correct `type="number"` for price, year, miles with `min`, `max`, etc.
* Default image paths:

  * Use `/images/vehicles/no-image.png` and `/images/vehicles/no-image-tn.png` or real image path. 
* Make all fields **sticky**:

  * When re-rendered, value attributes use EJS locals from `req.body`.

### 3.3 Model – `models/inventory-model.js`

Add function `addInventory(data)` that does parameterized `INSERT` into `inventory` table and `RETURNING inv_id` (or row). 

### 3.4 Validation – `utilities/inventory-validation.js`

* `inventoryRules` – express-validator rules for each field (string lengths, numeric ranges, etc.).
* `checkInventoryData` – on validation fail:

  * Rebuild classification list with selected `classification_id`.
  * Re-render `inventory/add-inventory` with errors + sticky body.

### 3.5 Controller – `controllers/inventoryController.js`

Add:

* `buildAddInventory(req, res)`:

  * Calls `Util.buildClassificationList()`.
  * Renders `inventory/add-inventory` with `classificationList`.
* `registerInventory(req, res)`:

  * Calls `invModel.addInventory`.
  * On success:

    * `req.flash("notice", "The new vehicle was successfully added.")`.
    * Redirect / render **management view** with message.
  * On failure:

    * Flash failure + re-render `add-inventory`.

### 3.6 Routes – `routes/inventoryRoute.js`

* `router.get("/add-inventory", handleErrors(invController.buildAddInventory));`
* `router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  handleErrors(invController.registerInventory)
  );`

### 3.7 Testing

* Invalid values: see client-side errors, then server-side errors, and **sticky** form.
* Valid insert:

  * Success message appears on management view.
  * New vehicle shows up on `/inv/type/:classificationId` and detail page.

---

## Phase 4 – Rubric Polish Pass 🎯

Use the W04 rubric as a checklist. 

1. **Frontend checklist (10 pts)**

   * Check `views/inventory/management.ejs`, `add-classification.ejs`, `add-inventory.ejs` against the course Frontend Checklist (labels, headings, semantics, mobile layout).

2. **Data processing & MVC (20 pts)**

   * Confirm:

     * All three processes work: management view, add classification, add vehicle. 
     * Controllers only have logic, models only have DB queries, views only present info.

3. **Session messages (10 pts)**

   * Flash messages set + read in all three flows (success & failure).

4. **Data insertion & return values (20 pts)**

   * Models use **parameterized queries**.
   * Controllers check `rowCount` or `RETURNING` to decide success/failure.

5. **Validation & sticky forms (30 pts total)**

   * Client-side + server-side validation for both forms.
   * Correct data types enforced in validators.
   * Sticky vehicle form confirmed (errors returned + values preserved).

---

## Phase 5 – Deployment + Submission 📤

1. **Local**

   * `npm test` (if any), manual click-through of:

     * `/inv/`
     * Add classification (fail + success).
     * Add inventory (fail + success + view listing + detail).

2. **GitHub**

   * Commit: `feat: week04 add classification and inventory`.
   * Push to your **CSE Motors** repo.

3. **Render**

   * Go to your existing CSE Motors service.
   * Manual redeploy.
   * Test same flows on **production** URL.

4. **Canvas submission**

   * Provide:

     * GitHub URL.
     * Render production URL.
     * ZIP of project folder (excluding `node_modules` unless teacher says otherwise). 

---

If you want, next we can:

* Draft `utilities/inventory-validation.js` and one of the new views (`add-classification.ejs`) exactly, ready to paste.

