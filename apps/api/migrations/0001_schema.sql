-- Users table (only stores hashed github ID, no PII)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Typing statistics
CREATE TABLE IF NOT EXISTS typing_stats (
  id TEXT PRIMARY KEY,
  user_hash TEXT NOT NULL,
  mode TEXT NOT NULL CHECK(mode IN ('test', 'lesson', 'speed', 'game')),
  wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  duration_s REAL NOT NULL,
  layout TEXT NOT NULL CHECK(layout IN ('en', 'tr')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_hash) REFERENCES users(id)
);

-- Vim game statistics
CREATE TABLE IF NOT EXISTS vim_stats (
  id TEXT PRIMARY KEY,
  user_hash TEXT NOT NULL,
  game TEXT NOT NULL,
  score INTEGER NOT NULL,
  keystrokes INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_hash) REFERENCES users(id)
);

-- Lesson progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  user_hash TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0, 1)),
  best_wpm INTEGER NOT NULL DEFAULT 0,
  best_acc INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_hash, lesson_id),
  FOREIGN KEY (user_hash) REFERENCES users(id)
);

-- Sessions for auth
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_hash) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_typing_stats_user ON typing_stats(user_hash);
CREATE INDEX IF NOT EXISTS idx_typing_stats_created ON typing_stats(created_at);
CREATE INDEX IF NOT EXISTS idx_vim_stats_user ON vim_stats(user_hash);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_hash);
