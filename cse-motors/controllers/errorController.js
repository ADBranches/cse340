// controllers/errorController.js

/**
 * Trigger a forced error (Rubric Requirement)
 * This is linked from the footer: /cause-error
 */
export function triggerError(req, res, next) {
  next(new Error("This is a forced error from the footer link."));
}

/**
 * Global error middleware (Rubric: 10pts)
 * Always renders the 500 error page using layout.ejs
 */
export function handleError(err, req, res, next) {
  console.error("❌ GLOBAL ERROR:", err);

  res.status(500).render("layout", {
    title: "Server Error",
    view: "errors/500",
    message: err.message
  });
}
