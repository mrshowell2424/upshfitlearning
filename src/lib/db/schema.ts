import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  jsonb,
  integer,
  date,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  purpose: text("purpose"),
  youtube_id: varchar("youtube_id", { length: 11 }),
  link_url: text("link_url"),
  summary: text("summary"),
  skill: text("skill"),
  skill_is_inferred: boolean("skill_is_inferred").default(true),
  grade_band: text("grade_band").default("3-8"),
  grade_band_is_inferred: boolean("grade_band_is_inferred").default(true),
  format: text("format"), // Slides, Doc, Sheet, Guide, Link, Video
  published_at: date("published_at"),
  is_free: boolean("is_free").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const standards = pgTable("standards", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 20 }).unique().notNull(),
  name: text("name").notNull(),
  plain_reading: text("plain_reading"),
  learning_target: text("learning_target"),
  science_tags: jsonb("science_tags").$type<string[]>(),
  skills: jsonb("skills").$type<string[]>(),
  match_keys: jsonb("match_keys").$type<string[]>(),
  created_at: timestamp("created_at").defaultNow(),
});

export const standard_unpacks = pgTable("standard_unpacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  standard_code: varchar("standard_code", { length: 20 }).notNull(),
  verbs: jsonb("verbs").$type<Array<{ word: string; gloss: string }>>(),
  concepts: jsonb("concepts").$type<string[]>(),
  // Terms carry a kid-friendly definition; bare strings from older rows still render.
  vocabulary: jsonb("vocabulary").$type<
    Array<string | { term: string; definition: string }>
  >(),
  prior_skills: jsonb("prior_skills").$type<string[]>(),
  prior_standards: jsonb("prior_standards").$type<
    Array<{ code: string; text: string }>
  >(),
  future_standards: jsonb("future_standards").$type<
    Array<{ code: string; text: string }>
  >(),
  challenges: jsonb("challenges").$type<
    Array<{ problem: string; fix: string }>
  >(),
  mastery_statement: text("mastery_statement"),
  ladder: jsonb("ladder").$type<Array<{ name: string; descriptor: string }>>(),
  created_at: timestamp("created_at").defaultNow(),
});

export const lesson_blueprints = pgTable("lesson_blueprints", {
  id: uuid("id").primaryKey().defaultRandom(),
  standard_code: varchar("standard_code", { length: 20 }).notNull(),
  title: text("title").notNull(),
  badge: text("badge"),
  route_name: text("route_name"),
  route_line: text("route_line"),
  success_criteria: jsonb("success_criteria").$type<string[]>(),
  steps: jsonb("steps").$type<
    Array<{
      name: string;
      minutes: number;
      body: string;
      science_tag: string;
    }>
  >(),
  ef_supports: jsonb("ef_supports").$type<string[]>(),
  tech: text("tech"),
  tech_purpose: text("tech_purpose"),
  ai_prompts: jsonb("ai_prompts").$type<string[]>(),
  assessment: jsonb("assessment").$type<string[]>(),
  why_it_works: jsonb("why_it_works").$type<string[]>(),
  created_at: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  track: text("track"),
  lesson_count: integer("lesson_count"),
  duration: text("duration"),
  blurb: text("blurb"),
  cover_image: text("cover_image"),
  is_free: boolean("is_free").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  category: text("category"),
  published_at: date("published_at"),
  is_featured: boolean("is_featured").default(false),
  cover_image: text("cover_image"),
  created_at: timestamp("created_at").defaultNow(),
});

export const saved_resources = pgTable("saved_resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull(),
  resource_id: uuid("resource_id").notNull(),
  saved_at: timestamp("saved_at").defaultNow(),
});

export const generated_materials = pgTable("generated_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull(),
  standard_code: varchar("standard_code", { length: 20 }).notNull(),
  format_key: text("format_key").notNull(), // slides, anchor_chart, task_cards, notebook
  title: text("title").notNull(),
  items: jsonb("items").$type<
    Array<{ label: string; lines: string[] }>
  >(),
  created_at: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(), // UUID from Supabase Auth
  email: text("email").unique().notNull(),
  name: text("name"),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").unique().notNull(),
  tier: varchar("tier", { length: 20 }).notNull().default("free"), // free, pro, school
  stripe_customer_id: text("stripe_customer_id"),
  stripe_subscription_id: text("stripe_subscription_id"),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, canceled, past_due
  current_period_start: timestamp("current_period_start"),
  current_period_end: timestamp("current_period_end"),
  /**
   * Access granted by hand rather than bought — a comp, a pilot school, a
   * conference giveaway. Kept separate from `tier` so the two grant paths do
   * not overwrite each other: Stripe owns tier and status, this column is
   * owned by us, and either one being live means All-Access.
   */
  comped_until: timestamp("comped_until"),
  /** Why the comp was given, so a row is explicable months later. */
  comp_note: text("comp_note"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

/**
 * Access paid for before an account existed — claimed on first sign-in.
 * Written by the Stripe webhook, read by server code only.
 */
export const pending_grants = pgTable("pending_grants", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  access_until: timestamp("access_until").notNull(),
  note: text("note"),
  stripe_customer_id: text("stripe_customer_id"),
  stripe_subscription_id: text("stripe_subscription_id"),
  claimed_at: timestamp("claimed_at"),
  claimed_by: text("claimed_by"),
  created_at: timestamp("created_at").defaultNow(),
});
