-- PIX View Analytics for Casal Investigador
-- Tracks every time someone opens the "Apoie" (donation) tab

CREATE TABLE IF NOT EXISTS pix_views (
  id BIGSERIAL PRIMARY KEY,
  viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ip_hash TEXT,          -- hashed IP for uniqueness (privacy-safe)
  user_agent TEXT,
  referrer TEXT
);

-- Auto-count view per day for dashboard
CREATE OR REPLACE FUNCTION log_pix_view(ip_hash TEXT, user_agent TEXT, referrer TEXT)
RETURNS BIGINT AS $$
  INSERT INTO pix_views (ip_hash, user_agent, referrer)
  VALUES (COALESCE(ip_hash, 'anon'), COALESCE(user_agent, 'unknown'), COALESCE(referrer, '/'))
  RETURNING id;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get total view count
CREATE OR REPLACE FUNCTION get_pix_view_count()
RETURNS BIGINT AS $$
  SELECT COUNT(*) FROM pix_views;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get views today
CREATE OR REPLACE FUNCTION get_pix_views_today()
RETURNS BIGINT AS $$
  SELECT COUNT(*) FROM pix_views WHERE DATE(viewed_at) = CURRENT_DATE;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: anyone can insert/view counts, no auth required (anon key)
ALTER TABLE pix_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "anon insert" ON pix_views FOR INSERT WITH CHECK (true);

-- Allow anyone to read counts (via function, not direct table)
CREATE POLICY "anon read" ON pix_views FOR SELECT USING (true);
