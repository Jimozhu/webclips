#!/usr/bin/env -S deno run -A

import { parseArgs } from "https://deno.land/std@0.223.0/cli/parse_args.ts";
import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import { DOMParser, Document } from "npm:linkedom@0.16.11";
import Turndown from "npm:turndown@^7.1.3";

const flags = parseArgs(Deno.args, {
  string: ["d", "s"],
});

const sources: Set<string> = new Set();
const destDir = flags.d;

if (!destDir) {
  console.error("缺少参数 -d");
  Deno.exit(1);
}

if (flags.s) {
  sources.add(flags.s);
}
if (flags._.length > 0) {
  flags._.forEach((source) => {
    if (typeof source === "string") {
      sources.add(source);
    }
  });
}

console.log(sources, destDir);

const sourcesFiles = new Set<string>();
for (const source of sources) {
  // check if source is a file or directory
  const stat = Deno.statSync(source);
  if (stat.isFile) {
    sourcesFiles.add(source);
  } else {
    // if source is directory, read all html files
    // and convert them to markdown
    const files = Deno.readDir(source);
    for await (const file of files) {
      const name = file.name;
      if (file.isFile && (name.endsWith(".html") || name.endsWith(".htm")) && !name.startsWith("index.htm")) {
        sourcesFiles.add(path.join(source, name));
      }
    }
  }
}

const extractTimeAndURL = (document: any) => {
  const labelElements = document.querySelectorAll('footer>label');
  let time = null;
  if (labelElements?.length > 1) {
    // 获取label元素的文本内容
    const labelElement = labelElements[1];
    const labelText = labelElement.textContent;

    // 使用正则表达式匹配时间部分，这里假设时间格式为YYYY-MM-DD HH:mm:ss
    const timeRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/;
    const match = labelText.match(timeRegex);

    if (match) {
      time = match[0];
    }
  }

  const aElement = document.querySelector('footer>label>a');
  let url = null;
  if (aElement) {
    url = aElement.getAttribute('href');
  }
  return [time, url];
};

const turndown = new Turndown();
for (const source of sourcesFiles) {
  const file = await Deno.readTextFile(source);
  const dom = new DOMParser().parseFromString(file, "text/html");
  const title = dom.querySelector("title").textContent;
  const [time, url] = extractTimeAndURL(dom);
  // console.log(source, title, time, url);
  const content = dom.querySelector("main.typo");
  if (content) {
    let md = turndown.turndown(content);
    if (!md) {
      console.error(`无法转换 ${source}`);
      continue;
    }
    md = `---
title: "${title}"
date: ${time}
categories: [other]
tags: []
origin_url: ${url}
---
${md}
    `;
    const name = path.basename(source);
    const dest = path.join(destDir, name.replace(".html", ".md"));
    await Deno.writeTextFile(dest, md);
  } else {
    console.error(`无法解析 ${source}`);
  }
}
