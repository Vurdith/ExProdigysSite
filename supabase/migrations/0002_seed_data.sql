-- Seed Influencers
INSERT INTO influencers (name, youtube_url, avatar_url, bio, subs, metric, order_index)
VALUES 
  ('KreekCraft', 'https://youtube.com/@KreekCraft', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200', 'The top destination for Roblox news, live events, and high-energy gameplay.', '10M+', '250M+ Monthly Views', 0),
  ('Flamingo', 'https://youtube.com/@Albert', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200&h=200', 'Pure chaos and comedy in the metaverse. One of the most influential voices in gaming.', '12M+', '300M+ Monthly Views', 1),
  ('LankyBox', 'https://youtube.com/@LankyBox', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200', 'Global phenomenon specializing in high-fidelity story-driven content and animation.', '30M+', '1B+ Monthly Views', 2),
  ('Julia MineGirl', 'https://youtube.com/@JuliaMineGirl', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200', 'The leading voice for family-friendly adventures in the Latin American market.', '9M+', '150M+ Monthly Views', 3);

-- Seed Portfolio Games
INSERT INTO portfolio_games (title, description, image_url, stats, order_index)
VALUES 
  ('Cyber-City RPG', 'A high-fidelity neon metropolis where brands integrate through digital fashion and interactive storefronts.', '/images/hero-1.png', '1.2M+ Monthly Visits', 0),
  ('Void Runners', 'High-octane competitive racing through gravity-defying tracks. Featured in official global tournaments.', '/images/hero-2.png', '500k+ Active Players', 1),
  ('Eco-Quest', 'An immersive nature simulation teaching sustainability through gamified challenges and community rewards.', '/images/hero-3.png', 'Top 10 Education', 2);

-- Seed Market Stats
INSERT INTO market_stats (category, label, value, detail, icon_name, is_highlighted, order_index)
VALUES 
  ('Scale & Reach', 'Daily Active Users', '88.9M', 'Q3 2024 Average', 'Users', TRUE, 0),
  ('Scale & Reach', 'Monthly Engagement', '20.7B', 'Hours Spent in Q3', 'Clock', FALSE, 1),
  ('Scale & Reach', 'Monthly Active Users', '380M+', 'Estimated Global Reach', 'TrendingUp', FALSE, 2),
  ('Demographics', 'Users Over 13', '58%', 'Mature Audience Shift', 'Users', FALSE, 3),
  ('Demographics', 'Fastest Growing', '17-24', 'Age Demographic', 'TrendingUp', TRUE, 4),
  ('Demographics', 'Gender Split', 'Near Even', 'Inclusive Market', 'Users', FALSE, 5),
  ('The Digital Economy', 'Quarterly Bookings', '$1.13B', '34% YoY Growth', 'Wallet', TRUE, 6),
  ('The Digital Economy', 'Creator Payouts', '$800M+', 'Trailing 12 Months', 'CheckCircle2', FALSE, 7),
  ('The Digital Economy', 'Daily Avatar Updates', '1.6B', 'Digital Identity Focus', 'TrendingUp', FALSE, 8);

-- Seed Site Content
INSERT INTO site_content (key, value)
VALUES ('founder_quote', 'We don''t just build games; we architect digital legacies. Every project we take on is a partnership built on transparency and radical results.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
