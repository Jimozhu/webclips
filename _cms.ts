import lumeCMS, { Fs } from "lume/cms.ts";

const cms = lumeCMS({
  site: {
    name: "My Notes",
    url: "http://localhost:3000/",
  },
});

const root = Deno.cwd() + "/pages";
cms.storage("my_pages", new Fs({ root }));

cms.collection("pages", "my_pages:/*.md", [
  "title: text!",
  "date: datetime!",
  "tags: list",
  "origin_url: url",
  "content: markdown",
]);

export default cms;