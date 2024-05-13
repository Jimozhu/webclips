import lume from "lume/mod.ts";
import prism from "lume/plugins/prism.ts";
import date from "lume/plugins/date.ts";
import jsx_preact from "lume/plugins/jsx_preact.ts";
import esbuild from "lume/plugins/esbuild.ts";
import mdx from "lume/plugins/mdx.ts";

import { full as emoji }  from "npm:markdown-it-emoji";
import markdownItAttrs from "npm:markdown-it-attrs";

import Tweets from "./_components/Tweets.tsx";

const markdown = {
  plugins: [emoji, markdownItAttrs],
};

const site = lume({
  prettyUrls: false,
}, { markdown });

site.use(prism());
site.use(date(/* Options */));
site.use(jsx_preact());
site.use(esbuild({
  extensions: [".ts", ".js", ".tsx"],
  options: {
    bundle: true,
    format: "esm",
    minify: true,
    keepNames: true,
    platform: "browser",
    target: "esnext",
    treeShaking: true,
  },
}));
site.use(mdx({
  components: {
    "Tweets": Tweets,
  }
}));

site.ignore("webclips.ts");
site.copy("main.css");

export default site;
