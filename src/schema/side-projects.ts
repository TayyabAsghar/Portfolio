import { z } from "astro:content";

const sideProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string().trim(),
  domains: z.string().trim(),
  draft: z.boolean().optional(),
  pinned: z.boolean().optional(),
  tags: z.array(z.string()),
  image: z.string().optional(),
  status: z.enum(["Planning", "Backlog", "On hold", "Live", "In progress"]),
  publishDate: z.string().transform((str) =>
    new Date(str).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  ),
});

export default sideProjectSchema;
