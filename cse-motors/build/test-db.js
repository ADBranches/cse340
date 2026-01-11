// test-db.js
import pool from './utilities/db.js';

async function testConnection() {
  try {
    const result = await pool.query('SELECT account_id, account_firstname FROM account LIMIT 1');
    console.log('✅ Database connection successful!');
    console.log('Sample account:', result.rows[0]);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
