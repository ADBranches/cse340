// controllers/errorController.js

/**
 * Intentional test error for Assignment 3.
 * Triggered from the footer link at /error-test.
 * This will be caught by the global error middleware (Phase 6)
 * and rendered by views/errors/error.ejs.
 */
export function triggerTestError(req, res, next) {
  const err = new Error("Intentional test error from footer link.");
  err.status = 500;
  // Passing the error into the global error-handling middleware
  next(err);
}
