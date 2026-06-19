// Generate properly-escaped SQL INSERT from cases.json
const raw = require('../src/data/cases.json')
const cases = Array.isArray(raw) ? raw : raw.cases

function escape(s) {
  if (s === null || s === undefined) return "''"
  return "'" + String(s).replace(/'/g, "''") + "'"
}

function escapeJson(val) {
  return escape(JSON.stringify(val))
}

const rows = cases.map(c => {
  const suspectNames = c.suspects.map(s => s.name)
  const suspectArr = 'ARRAY[' + suspectNames.map(s => escape(s)).join(',') + ']::text[]'
  return `(
  ${escape(c.title)},
  ${escape(c.location)},
  ${escape(c.theme)},
  ${escape(c.synopsis)},
  ${escapeJson(c.clues)},
  ${escapeJson(c.suspects)},
  ${suspectArr},
  ${escape(c.solution || '')}::text,
  ${escape(c.answer_hint || '')}::text,
  ${c.difficulty || 2}
  )`
}).join(',\n')

const sql = `-- ============================================================
-- Casal Investigador GAME — Multiplayer Supabase Schema
-- ============================================================

-- Cases table
DROP TABLE IF EXISTS mp_cases CASCADE;
CREATE TABLE mp_cases (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  location       TEXT,
  theme          TEXT,
  synopsis       TEXT,
  clues          JSONB DEFAULT '[]',
  suspects       JSONB DEFAULT '[]',
  suspect_names  TEXT[],
  solution       TEXT,
  answer_hint    TEXT,
  difficulty     INTEGER DEFAULT 2
);

-- Rooms table
DROP TABLE IF EXISTS mp_rooms CASCADE;
CREATE TABLE mp_rooms (
  room_id        TEXT PRIMARY KEY,
  case_id        INTEGER DEFAULT 1,
  phase          TEXT DEFAULT 'lobby',
  phase_label    TEXT DEFAULT '🟢 Sala de Espera',
  host_id        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  players        JSONB DEFAULT '[]',
  votes          JSONB DEFAULT '{}',
  criminal_idx   INTEGER DEFAULT 0
);

-- ============================================================
-- Insert all ${cases.length} cases into mp_cases
-- ============================================================
INSERT INTO mp_cases (title, location, theme, synopsis, clues, suspects, suspect_names, solution, answer_hint, difficulty) VALUES
${rows};

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE mp_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE mp_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rooms" ON mp_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can insert rooms" ON mp_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rooms" ON mp_rooms FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete rooms" ON mp_rooms FOR DELETE USING (true);

CREATE POLICY "Anyone can read cases" ON mp_cases FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cases" ON mp_cases FOR INSERT WITH CHECK (true);
`

require('fs').writeFileSync('./supabase/migrations/001_multiplayer.sql', sql)
console.log(`Generated SQL with ${cases.length} cases`)
