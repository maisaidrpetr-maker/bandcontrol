import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Tato řádka je nová

const skladby = defineCollection({
  // Loader říká Astru, kde má ty soubory fyzicky hledat
  loader: glob({ pattern: '**/[^_]*.{md,mdoc}', base: "./src/content/skladby" }),
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    bpm: z.string(),
    key: z.string(),
    audio: z.string(),
  }),
});

export const collections = { skladby };