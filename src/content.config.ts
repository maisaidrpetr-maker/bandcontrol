// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/events" }),
  schema: z.object({
    type: z.string(),
    date: z.union([z.string(), z.date()]),
    alert: z.boolean().optional(),
  })
});

const activities = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/activities" }),
  schema: z.object({
    title: z.string().optional(),
  }).optional()
});

// Aktualizovaná kolekce lyrics s validací metadaten
const lyrics = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/lyrics" }),
  schema: z.object({
    title: z.string(),
    artist: z.string().optional(),
    bpm: z.string().optional(),
    key: z.string().optional(),
    audio: z.string().optional(),
  }),
});

const tabs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/tabs" }),
});

export const collections = { 
  events, 
  activities, 
  lyrics, 
  tabs 
};