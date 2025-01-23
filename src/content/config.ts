import { defineCollection } from "astro:content";
import { blogSchema, portfolioSchema, sideProjectSchema } from "../schema";

const BlogPosts = defineCollection({
  schema: blogSchema,
});

const Portfolio = defineCollection({
  schema: portfolioSchema,
});

const SideProjects = defineCollection({
  schema: sideProjectSchema,
});

export const collections = {
  blog: BlogPosts,
  portfolio: Portfolio,
  sideProjects: SideProjects,
};
