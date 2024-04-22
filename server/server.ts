/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import {
  authMiddleware,
  ClientError,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';
import { nextTick } from 'node:process';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());
const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword")
      values ($1, $2)
      returning *
    `;
    const params = [username, hashedPassword];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "id",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { id, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { id, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.get('/api/classes', async (req, res, next) => {
  try {
    const sql = `
    select *
    from "classes"
    order by "id"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/class/:id', async (req, res, next) => {
  try {
    const classId = Number(req.params.id);
    const sql = `
    select "vigor","mind","endurance","strength","dexterity","intelligence","faith","arcane"from "classes"
    where "id"=$1

    `;
    const params = [classId];
    const result = await db.query(sql, params);
    const selectedClass = result.rows[0];
    res.json(selectedClass);
  } catch (err) {
    next(err);
  }
});

app.get('/api/builds/', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ClientError(401, 'not logged in');
    }
    const sql = `
  select "buildName","characterName","vigor","mind","endurance","strength","dexterity","intelligence","faith","arcane" from "builds"
  where "userId"=$1
  order by "id" desc;

  `;
    const params = [Number(req.user.id)];
    const result = await db.query(sql, params);
    const userBuilds = result.rows;
    res.json(userBuilds);
  } catch (err) {
    next(err);
  }
});

app.get('/api/builds/:id', async (req, res, next) => {
  try {
    const buildId = Number(req.params.id);
    const sql = `
  select * from "builds"
  where "id" =$1
  `;
    const params = [buildId];
    const result = await db.query(sql, params);
    const selectedBuild = result.rows[0];
    res.json(selectedBuild);
  } catch (err) {
    next(err);
  }
});

app.post('/api/builds', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ClientError(401, 'not logged in');
    }
    const build = req.body;
    const sql = `
      insert into "builds" ("userId","classId","buildName","characterName","vigor","mind","endurance","strength","dexterity","intelligence","faith","arcane")
      values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      returning *
      `;

    const params = [
      Number(req.user.id),
      Number(build['class-name']),
      build['build-name'],
      build['character-name'],
      build.vigor,
      build.mind,
      build.endurance,
      build.strength,
      build.dexterity,
      build.intelligence,
      build.faith,
      build.arcane,
    ];
    const result = await db.query(sql, params);
    const [newBuild] = result.rows;
    res.status(201).json(newBuild);
  } catch (err) {
    next(err);
  }
});

app.put('/api/builds/:id', async (req, res, next) => {
  try {
    const buildId = Number(req.params.id);
    const build = req.body;
    const sql = `
    update "builds"
    set "classId"=$1,
    "buildName"=$2,
    "characterName"=$3,
    "vigor"=$4,
    "mind"=$5,
    "endurance"=$6,
    "strength"=$7,
    "dexterity"=$8,
    "intelligence"=$9,
    "faith"=$10,
    "arcane"=$11
    where "id"=$12
    returning *
  `;
    const params = [
      Number(build.classId),
      build.buildName,
      build.characterName,
      build.vigor,
      build.mind,
      build.endurance,
      build.strength,
      build.dexterity,
      build.intelligence,
      build.faith,
      build.arcane,
      buildId,
    ];
    const result = await db.query(sql, params);
    const updatedBuild = result.rows[0];
    res.json(updatedBuild);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/builds/:id', async (req, res, next) => {
  try {
    const buildId = req.params.id;
    const sql = `
    delete from "builds"
    where "id"=$1
    returning *
    `;
    const params = [buildId];
    const result = await db.query(sql, params);
    if (!result.rows[0]) {
      throw new ClientError(404, 'Referenced Build ID was not found.');
    }
    const deletedBuild = result.rows[0];
    res.json(deletedBuild);
  } catch (err) {
    next(err);
  }
});
/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
