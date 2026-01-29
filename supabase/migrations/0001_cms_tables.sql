-- Influencers Table
CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  subs TEXT NOT NULL,
  focus TEXT NOT NULL,
  metric TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Games Table
CREATE TABLE IF NOT EXISTS portfolio_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  stats TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market Stats Table
CREATE TABLE IF NOT EXISTS market_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  detail TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  is_highlighted BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global Site Content Table
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public influencers are viewable by everyone" ON influencers FOR SELECT USING (true);
CREATE POLICY "Public portfolio_games are viewable by everyone" ON portfolio_games FOR SELECT USING (true);
CREATE POLICY "Public market_stats are viewable by everyone" ON market_stats FOR SELECT USING (true);
CREATE POLICY "Public site_content are viewable by everyone" ON site_content FOR SELECT USING (true);

-- Admin Write Policies (Requires Authentication)
CREATE POLICY "Admins can insert influencers" ON influencers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update influencers" ON influencers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete influencers" ON influencers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert portfolio_games" ON portfolio_games FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update portfolio_games" ON portfolio_games FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete portfolio_games" ON portfolio_games FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert market_stats" ON market_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update market_stats" ON market_stats FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete market_stats" ON market_stats FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert site_content" ON site_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update site_content" ON site_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete site_content" ON site_content FOR DELETE USING (auth.role() = 'authenticated');
