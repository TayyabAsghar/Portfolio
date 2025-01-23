import { getCollection } from "astro:content";

// Only return posts without `draft: true` in the frontmatter
export const latestPortfolio = (
  await getCollection("portfolio", ({ data }) => {
    return data.draft !== true;
  })
).sort(
  (a, b) =>
    new Date(b.data.publishDate).valueOf() -
    new Date(a.data.publishDate).valueOf()
);

export const pinnedPortfolio = latestPortfolio?.filter(
  (portfolioItem) => portfolioItem.data.pinned && !portfolioItem.data.draft
);
