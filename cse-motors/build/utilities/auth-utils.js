// utilities/auth-utils.js
import bcrypt from "bcryptjs";

/**
 * Generate a password hash (used at registration or reset)
 */
export async function hashPassword(plainText) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Compare user-entered password with stored hash
 */
export async function verifyPassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}
