-- CSE 340 - Assignment 2: Complete Your Database
-- this is task One: Six SQL queries for CRUD + JOIN practice.
-- this script to be run against our Render database AFTER db-sql-code.sql.

 
-- 1. Inserting Tony Stark into the account table
--    NOT including account_id or account_type;
--    they use defaults.
 
INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

 
-- 2. Changing Tony Stark's account_type to 'Admin'
--    Using the primary key (account_id) in the WHERE.
 
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = (
  SELECT account_id
  FROM public.account
  WHERE account_email = 'tony@starkent.com'
  LIMIT 1
);

-- 3. Deleting the Tony Stark record
--    Again, using account_id in the WHERE.
 
DELETE FROM public.account
WHERE account_id = (
  SELECT account_id
  FROM public.account
  WHERE account_email = 'tony@starkent.com'
  LIMIT 1
);

-- 4. Modifying the "GM Hummer" description
--    Changing "small interiors" -> "a huge interior"
--    using REPLACE in a single UPDATE.
UPDATE public.inventory
SET inv_description = REPLACE(
      inv_description,
      'small interiors',
      'a huge interior'
    )
WHERE inv_id = (
  SELECT inv_id
  FROM public.inventory
  WHERE inv_make = 'GM'
    AND inv_model = 'Hummer'
  LIMIT 1
);

-- 5. INNER JOIN:
--    Selecting make, model (inventory)
--    and classification_name (classification)
--    for vehicles in the "Sport" category.
SELECT
  i.inv_make,
  i.inv_model,
  c.classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Updating all image paths to insert "/vehicles"
--    into the inv_image and inv_thumbnail fields.
--    Example result: /images/vehicles/a-car-name.webp
--    Using a single UPDATE with REPLACE.
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
