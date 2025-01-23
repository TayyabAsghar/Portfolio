import { getCollection } from "astro:content";

// Only return posts without `draft: true` in the frontmatter
export const latestSideProjects = (
  await getCollection("sideProjects", ({ data }) => {
    return data.draft !== true;
  })
).sort(
  (a, b) =>
    new Date(b.data.publishDate).valueOf() -
    new Date(a.data.publishDate).valueOf()
);

export const pinnedSideProjects = latestSideProjects?.filter(
  (sideProject) => sideProject.data.pinned && !sideProject.data.draft
);
