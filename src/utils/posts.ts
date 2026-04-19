import { getCollection } from "astro:content";

export const latestPosts = (
  await getCollection("blog", ({ data }) => data.draft !== true)
).sort(
  (a, b) =>
    new Date(b.data.publishDate).valueOf() -
    new Date(a.data.publishDate).valueOf(),
);

export const groupedPosts = latestPosts.reduce(
  (acc, post) => {
    const dateStr = post.data.publishDate;
    const yearMatch = dateStr.match(/\d{4}$/);
    const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();

    if (!acc[year]) acc[year] = [];

    acc[year].push(post);
    return acc;
  },
  {} as Record<string, typeof latestPosts>,
);

export const sortedYears = Object.keys(groupedPosts).sort(
  (a, b) => Number(b) - Number(a),
);
