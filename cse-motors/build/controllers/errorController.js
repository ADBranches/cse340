/**
 * Linked from the footer: /cause-error
 */
export function triggerError(req, res, next) {
  next(new Error("This is a forced error from the footer link."));
}

/**
 * Global 500 error handler using layout.ejs
 */
export function handleError(err, req, res, next) {
  console.error("Global error:", err);

  res.status(500).render("layout", {
    title: "Server Error",
    view: "errors/500",
    message: err.message
  });
}
