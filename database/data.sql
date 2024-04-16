-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);
 insert into "classes"
 ("name","vigor","mind","endurance","strength","dexterity","intelligence","faith","arcane")
 values
 ('Vagabond',15,10,11,14,13,9,9,7),
 ('Warrior',11,12,11,10,16,10,8,9),
 ('Hero',14,9,12,16,9,7,8,11),
 ('Bandit',10,11,10,9,13,9,8,14),
 ('Astrologer',9,15,9,8,12,16,7,9),
 ('Prophet',10,14,8,11,10,7,16,10),
 ('Samurai',12,11,13,12,15,9,8,8),
 ('Prisoner',11,12,11,11,14,14,6,9),
 ('Confessor',10,13,10,12,12,9,14,9),
 ('Wretch',10,10,10,10,10,10,10,10);
