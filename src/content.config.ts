import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { blogSchema, portfolioSchema, sideProjectSchema } from "./schema";

const BlogPosts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: blogSchema,
});

const Portfolio = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/portfolio" }),
  schema: portfolioSchema,
});

const SideProjects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/sideProjects" }),
  schema: sideProjectSchema,
});

export const collections = {
  blog: BlogPosts,
  portfolio: Portfolio,
  sideProjects: SideProjects,
};
