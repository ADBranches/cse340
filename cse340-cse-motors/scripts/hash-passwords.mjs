// scripts/hash-passwords.mjs
import bcrypt from "bcryptjs";

async function run() {
  const passwords = [
    "Cse340@Client!",
    "Cse340@Employee!",
    "Cse340@Admin!",
  ];

  for (const pwd of passwords) {
    const hash = await bcrypt.hash(pwd, 10);
    console.log(pwd, "->", hash);
  }
}

run().catch(console.error);

