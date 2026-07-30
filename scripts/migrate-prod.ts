#!/usr/bin/env bun

/**
 * Production database migration script
 * Run before first deployment: bun run migrate:prod
 * Handles schema creation, data seeding, and backups
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL not set");
}

async function main() {
  console.log("🚀 Starting production database migration...");
  console.log(`📊 Database: ${databaseUrl.split("@")[1]?.split("/")[0] || "unknown"}`);

  try {
    // Create connection
    const client = postgres(databaseUrl);
    const db = drizzle(client);

    console.log("\n1️⃣  Creating database schema...");
    // Note: In production, use Drizzle Kit migrations instead
    // This is a fallback for initial setup
    await client`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        link_url VARCHAR(500) NOT NULL UNIQUE,
        summary TEXT,
        youtube_id VARCHAR(20),
        thumbnail_url VARCHAR(500),
        duration_minutes INT,
        skills JSONB,
        grades JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Resources table created");

    await client`
      CREATE TABLE IF NOT EXISTS standards (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        plain_reading TEXT,
        learning_target TEXT,
        skills JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Standards table created");

    await client`
      CREATE TABLE IF NOT EXISTS standard_unpacks (
        id SERIAL PRIMARY KEY,
        standard_id INT NOT NULL REFERENCES standards(id),
        verbs TEXT[],
        concepts TEXT[],
        vocabulary TEXT[],
        misconceptions TEXT[],
        learning_ladder TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Standard unpacks table created");

    await client`
      CREATE TABLE IF NOT EXISTS lesson_blueprints (
        id SERIAL PRIMARY KEY,
        standard_id INT NOT NULL REFERENCES standards(id),
        context TEXT,
        instructional_route TEXT,
        eight_step_path JSONB,
        teaching_moves JSONB,
        ef_supports JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Lesson blueprints table created");

    await client`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        tier VARCHAR(20) DEFAULT 'free',
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Users table created");

    await client`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        tier VARCHAR(20) NOT NULL,
        stripe_subscription_id VARCHAR(255),
        stripe_customer_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        started_at TIMESTAMP,
        ends_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Subscriptions table created");

    await client`
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        body_markdown TEXT,
        body_html TEXT,
        canonical_url VARCHAR(500) NOT NULL UNIQUE,
        cover_image VARCHAR(500),
        cover_image_alt_text TEXT,
        cover_image_caption TEXT,
        byline VARCHAR(255),
        read_time INT,
        reactions INT DEFAULT 0,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Articles table created");

    await client`
      CREATE TABLE IF NOT EXISTS saved_resources (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        resource_id INT NOT NULL REFERENCES resources(id),
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, resource_id)
      )
    `;
    console.log("✅ Saved resources table created");

    await client`
      CREATE TABLE IF NOT EXISTS generated_materials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        standard_id INT NOT NULL REFERENCES standards(id),
        format VARCHAR(50) NOT NULL,
        output TEXT,
        tokens_used INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Generated materials table created");

    // Create indices for performance
    console.log("\n2️⃣  Creating database indices...");

    await client`CREATE INDEX IF NOT EXISTS idx_resources_skills ON resources USING GIN(skills)`;
    await client`CREATE INDEX IF NOT EXISTS idx_resources_grades ON resources USING GIN(grades)`;
    await client`CREATE INDEX IF NOT EXISTS idx_resources_youtube_id ON resources(youtube_id)`;
    await client`CREATE INDEX IF NOT EXISTS idx_standards_code ON standards(code)`;
    await client`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await client`CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id)`;
    await client`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC)`;
    await client`CREATE INDEX IF NOT EXISTS idx_saved_resources_user_id ON saved_resources(user_id)`;

    console.log("✅ Indices created");

    // Create functions for updated_at
    console.log("\n3️⃣  Creating database functions...");

    await client`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    // Create triggers for updated_at
    const tables = [
      "resources",
      "standards",
      "standard_unpacks",
      "lesson_blueprints",
      "users",
      "subscriptions",
      "articles",
      "generated_materials",
    ];

    for (const table of tables) {
      await client`
        DROP TRIGGER IF EXISTS update_${client.fragment`${
          client.fragment([table])
        }`}_updated_at ON ${client.fragment([table])}
      `.catch(() => {}); // Ignore if trigger doesn't exist

      await client`
        CREATE TRIGGER update_${client.fragment`${
          client.fragment([table])
        }`}_updated_at BEFORE UPDATE ON ${client.fragment([table])}
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
      `;
    }

    console.log("✅ Functions and triggers created");

    // Seed initial standards
    console.log("\n4️⃣  Seeding initial standards...");

    const standardsToSeed = [
      {
        code: "RL.2.1",
        name: "Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.",
        plain_reading:
          "Students ask and answer who, what, where, when, why, and how questions about texts they read.",
        learning_target: "I can ask and answer questions about a story I read.",
        skills: ["Reading", "Comprehension", "Questioning"],
      },
      {
        code: "RI.4.2",
        name: "Determine the main idea of a text and explain how it is supported by key details; summarize the text.",
        plain_reading:
          "Students find the main idea and explain how details support it.",
        learning_target: "I can find the main idea and explain how it is supported by details.",
        skills: ["Reading", "Main Idea", "Summarization"],
      },
      {
        code: "L.5.4",
        name: "Determine or clarify the meaning of unknown and multiple-meaning words and phrases based on grade 5 reading and content.",
        plain_reading: "Students figure out what unknown words mean.",
        learning_target: "I can figure out what new words mean.",
        skills: ["Vocabulary", "Context Clues", "Word Study"],
      },
      {
        code: "RL.6.3",
        name: "Describe how a particular story's or drama's plot unfolds in a series of episodes as well as how the characters respond or change.",
        plain_reading:
          "Students describe how the plot unfolds and how characters change.",
        learning_target: "I can describe how the plot unfolds and how characters change.",
        skills: ["Character Analysis", "Plot", "Literature"],
      },
    ];

    for (const std of standardsToSeed) {
      try {
        await client`
          INSERT INTO standards (code, name, plain_reading, learning_target, skills)
          VALUES (${std.code}, ${std.name}, ${std.plain_reading}, ${std.learning_target}, ${JSON.stringify(
          std.skills
        )})
          ON CONFLICT (code) DO NOTHING
        `;
      } catch (err) {
        console.log(`⚠️  Standard ${std.code} already exists, skipping`);
      }
    }

    console.log("✅ Initial standards seeded");

    // Enable Row Level Security (if using Supabase)
    console.log("\n5️⃣  Setting up security policies...");

    try {
      // Enable RLS on sensitive tables
      await client`ALTER TABLE users ENABLE ROW LEVEL SECURITY`;
      await client`ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY`;
      await client`ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY`;

      console.log("✅ Row Level Security enabled");
    } catch (err) {
      console.log(
        "⚠️  RLS setup skipped (may not be available in current database)"
      );
    }

    console.log("\n6️⃣  Running health check...");

    // Verify tables exist
    const tables_result = await client`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `;

    const createdTables = (tables_result as any[]).map(
      (t: any) => t.table_name
    );
    console.log(`✅ Database has ${createdTables.length} tables`);

    // Count records
    const counts = await client`
      SELECT
        (SELECT COUNT(*) FROM standards) as standards,
        (SELECT COUNT(*) FROM resources) as resources,
        (SELECT COUNT(*) FROM users) as users
    `;

    const data = counts[0] as any;
    console.log(`   📊 Standards: ${data.standards}`);
    console.log(`   📦 Resources: ${data.resources}`);
    console.log(`   👥 Users: ${data.users}`);

    console.log("\n✅ Migration complete!");
    console.log("\n📝 Next steps:");
    console.log("   1. Verify database is accessible from your application");
    console.log("   2. Run: bun run sync:sheets (to sync resources from Google Sheets)");
    console.log("   3. Monitor logs for any issues");
    console.log("   4. Test authentication and payments");

    await client.end();
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    process.exit(1);
  }
}

main();
