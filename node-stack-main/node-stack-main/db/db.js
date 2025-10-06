import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
    filename: 'auth.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS auth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT
    );
  `);