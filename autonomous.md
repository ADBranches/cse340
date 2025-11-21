Below is **your exact, project-specific execution timeline** for **Assignment 4**, written to match **your CURRENT project structure**, file names, and folder layout.

This is **NOT generic** — it is tailored specifically for your repo:

```
controllers/
routes/
utilities/
views/
views/inventory.ejs
views/vehicle-details.ejs
views/index-content.ejs
views/layout.ejs
views/errors/
views/partials/
data/vehicles.js
server.js
```

You will follow this timeline step-by-step and update **only the necessary files**.
If you follow this order, **you will finish cleanly and score 100/100**.

---

# 🚀 **ASSIGNMENT 4 EXECUTION TIMELINE (Exact Step-by-Step)**

## ➤ **PHASE 0 — PREP (5 minutes)**

### Files:

* `controllers/inventoryController.js`
* `routes/` (we will add new routes)
* `utilities/index.js`

Make sure:

* Inventory controller exists (it does ✔)
* Navigation builder function exists in `utilities/index.js` (it does ✔)
* You can run project via `npm run dev` or `node server.js`.

---

# 🟦 **PHASE 1 — Create Inventory Management View (Task 1)**

## Goal: Create `/inv/` management dashboard

### Files to create/edit:

### **1. Create view:**

```
views/inventory-management.ejs
```

### **2. Edit or create route file for inventory:**

```
routes/inventoryRoute.js
```

If this file doesn’t exist, create it.

### **3. Add route in `server.js`:**

```js
const invRoute = require("./routes/inventoryRoute")
app.use("/inv", invRoute)
```

### **4. Edit controller:**

`controllers/inventoryController.js`

Add a function:

```js
invController.buildManagement = (req, res) => {
  let nav = utilities.getNav()
  res.render("inventory-management", {
    title: "Inventory Management",
    nav,
    errors: null,
    messages: req.flash("notice")
  })
}
```

### **5. Add route:**

In `routes/inventoryRoute.js`:

```js
router.get("/", invController.buildManagement)
```

✔ *Management view DONE.*

---

# 🟦 **PHASE 2 — Add “Add Classification” Feature (Task 2)**

## Goal: Add classification form, validation, insert into DB, show messages.

### Files to create/edit:

### **1. Create view file:**

```
views/add-classification.ejs
```

### **2. Add client-side validation in the form**

(e.g., `pattern="[A-Za-z]+"` and `required`)

---

### **3. Create a Validation File:**

Create:

```
utilities/inventory-validation.js
```

Add express-validator rules:

```js
invValidate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only letters, no spaces.")
  ]
}
```

Add middleware handler:

```js
invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = utilities.getNav()
    return res.render("add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      messages: req.flash("notice")
    })
  }
  next()
}
```

---

### **4. Edit inventory model:**

File: `models/inventory-model.js`

Add function:

```js
async function addClassification(classification_name) {
  const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
  const result = await pool.query(sql, [classification_name])
  return result.rowCount
}
```

---

### **5. Add controller logic:**

File: `controllers/inventoryController.js`

Add:

```js
invController.addClassification = async (req, res) => {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")
    let nav = await utilities.getNav()
    return res.render("inventory-management", { title: "Inventory Management", nav })
  }

  req.flash("notice", "Failed to add classification.")
  let nav = utilities.getNav()
  res.render("add-classification", { title: "Add Classification", nav })
}
```

---

### **6. Add GET + POST routes:**

File: `routes/inventoryRoute.js`

```js
router.get("/add-classification", invController.buildAddClassification)
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
)
```

✔ *Classification functionality DONE.*

---

# 🟦 **PHASE 3 — Add “Add Inventory Item” Feature (Task 3)**

This is the largest step.

---

## **PART A — Build the View**

### Files to create/edit:

```
views/add-inventory.ejs
```

Form must include:

* inv_make
* inv_model
* inv_year
* inv_price
* inv_miles
* inv_color
* inv_description
* inv_image
* inv_thumbnail
* classification dropdown

---

## **PART B — Dropdown Select List**

### File: `utilities/index.js`

Add function (or ensure it exists):

```js
utilities.buildClassificationList = async function (classification_id = null) {
   // code from assignment instructions
}
```

---

## **PART C — Validation Rules**

### File: `utilities/inventory-validation.js`

Add:

```js
invValidate.addInventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 1 }),
    body("inv_model").trim().isLength({ min: 1 }),
    body("inv_year").trim().isInt({ min: 1900 }),
    body("inv_price").isFloat(),
    body("inv_miles").isInt(),
    body("classification_id").isInt(),
  ]
}
```

Add middleware:

```js
invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    let nav = await utilities.getNav()
    return res.render("add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      // sticky values:
      ...req.body
    })
  }
  next()
}
```

---

## **PART D — Model Insert**

### File: `models/inventory-model.js`

Add:

```js
async function addInventory(data) {
  const sql = `
    INSERT INTO inventory
    (inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
  `
  const result = await pool.query(sql, [
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.classification_id
  ])
  return result.rowCount
}
```

---

## **PART E — Controller Logic**

### File: `controllers/inventoryController.js`

Add:

```js
invController.addInventory = async (req, res) => {
  const result = await invModel.addInventory(req.body)

  if (result) {
    req.flash("notice", "Inventory item added successfully.")
    let nav = await utilities.getNav()
    return res.render("inventory-management", { title: "Inventory Management", nav })
  }

  req.flash("notice", "Failed to add inventory item.")
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)
  res.render("add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList
  })
}
```

---

## **PART F — Routes**

### File: `routes/inventoryRoute.js`

Add:

```js
router.get("/add-inventory", invController.buildAddInventory)
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
)
```

✔ *Inventory form DONE.*

---

# 🟦 **PHASE 4 — TESTING + DEPLOYMENT**

### Files checked:

* `views/*`
* `controllers/inventoryController.js`
* `models/inventory-model.js`
* `routes/inventoryRoute.js`
* `utilities/*`

### Tests:

1. Management view loads
2. Add classification works
3. Add inventory works
4. Sticky values appear after errors
5. Flash messages work
6. Dropdown pre-selects correctly
7. Data actually appears in the database
8. Render deploy successful

---

# ⭐ READY FOR ACTION

If you want, I can now:

### ✔ Generate all missing files **exactly** as they should be

### ✔ Fill in your project with correct code

### ✔ Audit your existing code to prevent errors before submission

### ✔ Build a complete “Submission Checklist (Guaranteed Scoring)” document

Say:

**“Generate the code for Phase 1”**
or
**“Generate full Assignment 4 code.”**

