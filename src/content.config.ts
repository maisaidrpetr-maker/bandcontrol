import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; 

const songs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/songs" }),
  schema: z.object({
    title: z.string(),
    artist: z.string().optional(),
    bpm: z.union([z.string(), z.number()]).optional(),
    key: z.string().optional(),
    audio: z.string().optional(),
  }),
});

const activities = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/activities" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    role: z.string(),
    date: z.string(),
    status: z.enum(['ready', 'info', 'alert']),
  }),
});

export const collections = { songs, activities };