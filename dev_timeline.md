
---

## Phase 0 – Read & Understand (planning only)

**No project files yet.**
You’re only working with the PDFs / Canvas pages to understand requirements.

---

## Phase 1 – Project Boot-Up & Skeleton Check

**Root directory (project root):**

* `package.json`

  * Verify scripts (start, dev, etc.) and dependencies.

* `server.js` **or** `app.js` (whichever your starter uses)

  * Confirm the main Express entry file exists and boots the app.

* `.gitignore`

  * Make sure `node_modules/` is ignored.

* `README.md`

  * Ensure it exists (you’ll finalize content in Phase 5).

**Structure check (no deep edits yet), just confirm these exist:**

* `routes/`

  * `routes/index.js`

* `views/`

  * `views/layout.ejs`
  * `views/partials/`

    * `views/partials/head.ejs`
    * `views/partials/header.ejs`
    * `views/partials/nav.ejs`
    * `views/partials/footer.ejs`
  * `views/index.ejs`

* `public/`

  * `public/css/`

    * `public/css/styles.css` (create if missing)
  * `public/images/`

    * (all provided images like `delorean.png`, `flux-capacitor.png`, etc.)

**Milestone:**
Everything above **exists** in the structure and the app runs (`npm install && npm start`).

---

## Phase 2 – Mobile-First Home View (Core Content & Layout)

Here you **actively edit** the core view files and base CSS.

**Views directory:**

* `views/layout.ejs`

  * Make sure it correctly wraps pages and includes the partials.

* `views/partials/head.ejs`

  * Ensure `<meta>` tags, `<title>`, and CSS link (will refine in Phase 3).

* `views/partials/header.ejs`

  * Ensure branding / logo area content is correct.

* `views/partials/nav.ejs`

  * Ensure nav items (Home, Custom, etc.) are present with correct structure.

* `views/partials/footer.ejs`

  * Basic footer text, year, etc.

* `views/index.ejs`  ✅ **Main focus this phase**

  * Insert all CSE Motors home content:

    * Hero area text + image placeholders.
    * Reviews section container.
    * Upgrades grid container.
  * Use semantic structure (`main`, `section`, etc.).

**Public assets:**

* `public/css/styles.css`  ✅ **Main focus this phase**

  * Base **mobile-first styles** for:

    * Body text, headings, buttons.
    * Stacked layout for hero, reviews, upgrades.

* `public/images/`

  * Confirm correct filenames are referenced from `index.ejs` (no edits to images themselves, just ensure paths used in `src` are valid).

**Routes directory:**

* `routes/index.js`

  * Confirm that the `/` route renders `index.ejs` via the layout.

**Milestone:**
On a **narrow** screen, `/` renders correctly and is styled mobile-first using `public/css/styles.css`.

---

## Phase 3 – Large Screen Layout & Responsiveness

Same core files, but now focusing especially on **responsive behavior** and media queries.

**Views (small tweaks only where necessary):**

* `views/index.ejs`

  * Minor structural adjustments to support side-by-side layout on large screens (no new files, just maybe extra classNames or wrapper `<div>`s).
* `views/partials/head.ejs`

  * Ensure CSS link tag has `media="screen"` attribute.
  * Ensure viewport `<meta>` is correct.

**Public CSS:**

* `public/css/styles.css`  ✅ **Main focus this phase**

  * Add **media queries**:

    * `@media (min-width: ...) { ... }` for large layout.
  * Implement:

    * Hero: split text/image horizontally on large screens.
    * Upgrades: multi-column grid.
    * Reviews: any large-screen layout refinements.

No new directories in this phase — just updates to **already existing files**.

**Milestone:**
Resizing browser window from mobile → desktop shows smooth layout changes, rooted in `public/css/styles.css`.

---

## Phase 4 – Accessibility, Validation & Final Polish

You’re tightening semantics and fixing any issues reported by WAVE / validators.

**Views:**

* `views/index.ejs`

  * Fix headings structure (`h1`, `h2` order).
  * Ensure every `<img>` tag has appropriate `alt` text.
  * Fix any empty links or non-descriptive link text.

* `views/layout.ejs`

  * Confirm `lang` attribute on `<html>` if defined here.
  * Confirm `<main>` wrap if needed.

* `views/partials/head.ejs`

  * Tidy `<title>`, `<meta>` description and viewport.

* `views/partials/nav.ejs`

  * Ensure nav is semantic (`<nav>`, `<ul>`, `<li>`, `<a>`).

* `views/partials/footer.ejs`

  * If WAVE shows contrast or structure issues, fix here.

**Public CSS:**

* `public/css/styles.css`

  * Adjust colors to fix contrast errors.
  * Adjust font sizes / line-height for readability.
  * Ensure no rules cause horizontal scroll or weird overflow.

**Milestone:**
Running WAVE and HTML/CSS validators against `/` shows **no accessibility or validity errors**.

---

## Phase 5 – GitHub, Render Deployment, & Submission

Now it’s about deployment + docs.

**Root:**

* `README.md`  ✅ **Main focus this phase**

  * Update with:

    * Project name.
    * Local run instructions.
    * Link(s) to Render deployment.
    * Short description of CSE Motors home view.

* `render.yaml` (if your starter uses Render config here)

  * Confirm build and start commands.
  * Confirm root directory is correct.

* `.gitignore`

  * Final check that `node_modules/` and any local environment files are ignored.

**Version control & hosting (no new project dirs, just actions):**

* Git repository (same project root)

  * Commit all changes across:

    * `views/`
    * `views/partials/`
    * `public/css/styles.css`
    * `public/images/` references
    * `routes/index.js`
    * `README.md`
    * `render.yaml` (if present)

* Render service

  * Point to this GitHub repo or existing Render service.
  * Verify deployed site uses the same file structure and renders `/` correctly.

**Milestone:**

* GitHub repo is up-to-date with **all** files above.
* Render URL loads CSE Motors home page with your finished layout.
* You submit:

  * GitHub URL
  * Render URL

---