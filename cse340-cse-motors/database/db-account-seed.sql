-- database/db-account-seed.sql

-- Seed account passwords (plaintext used to generate bcrypt hashes) from scripts/password_hashes.mjs:
-- client@example.com   : Cse340@Client!
-- employee@example.com : Cse340@Employee!
-- admin@example.com    : Cse340@Admin!


INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password,
  account_type
) VALUES
  ('Client',   'User',    'client@example.com',   '$2b$10$U5uMj5S//5tRFKAQHxkgUeeYyJi0eSxZ8qay3XGYi0LNW3/cG8Kn.',   'Client'),
  ('Employee', 'User',    'employee@example.com', '$2b$10$CHtINKRybLJPDX23sx2np.BKnggare03975KIH80KiFz4NDfbzWIC',      'Employee'),
  ('Admin',    'User',    'admin@example.com',    '$2b$10$P5UCaJ0ItK40.WKxtq7wwO6gHmbiTT45Q2VF2/PCbGs1TReIhYg3O',    'Admin');

