import bcrypt from 'bcryptjs';

async function test() {
  const hash = '$2b$10$3x5j/Gd4AtRU69GD/wXS9ueFqDX6AIJwXhWqsIqx.wv2nmdYcf0gy';
  const password = 'password123';
  
  console.log('Testing hash comparison...');
  const result = await bcrypt.compare(password, hash);
  console.log('Result:', result);
  console.log(result ? '✅ SUCCESS: Hash matches password123' : '❌ FAILED: No match');
}

test().catch(err => console.error('Error:', err));
