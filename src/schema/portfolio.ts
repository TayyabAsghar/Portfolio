import { z } from "astro/zod";

const portfolioSchema = z.object({
  title: z.string(),
  image: z.string(),
  priority: z.number(), //TODO: Remove after dividing the projects into side projects.
  bgGradient: z.string(),
  description: z.string(),
  author: z.string().trim(),
  company: z.string().trim(),
  draft: z.boolean().optional(),
  pinned: z.boolean().optional(),
  tags: z.array(z.string()),
  publishDate: z.string().transform((str) =>
    new Date(str).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  ),
});

export default portfolioSchema;
