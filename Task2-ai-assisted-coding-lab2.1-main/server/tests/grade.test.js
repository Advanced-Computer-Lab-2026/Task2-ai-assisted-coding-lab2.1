import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { Rating } from '../src/models/Rating.js';
import { graded, printReport } from './rubric.js';

const BASE = '/api/ratings';
const REQUEST_TIMEOUT_MS = 5000;

// Each run uses its own throwaway database on the MONGO_URI cluster, so parallel
// runs never touch each other's data. The shared account is not allowed to drop
// a database, so cleanup drops the run's collections instead: a MongoDB
// database with no collections no longer exists. A run that dies before its
// cleanup leaves its database behind, so every run first sweeps grade_
// databases older than STALE_AFTER_MS, dated by the timestamp in their name.
const RUN_DB = `grade_${process.env.GITHUB_RUN_ID || 'local'}_${Date.now()}_${randomBytes(3).toString('hex')}`;
const GRADE_DB = /^grade_[^_]+_(\d{13})_[0-9a-f]{6}$/;
const STALE_AFTER_MS = 60 * 60 * 1000;

async function dropAllCollections(db) {
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  for (const { name } of collections) {
    await db.dropCollection(name).catch(() => {});
  }
}

async function sweepStaleRunDatabases() {
  const client = mongoose.connection.getClient();
  const { databases } = await client.db().admin().listDatabases({ nameOnly: true });
  const cutoff = Date.now() - STALE_AFTER_MS;
  for (const { name } of databases) {
    const match = GRADE_DB.exec(name);
    if (match && Number(match[1]) < cutoff) await dropAllCollections(client.db(name));
  }
}

beforeAll(async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set (see README "Database connection")');
  await mongoose.connect(process.env.MONGO_URI, { dbName: RUN_DB, autoIndex: true, maxPoolSize: 2 });
  await sweepStaleRunDatabases().catch((err) => console.warn('Stale grade_ database sweep skipped:', err.message));
  await Rating.init();
}, 60000);

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  printReport();
  if (mongoose.connection.readyState === 1) {
    await dropAllCollections(mongoose.connection.db).catch(() => {});
  }
  await mongoose.disconnect();
});

// ---------- helpers ----------

const api = {
  get: (path) => request(app).get(path).timeout(REQUEST_TIMEOUT_MS),
  post: (path, body) => request(app).post(path).send(body).timeout(REQUEST_TIMEOUT_MS)
};

const newId = () => new mongoose.Types.ObjectId().toString();
const idOf = (doc) => String(doc?._id ?? doc?.id);

function seed(overrides = {}) {
  return Rating.create({
    bookCode: 'BK101',
    rating: 4,
    note: 'Seeded entry',
    ratedBy: newId(),
    ...overrides
  });
}

function numericOption(path, key) {
  const value = path?.options?.[key];
  return Array.isArray(value) ? value[0] : value;
}

// ---------- graded checks ----------

graded('model_fields', async () => {
  const schema = Rating.schema;
  const own = Object.keys(schema.paths)
    .filter((p) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(p))
    .sort();
  expect(own).toEqual(['bookCode', 'rating', 'note', 'ratedBy'].sort());
  expect(schema.path('bookCode').instance).toBe('String');
  expect(schema.path('rating').instance).toBe('Number');
  expect(schema.path('note').instance).toBe('String');
  expect(schema.path('ratedBy').instance).toBe('ObjectId');
  expect(schema.path('ratedBy').options.ref).toBe('User');
});

graded('model_rules', async () => {
  const schema = Rating.schema;
  expect(schema.path('bookCode')?.isRequired).toBe(true);

  const rating = schema.path('rating');
  expect(rating?.isRequired).toBe(true);
  expect(numericOption(rating, 'min')).toBe(1);
  expect(numericOption(rating, 'max')).toBe(5);

  expect(Boolean(schema.path('note')?.isRequired)).toBe(false);
  expect(Boolean(schema.path('ratedBy')?.isRequired)).toBe(false);
});

graded('unique_index', async () => {
  const schema = Rating.schema;
  expect(schema.path('createdAt')).toBeDefined();
  expect(schema.path('updatedAt')).toBeDefined();

  const compoundUnique = schema
    .indexes()
    .filter(([fields, options]) => Object.keys(fields).length > 1 && options?.unique === true);
  expect(compoundUnique).toHaveLength(1);
  expect(compoundUnique[0][0]).toEqual({ bookCode: 1, ratedBy: 1 });
});

graded('create', async () => {
  const payload = {
    bookCode: 'BK101',
    rating: 4,
    note: 'Clear and useful',
    ratedBy: newId()
  };
  const res = await api.post(BASE, payload);
  expect(res.status).toBe(201);
  expect(res.body.rating).toBeDefined();
  expect(res.body.rating.bookCode).toBe('BK101');
  expect(res.body.rating.rating).toBe(4);

  const stored = await Rating.findById(idOf(res.body.rating)).lean();
  expect(stored).not.toBeNull();
  expect(stored.bookCode).toBe('BK101');
  expect(stored.rating).toBe(4);
  expect(stored.note).toBe('Clear and useful');
  expect(String(stored.ratedBy)).toBe(payload.ratedBy);
});

graded('list', async () => {
  const a = await seed({ rating: 5 });
  const b = await seed({ bookCode: 'BK202', rating: 2 });

  const res = await api.get(BASE);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.ratings)).toBe(true);
  expect(res.body.ratings).toHaveLength(2);
  const ids = res.body.ratings.map(idOf).sort();
  expect(ids).toEqual([a._id.toString(), b._id.toString()].sort());
});

graded('get_one', async () => {
  const doc = await seed();

  const res = await api.get(`${BASE}/${doc._id}`);
  expect(res.status).toBe(200);
  expect(idOf(res.body.rating)).toBe(doc._id.toString());
  expect(res.body.rating.bookCode).toBe('BK101');

  const missing = await api.get(`${BASE}/${newId()}`);
  expect(missing.status).toBe(404);
  expect(missing.body).toEqual({ message: 'Rating not found' });
});

graded('summary', async () => {
  await seed({ rating: 5 });
  await seed({ rating: 4 });
  await seed({ rating: 3 });
  await seed({ bookCode: 'BK202', rating: 1 });

  const spy = jest.spyOn(Rating, 'aggregate');
  try {
    const res = await api.get(`${BASE}/summary?bookCode=BK101`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ bookCode: 'BK101', averageRating: 4, ratingCount: 3 });
    expect(spy).toHaveBeenCalled();

    const empty = await api.get(`${BASE}/summary?bookCode=BK999`);
    expect(empty.status).toBe(200);
    expect(empty.body).toEqual({ bookCode: 'BK999', averageRating: 0, ratingCount: 0 });
  } finally {
    spy.mockRestore();
  }
});

graded('summary_query', async () => {
  await seed();

  // /summary must be its own route, not swallowed by /:id.
  const summary = await api.get(`${BASE}/summary?bookCode=BK101`);
  expect(summary.status).toBe(200);
  expect(summary.body.bookCode).toBe('BK101');

  const noQuery = await api.get(`${BASE}/summary`);
  expect(noQuery.status).toBe(400);
  expect(noQuery.body).toEqual({ message: 'bookCode is required' });
});
