// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  // Opravená cesta, protože konfig je teď přímo v src/
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/events" }),
  schema: z.object({
    type: z.string(),
    date: z.union([z.string(), z.date()]),
    alert: z.boolean().optional(),
  })
});

const songs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/songs" }),
  schema: z.object({
    title: z.string().optional(),
  }).optional()
});

const activities = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/activities" }),
  schema: z.object({
    title: z.string().optional(),
  }).optional()
});

export const collections = { events, songs, activities };