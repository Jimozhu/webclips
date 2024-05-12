import lume from "lume/mod.ts";
import prism from "lume/plugins/prism.ts";
import date from "lume/plugins/date.ts";

const site = lume({
  prettyUrls: false,
});

site.use(prism());
site.use(date(/* Options */));

site.copy("main.css");

export default site;
