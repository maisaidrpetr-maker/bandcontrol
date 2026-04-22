import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Důležité pro Astro 5

const songs = defineCollection({
  // V Astro 5 používáme loader pro hledání souborů
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/songs" }),
  schema: z.object({
    title: z.string(),
    artist: z.string().optional(),
    bpm: z.union([z.string(), z.number()]).optional(),
    key: z.string().optional(),
    audio: z.string().optional(),
  }),
});

export const collections = { songs };