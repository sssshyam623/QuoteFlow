import { z } from 'zod';

export const quoteSchema = z.object({
  text: z.string().min(5, 'Quote must be at least 5 characters').max(500, 'Quote too long'),
  author: z.string().min(2, 'Author name required').max(100),
  tag: z.string().optional(),
});
