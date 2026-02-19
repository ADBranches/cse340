// controllers/testdriveController.js
import testdriveModel from "../models/testdrive-model.js";
import inventoryModel from "../models/inventory-model.js";

/**
 * GET /test-drive/request/:invId
 * Show the test drive request form for a specific vehicle.
 */
export async function buildTestdriveForm(req, res, next) {
  try {
    const invId = Number.parseInt(req.params.invId, 10);

    if (Number.isNaN(invId)) {
      const err = new Error("Invalid vehicle id for test drive.");
      err.status = 400;
      return next(err);
    }

    const vehicle = await inventoryModel.getInventoryById(invId);

    if (!vehicle) {
      const err = new Error("Vehicle not found for test drive.");
      err.status = 404;
      return next(err);
    }

    const title = `Request Test Drive – ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;

    return res.render("testdrive/request", {
      title,
      vehicle,
      errors: [], // no validation errors on first load
      testdriveData: {
        preferred_date: "",
        preferred_time: "",
        contact_phone: "",
        message: "",
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /test-drive/request/:invId
 * Process a valid test drive request.
 * (Validation has already run before this handler.)
 */
export async function processTestdriveRequest(req, res, next) {
  try {
    const invId = Number.parseInt(req.params.invId, 10);

    if (Number.isNaN(invId)) {
      const err = new Error("Invalid vehicle id for test drive.");
      err.status = 400;
      return next(err);
    }

    const account = res.locals.accountData;

    if (!account) {
      // Should already be protected by checkLogin, but guard again
      req.flash("notice", "Please log in to request a test drive.");
      return res.redirect("/account/login");
    }

    const { preferred_date, preferred_time, contact_phone, message } = req.body;

    const request = await testdriveModel.createTestdriveRequest({
      inv_id: invId,
      account_id: account.account_id,
      preferred_date,
      preferred_time,
      contact_phone,
      message,
    });

    if (!request) {
      // Unexpected DB failure – re-render form with sticky data
      const vehicle = await inventoryModel.getInventoryById(invId);
      const title = vehicle
        ? `Request Test Drive – ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
        : "Request Test Drive";

      req.flash("notice", "Sorry, your test drive request could not be saved.");

      return res.status(500).render("testdrive/request", {
        title,
        vehicle,
        errors: [{ msg: "Unexpected error saving request. Please try again." }],
        testdriveData: { preferred_date, preferred_time, contact_phone, message },
      });
    }

    req.flash("notice", "Your test drive request has been submitted.");
    return res.redirect(`/inv/detail/${invId}`);
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /test-drive/manage
 * Management view of all test drive requests.
 */
export async function buildTestdriveManagement(req, res, next) {
  try {
    const requests = await testdriveModel.getAllRequests();

    return res.render("testdrive/management", {
      title: "Test Drive Requests",
      requests,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /test-drive/update-status
 * Simple status update (Pending -> Confirmed, etc.)
 */
export async function updateTestdriveStatus(req, res, next) {
  try {
    const { testdrive_id, status } = req.body;

    const updated = await testdriveModel.updateTestdriveStatus(
      Number(testdrive_id),
      status
    );

    if (!updated) {
      req.flash("notice", "Could not update test drive status.");
    } else {
      req.flash("notice", "Test drive status updated.");
    }

    return res.redirect("/test-drive/manage");
  } catch (error) {
    return next(error);
  }
}
