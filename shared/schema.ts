import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  division: text("division").notNull(),
  district: text("district").notNull(),
  upazila: text("upazila").notNull(),
  policeStation: text("police_station").notNull(),
  location: text("location").notNull(),
  coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>().notNull(),
  party: text("party").notNull(),
  injured: integer("injured").notNull().default(0),
  killed: integer("killed").notNull().default(0),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  newsSource: text("news_source").notNull(),
  sourceUrl: text("source_url"),
  aiAnalysis: jsonb("ai_analysis").$type<{
    confidence: number;
    keyEntities: string[];
    sentiment: string;
    processedAt: string;
    extractedInfo: {
      casualties: { killed: number; injured: number };
      locationConfidence: number;
      partyConfidence: number;
      violenceType: string;
    };
  }>().notNull(),
  crawledAt: text("crawled_at").notNull(),
  lastUpdated: text("last_updated").notNull(),
  witnesses: jsonb("witnesses").$type<string[]>().default([]),
  policeResponse: text("police_response"),
  tags: jsonb("tags").$type<string[]>().default([])
});

export const newsSources = pgTable("news_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  lastCrawled: text("last_crawled").notNull(),
  dailyArticles: integer("daily_articles").notNull().default(0),
  reliability: integer("reliability").notNull().default(0)
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  crawledAt: true,
  lastUpdated: true
});

export const insertNewsSourceSchema = createInsertSchema(newsSources).omit({
  id: true
});

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertNewsSource = z.infer<typeof insertNewsSourceSchema>;
export type NewsSource = typeof newsSources.$inferSelect;

// Filter types
export const filterSchema = z.object({
  search: z.string().optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  party: z.string().optional(),
  severity: z.array(z.string()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  fatalOnly: z.boolean().optional(),
  injuredOnly: z.boolean().optional(),
  sortBy: z.enum(["date", "severity", "casualties"]).optional(),
  page: z.number().optional(),
  limit: z.number().optional()
});

export type IncidentFilter = z.infer<typeof filterSchema>;
