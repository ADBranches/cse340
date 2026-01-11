import bcrypt from 'bcryptjs';

async function test() {
  console.log('Testing bcryptjs...');
  
  const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMye.ML7rQh1F.8R4yB8L5Cw6XUcYzJ7tW2';
  const password = 'password123';
  
  console.log('Hash:', hash.substring(0, 30) + '...');
  console.log('Password:', password);
  
  const result = await bcrypt.compare(password, hash);
  console.log('Compare result:', result);
}

test().catch(err => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
});
