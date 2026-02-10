Here’s a clean Week 05 **dev timeline** for CSE Motors – no code, just what to do, in what order, and **which files** touch each step.

---

## Phase 0 – Prep (Branch + Sanity Check)

**Goal:** Safe place to work, know current state.

* **Branch**

  * Create / continue feature branch: `week05-accounts`.
* **Files to skim**

  * `server.js`
  * `routes/accountRoute.js`
  * `controllers/accountController.js`
  * `models/account-model.js`
  * `views/account/login.ejs`
  * `views/account/register.ejs`
  * `views/account/management.ejs`
  * `utilities/account-validation.js` (or similar)
* **Check**

  * Login, registration, and account-management all work on localhost.
  * JWT + cookie already being set on login (from W04).

---

## Phase 1 – Header Behaviour (Task 1)

**Goal:** Header shows **My Account / Logout / Welcome Name** correctly when logged in or out. 

**Logic:** Use JWT decoded payload in `res.locals` (e.g. `res.locals.accountData`).

**Files**

* `views/partials/header.ejs`
* `server.js` (or a middleware file, e.g. `utilities/auth-middleware.js`) – to:

  * Read token cookie.
  * Verify JWT.
  * Put `account_id`, `account_firstname`, `account_type` into `res.locals`.

**To implement (high-level)**

* When **not logged in**:

  * Show **My Account** link only.
* When **logged in**:

  * Hide **My Account** link.
  * Show `Welcome <firstname>` link → points to account management route.
  * Show **Logout** link → will hit `/account/logout`.

**Test**

* Anonymous user: sees **My Account** only.
* Logged-in client / employee / admin: sees `Welcome Foo` + **Logout** only.
* Confirm via “View Source” that hidden links are truly not rendered.

---

## Phase 2 – Authorization Middleware for Inventory (Task 2)

**Goal:** Only Employee/Admin can access inventory admin processes (management, add/edit/delete). Public classification/detail stay open. 

**Files**

* `utilities/auth-middleware.js` (new or reuse):

  * e.g. `checkLogin`, `checkEmployeeOrAdmin`.
* `routes/inventoryRoute.js`

  * Apply middleware to `/inv`, `/inv/add-classification`, `/inv/add-inventory`, future edit/delete routes.
* `controllers/accountController.js`

  * For failures, render login with notice.

**To implement (high-level)**

* Middleware:

  * If no valid JWT → redirect/render login with “Please log in…” message.
  * If logged in but `account_type === 'Client'` → deny, show login or “Not authorized”.
* Do **not** protect:

  * `/inv/type/:classificationId`
  * `/inv/detail/:invId`

**Test**

* Client account: can see public vehicle listings & detail, but cannot reach `/inv/` (redirect to login).
* Employee/Admin: can reach `/inv/` and add forms.

---

## Phase 3 – Account Management View Enhancements (Task 3)

**Goal:** Management view changes based on account type + new “Update Account” link and inventory management link for staff. 

**Files**

* `views/account/management.ejs`
* `controllers/accountController.js`

  * `buildAccountManagement` (or equivalent) to:

    * Get account data (from `res.locals` or DB) and pass to view.

**View behaviour**

* Always:

  * `<h1>Account Management</h1>`
  * “You’re logged in.” text (or similar).
  * Link: **Edit Account Information** (update form) – passes `account_id` in URL.
* If `account_type === 'Client'`:

  * Show `<h2>Welcome <firstname></h2>` only.
  * **No** inventory management heading/link rendered.
* If `account_type === 'Employee' || 'Admin'`:

  * `<h2>Welcome <firstname></h2>`
  * `<h3>Inventory Management</h3>` + link **Manage Inventory** → `/inv/`.

**Test**

* Log in with sample **Client**: management has greeting + edit link, **no** inventory section.
* Log in with **Employee/Admin**: sees greeting + inventory section + link to `/inv/`.

---

## Phase 4 – Account Update View Skeleton (Task 4 – structure only)

**Goal:** Build the **Edit Account** page with two forms (update info + change password), no real logic yet. 

**Files**

* `views/account/update.ejs` (new)
* `routes/accountRoute.js`

  * `GET /account/edit/:accountId` → controller (no heavy logic yet).
* `controllers/accountController.js`

  * `buildAccountUpdateView(req, res)`:

    * Fetch account data by id (using existing model or placeholder).
    * Render `update.ejs` with:

      * title = “Edit Account”
      * current first name, last name, email.

**View sections**

1. **Shared top area**

   * `<h1>Edit Account</h1>`
   * notice / errors region.

2. **Form 1: Account Update**

   * Inputs: first name, last name, email (+ hidden `account_id`).
   * All fields required.
   * Sticky (values come from locals).

3. **Form 2: Change Password**

   * Input: new password (+ hidden `account_id`).
   * Text reminding requirements (min length, etc.).

**Test**

* From account management “Edit Account Information” link:

  * Arrive at update view.
  * Existing info pre-filled.
  * Both forms render, HTML validates.

---

## Phase 5 – Account Update & Password Change Logic (Task 5)

**Goal:** Fully functional update and password change processes with client- & server-side validation. 

**Files**

* `routes/accountRoute.js`

  * `POST /account/update` (account info).
  * `POST /account/update-password` (password change).
* `utilities/account-validation.js`

  * Add:

    * `updateAccountRules`
    * `updatePasswordRules`
    * `checkUpdateAccountData`
    * `checkUpdatePasswordData`
* `controllers/accountController.js`

  * `updateAccount`:

    * Validate post.
    * On error: re-render `update.ejs` with sticky fields + errors.
    * On success: call model update, refetch account, flash success/failure, render **management** view with updated data.
  * `updatePassword`:

    * Validate new password.
    * Hash password.
    * Call model to update; set success/failure flash; render **management** view.
* `models/account-model.js`

  * `getAccountById(account_id)` – parameterized `SELECT`.
  * `updateAccount(account_id, firstname, lastname, email)` – parameterized `UPDATE`.
  * `updatePassword(account_id, hashedPassword)` – parameterized `UPDATE`.

**Validation expectations**

* **Account update**:

  * Names: required, letters only (or similar).
  * Email: required, valid format, **unique** if changed.
* **Password**:

  * Same regex/rules as registration (min 12 chars, 1 upper, 1 number, 1 special, etc.).

**Test**

* Change only first name → see success message on management view and updated greeting.
* Change email to existing account email → server-side error, sticky values, no update.
* Set invalid password → errors shown, sticky fields in update view, no change.
* Valid password → password changed; hash present in DB; management view shows success.

---

## Phase 6 – Logout Flow (Task 6)

**Goal:** Proper logout clears cookie and returns to home; header switches back to logged-out state. 

**Files**

* `routes/accountRoute.js`

  * `GET /account/logout`
* `controllers/accountController.js`

  * `logoutAccount(req, res)`:

    * Clear JWT cookie.
    * Optionally flash “You have been logged out.”
    * Redirect to home `/`.
* `server.js` / middleware:

  * Ensure header logic reacts immediately once cookie gone.

**Test**

* While logged in, click **Logout**:

  * Browser redirected to home.
  * Cookie removed (check dev tools).
  * Header now shows **My Account** link, no “Welcome / Logout”.

---

## Phase 7 – Frontend & Validation Polish (Objectives 1, 5)

**Goal:** Match **Frontend Checklist** and validation rubric.

**Files**

* `views/account/management.ejs`
* `views/account/update.ejs`
* `views/partials/header.ejs`
* `views/inventory/management.ejs`
* `views/inventory/add-classification.ejs`
* `views/inventory/add-inventory.ejs`
* `public/css/styles.css` (minor tweaks as needed)

**Checklist**

* Proper headings (`h1`, `h2`, `h3`) hierarchy.
* Accessible labels for all form inputs.
* Helpful placeholder / helper text:

  * e.g. Make/Model placeholders “Min 3 characters”.
  * Password form text summarizing rules.
* Mobile-friendly layout (forms, buttons readable, not cramped).
* Error messages visually distinct (e.g. red text) but not screaming.
* Green-ish success notice for flash messages.

**Validation**

* Confirm client-side attributes (`required`, `minlength`, `pattern`, `type="email"`, etc.) are set.
* Confirm server-side validators match / strengthen these rules.
* Ensure all forms re-render with sticky values on validation errors.

---

## Phase 8 – Testing Matrix + Deployment & Submission (Objective 6)

**Goal:** Everything works locally & on Render; submission ready.

**Files / actions**

1. **Local Test Run**

   * Start server on localhost.
   * Test as:

     * Anonymous visitor.
     * Client account.
     * Employee account.
     * Admin account.
   * Flows:

     * Login / registration.
     * Header links.
     * Account management (with / without inventory section).
     * Edit account info: success & validation failure.
     * Change password: success & failure.
     * Inventory management: access control, add classification/vehicle.
     * Logout.

2. **Git Workflow**

   * `git status` → ensure clean.
   * `git add .`
   * `git commit -m "feat: week05 account update and inventory authorization"`
   * `git checkout main`
   * `git merge week05-accounts`
   * `git push origin main`

3. **Render**

   * Trigger manual deploy on the existing CSE Motors service.
   * After deploy, run the same test matrix on:

     * `https://cse340-1-ovr5.onrender.com/`

4. **Submission Package**

   * GitHub repo URL (subfolder path to `cse340-cse-motors`).
   * Render production URL.
   * Optional ZIP of `cse340-cse-motors/` (without `node_modules`).

---

If you like, next step we can turn **Phase 1 only** into concrete edits (picking up your current `header.ejs`, `server.js`, etc.) and do it piece by piece, so each phase stays tidy and aligned with this plan.

