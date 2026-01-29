import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

const client = new Client({
  connectionString: process.env.DIRECT_URL,
})

async function main() {
  await client.connect()
  console.log('Seeding initial data via PG Client...')

  try {
    // 1. Influencers
    const influencers = [
      ['KreekCraft', 'North America', '10M+', 'Variety / Events', '250M+ Monthly Views', 0],
      ['Flamingo', 'North America', '12M+', 'Comedy / Gameplay', '300M+ Monthly Views', 1],
      ['LankyBox', 'Global', '30M+', 'Story / Animation', '1B+ Monthly Views', 2],
      ['Julia MineGirl', 'Brazil', '9M+', 'Family / Adventure', '150M+ Monthly Views', 3],
    ]

    for (const inf of influencers) {
      await client.query(
        'INSERT INTO influencers (name, region, subs, focus, metric, order_index) VALUES ($1, $2, $3, $4, $5, $6)',
        inf
      )
    }

    // 2. Portfolio Games
    const games = [
      ['Cyber-City RPG', 'A high-fidelity neon metropolis where brands integrate through digital fashion and interactive storefronts.', '/images/hero-1.png', '1.2M+ Monthly Visits', 0],
      ['Void Runners', 'High-octane competitive racing through gravity-defying tracks. Featured in official global tournaments.', '/images/hero-2.png', '500k+ Active Players', 1],
      ['Eco-Quest', 'An immersive nature simulation teaching sustainability through gamified challenges and community rewards.', '/images/hero-3.png', 'Top 10 Education', 2],
    ]

    for (const game of games) {
      await client.query(
        'INSERT INTO portfolio_games (title, description, image_url, stats, order_index) VALUES ($1, $2, $3, $4, $5)',
        game
      )
    }

    // 3. Market Stats
    const stats = [
      ['Scale & Reach', 'Daily Active Users', '88.9M', 'Q3 2024 Average', 'Users', true, 0],
      ['Scale & Reach', 'Monthly Engagement', '20.7B', 'Hours Spent in Q3', 'Clock', false, 1],
      ['Scale & Reach', 'Monthly Active Users', '380M+', 'Estimated Global Reach', 'TrendingUp', false, 2],
      ['Demographics', 'Users Over 13', '58%', 'Mature Audience Shift', 'Users', false, 3],
      ['Demographics', 'Fastest Growing', '17-24', 'Age Demographic', 'TrendingUp', true, 4],
      ['Demographics', 'Gender Split', 'Near Even', 'Inclusive Market', 'Users', false, 5],
      ['The Digital Economy', 'Quarterly Bookings', '$1.13B', '34% YoY Growth', 'Wallet', true, 6],
      ['The Digital Economy', 'Creator Payouts', '$800M+', 'Trailing 12 Months', 'CheckCircle2', false, 7],
      ['The Digital Economy', 'Daily Avatar Updates', '1.6B', 'Digital Identity Focus', 'TrendingUp', false, 8],
    ]

    for (const stat of stats) {
      await client.query(
        'INSERT INTO market_stats (category, label, value, detail, icon_name, is_highlighted, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        stat
      )
    }

    // 4. Site Content
    await client.query(
      "INSERT INTO site_content (key, value) VALUES ('founder_quote', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      ["We don't just build games; we architect digital legacies. Every project we take on is a partnership built on transparency and radical results."]
    )

    console.log('Seeding complete!')
  } catch (err) {
    console.error('Error during seeding:', err)
  } finally {
    await client.end()
  }
}

main()
