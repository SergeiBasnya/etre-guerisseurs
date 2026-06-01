import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Pierre-Alexandre Morales'),
    category: z.string().default('Voie toltèque'),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    readingTime: z.string().optional(),
  }),
});

export const collections = { blog };
