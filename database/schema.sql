set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";
CREATE TABLE "classes" (
  "name" text,
  "vigor" integer,
  "mind" integer,
  "endurance" integer,
  "strength" integer,
  "dexterity" integer,
  "intelligence" integer,
  "faith" integer,
  "arcane" integer,
  "id" serial PRIMARY KEY
);

CREATE TABLE "builds" (
  "userId" serial PRIMARY KEY,
  "classId" serial,
  "buildName" text,
  "characterName" text,
  "vigor" integer,
  "mind" integer,
  "endurance" integer,
  "strength" integer,
  "dexterity" integer,
  "intelligence" integer,
  "faith" integer,
  "arcane" integer,
  "created_at" timestamp
);

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "username" text,
  "hashedPassword" text,
  "created_at" timestamp
);

ALTER TABLE "builds" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "builds" ADD FOREIGN KEY ("classId") REFERENCES "classes" ("id");
