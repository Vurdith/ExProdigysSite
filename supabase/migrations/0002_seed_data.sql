-- Seed Influencers
INSERT INTO influencers (name, region, subs, focus, metric, order_index) VALUES
('LankyBox', 'GLOBAL', '38.5M', 'Variety / Gaming', '1.2B+ Views/mo', 0),
('Flamingo', 'USA', '13.1M', 'Comedy / Chaos', '400M+ Views/mo', 1),
('ItsFunneh', 'CANADA', '10.5M', 'Roleplay / Group', '250M+ Views/mo', 2),
('KreekCraft', 'USA', '10.2M', 'Live Events', '180M+ Views/mo', 3);

-- Seed Portfolio Games
INSERT INTO portfolio_games (title, description, image_url, stats, order_index) VALUES
('GrowROT', 'Plant your magical seeds and grow a brainrot!', '/images/hero-1.png', '1M+ Peak CCU', 0),
('Anime Simulator', 'Welcome to Anime Simulator, a fighting and training game.', '/images/hero-2.png', '500K+ Peak CCU', 1),
('Anime Chefs', 'Step into the kitchen where cooking meets chaos.', '/images/hero-3.png', '250K+ Peak CCU', 2),
('Go Hard Games', 'Find the best Roblox games to play with friends.', '/images/hero-1.png', 'Platform Leader', 3);

-- Seed Market Stats
INSERT INTO market_stats (category, label, value, detail, icon_name, is_highlighted, order_index) VALUES
('Scale & Reach', 'Daily Active Users', '88.9M', '27% YoY Increase', 'Users', true, 0),
('Scale & Reach', 'Quarterly Engagement', '20.7B hrs', '29% YoY Increase', 'Clock', false, 1),
('Scale & Reach', 'Monthly Active Users', '380M+', 'Estimated MAU', 'TrendingUp', false, 2),
('Demographics', 'Aged 13+', '58%', 'Majority of user base', 'CheckCircle2', true, 3),
('Demographics', 'Fastest Growing', '17-24', 'Platform ''Aging Up''', 'TrendingUp', false, 4),
('Demographics', 'Gender Split', 'Near Even', '43% Female / 57% Male', 'Users', false, 5),
('The Digital Economy', 'Quarterly Bookings', '$1.13B', '34% YoY Growth', 'Wallet', true, 6),
('The Digital Economy', 'Paid to Creators', '$800M+', 'Trailing 12 Months', 'BarChart3', false, 7),
('The Digital Economy', 'Daily Avatar Updates', '1.6B', 'Digital Identity Focus', 'Users', false, 8);

-- Seed Site Content
INSERT INTO site_content (key, value) VALUES
('founder_quote', 'We don''t just build games; we architect digital legacies. Every project we take on is a partnership built on transparency and radical results.');
