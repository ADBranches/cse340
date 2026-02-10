// controllers/accountController.js
import accountModel from "../models/account-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Render the login view
export async function buildLoginView(req, res, next) {
  try {
    return res.render("account/login", {
      title: "Login",
      // sticky email (will usually be empty on first load)
      account_email: "",
    });
  } catch (error) {
    return next(error);
  }
}

// Process login form, create JWT, set cookie
export async function processLogin(req, res, next) {
  try {
    const { account_email, account_password } = req.body;
    console.log("[LOGIN] payload:", account_email);

    // Look up account (includes password hash)
    const account = await accountModel.getAccountByEmail(account_email);
    console.log("[LOGIN] account from DB:", account);

    if (!account) {
      req.flash("notice", "Invalid email or password.");
      return res.status(400).render("account/login", {
        title: "Login",
        errors: [{ msg: "Invalid email or password." }],
        account_email, // sticky
      });
    }

    // Compare password with stored hash
    const passwordMatch = await bcrypt.compare(
      account_password,
      account.account_password
    );
    console.log("[LOGIN] passwordMatch:", passwordMatch);

    if (!passwordMatch) {
      req.flash("notice", "Invalid email or password.");
      return res.status(400).render("account/login", {
        title: "Login",
        errors: [{ msg: "Invalid email or password." }],
        account_email, // sticky
      });
    }

    // Build JWT payload
    const payload = {
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_type: account.account_type,
    };

    // Sign JWT
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Set httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    req.flash("notice", "You are now logged in.");
    return res.redirect("/account");
  } catch (error) {
    console.error("[LOGIN] error:", error);
    req.flash("notice", "Sorry, there was a problem logging you in.");
    return res.status(500).render("account/login", {
      title: "Login",
      errors: [{ msg: "Unexpected error. Please try again." }],
      account_email: req.body.account_email,
    });
  }
}

/**
 * Builds the Account Management view.
 * Uses account data attached in res.locals.accountData by auth-middleware.
 */
export async function buildAccountManagement(req, res, next) {
  try {
    const account = res.locals.accountData;

    if (!account) {
      // Should normally be protected by checkLogin, but guard anyway.
      req.flash("notice", "Please log in to view your account.");
      return res.redirect("/account/login");
    }

    const title = "Account Management";

    return res.render("account/management", {
      title,
      account,
    });
  } catch (error) {
    return next(error);
  }
}

export async function buildAccountUpdateView(req, res, next) {
  try {
    const accountId = Number.parseInt(req.params.accountId, 10);

    if (Number.isNaN(accountId)) {
      req.flash("notice", "Invalid account id.");
      return res.redirect("/account");
    }

    const account = await accountModel.getAccountById(accountId);

    if (!account) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account");
    }

    const title = "Edit Account";

    return res.render("account/update", {
      title,
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAccount(req, res, next) {
  try {
    const {
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    } = req.body;

    const updated = await accountModel.updateAccount(
      Number(account_id),
      account_firstname,
      account_lastname,
      account_email
    );

    if (!updated) {
      req.flash("notice", "Sorry, your account could not be updated.");
      return res.redirect(`/account/edit/${account_id}`);
    }

    // Ensure this response sees the updated name in the header
    res.locals.accountData = {
      account_id: updated.account_id,
      account_firstname: updated.account_firstname,
      account_type: updated.account_type,
    };

    req.flash("notice", "Account information updated successfully.");

    return res.render("account/management", {
      title: "Account Management",
      account: updated,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { account_id, account_password } = req.body;

    const hashedPassword = await bcrypt.hash(account_password, 10);
    const rowCount = await accountModel.updatePassword(
      Number(account_id),
      hashedPassword
    );

    if (rowCount !== 1) {
      req.flash("notice", "Sorry, your password could not be updated.");
    } else {
      req.flash("notice", "Password updated successfully.");
    }

    // Reload account for the management view
    const account = await accountModel.getAccountById(Number(account_id));

    // Ensure header welcome name is consistent for this response
    if (account) {
      res.locals.accountData = {
        account_id: account.account_id,
        account_firstname: account.account_firstname,
        account_type: account.account_type,
      };
    }

    return res.render("account/management", {
      title: "Account Management",
      account,
    });
  } catch (error) {
    return next(error);
  }
}

export async function logoutAccount(req, res, next) {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt");

    // Optional notice
    req.flash("notice", "You have been logged out.");

    // Back to home
    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
}
