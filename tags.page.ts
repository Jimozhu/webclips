import { Data } from "lume/core/file.ts";
import type Searcher from "lume/core/searcher.ts";

 interface PageData extends Data {
  // Define your own properties
  search: Searcher;
}

export const layout = "layouts/index.vto";

export default function* ({ search }: PageData) {
  const tags = search.values("tags");
  // const tagslinks = tags.map((tag) => `<a href="/tag/${tag}/">${tag}</a>`).join("\n");
  yield {
    layout: "layouts/tags.vto",
    url: "/tags/",
    title: "Tags",
    type: "tags",
    // content: `<nav class="tags">${tagslinks}</nav>`,
    tags: tags,
  }
  for (const tag of search.values("tags")) {
    yield {
      layout: "layouts/tag.vto",
      url: `/tag/${tag}/`,
      title: `Tagged "${tag}"`,
      type: "tag",
      tag,
    };
  }
}