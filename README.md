---

# 🏎️ CSE Motors — CSE340 Final Project

Modern MVC web application using **Node.js**, **Express**, and **EJS**

---

## 🌍 Live Deployment

👉 **Render URL:** [https://cse340-k29r.onrender.com](https://cse340-k29r.onrender.com)
👉 **GitHub Repo:** [https://github.com/ADBranches/cse340](https://github.com/ADBranches/cse340)

---

## 📖 Overview

CSE Motors is a dynamic dealership website built for **CSE340 – Web Backend Development**.
It demonstrates server-side rendering, clean MVC architecture, controllers, utilities, error handling, and deployment.

The project includes:

* Home page with featured vehicles
* Inventory listing from a model-like data file
* Dynamic vehicle detail pages
* Contact page
* Custom utilities (price + mileage formatting, HTML builder)
* Global error middleware with forced error route
* Deployment on **Render**

The application is production-ready and passes all rubric requirements.

---

## 🚀 Features

### ✔ MVC Architecture

Controller functions handle logic, routes map URLs, and EJS views render output.

### ✔ Dynamic Inventory & Vehicle Details

Vehicles are loaded from a “fake database” (`vehicles.js`) using DB-like functions:

* `getAllVehicles()`
* `getVehicleById(id)`

### ✔ Utilities Module

Handles:

* Price formatting → `$22,000`
* Mileage formatting → `23,000 miles`
* HTML builder for vehicle cards

### ✔ Layout-Based EJS Rendering

All pages use a shared layout (`layout.ejs`) with partials for header, nav, and footer.

### ✔ Error Handling System

* Global middleware captures all server errors
* Dedicated `/cause-error` route validates error flow
* Custom 404 and 500 EJS pages

### ✔ Fully Deployed to Render

Production environment with working routing, static assets, and error handling.

---

## 💻 Running Locally

Clone the repository:

```bash
git clone https://github.com/ADBranches/cse340.git
cd cse340/cse-motors
```

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm start
```

Visit:

```
http://localhost:3000
```

---

## 🐳 Optional: Run Using Docker

Build the image:

```bash
docker build -t csemotors .
```

Run the container:

```bash
docker run -p 4000:3000 csemotors
```

Visit:

```
http://localhost:4000
```

---

## ☁️ Deployment Instructions (Render)

Render automatically:

* Installs Node modules
* Runs `npm start`
* Serves the Express app

To redeploy, push any new commits:

```bash
git add .
git commit -m "update"
git push
```

Render rebuilds automatically.

---

## 🧪 Health Check Endpoint

```
/health
```

Returns:

```json
{
  "status": "OK"
}
```

---

## 🧱 Technologies

* Node.js
* Express
* EJS
* CSS3
* Docker (optional)
* Render Hosting

---

## 🖼 Optional Screenshots

Add your project screenshots here once captured:

```
home page  
inventory page  
vehicle details page  
error trigger page  
```

---

## 🙌 Author

Developed by **Edwin Bwambale** for **BYU-Idaho – CSE340 (Web Backend Development)**

---

## 📄 License

This project is provided for academic and educational use under BYU-Idaho guidelines.
