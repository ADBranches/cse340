import bcrypt from 'bcryptjs';

async function generate() {
  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('CORRECT HASH for "password123":');
  console.log(hash);
}

generate().catch(console.error);
