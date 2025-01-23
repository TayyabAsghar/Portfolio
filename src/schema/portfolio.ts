import { z } from "astro:content";

const portfolioSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string().trim(),
  company: z.string().trim(),
  draft: z.boolean().optional(),
  pinned: z.boolean().optional(),
  tags: z.array(z.string()),
  image: z.string().optional(),
  publishDate: z.string().transform((str) =>
    new Date(str).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  ),
});

export default portfolioSchema;
