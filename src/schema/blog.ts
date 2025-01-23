import { z } from "astro:content";

const blogSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  category: z.string().trim(),
  author: z.string().trim(),
  draft: z.boolean().optional(),
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

export default blogSchema;
