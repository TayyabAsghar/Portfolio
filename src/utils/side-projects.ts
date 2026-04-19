import { getCollection } from "astro:content";

export const latestSideProjects = (
  await getCollection("sideProjects", ({ data }) => data.draft !== true)
).sort(
  (a, b) =>
    new Date(b.data.publishDate).valueOf() -
    new Date(a.data.publishDate).valueOf(),
);

export const pinnedSideProjects = latestSideProjects?.filter(
  (sideProject) => sideProject.data.pinned && !sideProject.data.draft,
);
