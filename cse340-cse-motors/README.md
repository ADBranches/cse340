# CSE Motors – CSE 340 Home View

This project is the CSE Motors application for CSE 340.  
It implements a mobile-first, responsive home view using Express and EJS and is deployed to Render.

## Project Structure

- `server.js` — Express entry file (ESM), configures view engine and routes
- `routes/index.js` — route for `/` that renders the home view
- `views/layout.ejs` — base layout with header, nav, main, and footer
- `views/partials/` — shared partials:
  - `head.ejs` — `<head>` content, meta tags, CSS
  - `header.ejs` — site title and tagline
  - `nav.ejs` — main navigation
  - `footer.ejs` — footer content
- `views/index.ejs` — CSE Motors home view (hero, reviews, upgrades)
- `public/css/styles.css` — mobile-first and responsive styles
- `public/images/` — site, upgrade, and vehicle images

## Local Development

### Prerequisites

- Node.js (v18+ recommended)
- npm (or pnpm/yarn if you prefer)

### Install dependencies

From the `cse340-cse-motors` folder:

```bash
npm install
