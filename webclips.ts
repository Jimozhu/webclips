#!/usr/bin/env -S deno run -A

import { Command } from "jsr:@cliffy/command@1.0.0-rc.4";

import { parseArgs } from "https://deno.land/std@0.223.0/cli/parse_args.ts";
import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { DOMParser } from "npm:linkedom@0.16.11";
import Turndown from "npm:turndown@^7.2.0";

function isHTMLClipFileToBeProcessed(filepath: string, dest: string, overWriteExist: boolean) {
  const name = path.basename(filepath);
  const ext = path.extname(name);
  const isHMTL = (ext === ".html" || ext === ".htm") && !name.startsWith("index.htm");
  const isExist = existsSync(path.join(dest, name.replace(ext, ".md")));
  return isHMTL && (!isExist || overWriteExist);
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

async function transformWeblips({ dest, overwrite }: { dest: string; overwrite: boolean; }, ...inputs: string[]) {
  const sourcesFiles = new Set<string>();

  for (const input of inputs) {
    const stat = Deno.statSync(input);
    if (stat.isFile) {
      if (isHTMLClipFileToBeProcessed(input, dest, overwrite)) {
        sourcesFiles.add(input);
      }
    } else {
      const files = Deno.readDir(input);
      for await (const file of files) {
        const filepath = path.join(input, file.name);
        if (file.isFile && isHTMLClipFileToBeProcessed(filepath, dest, overwrite)) {
          sourcesFiles.add(filepath);
        }
      }
    }
  }

  const turndown = new Turndown({ option: { headingStyle: "atx", hr: "---", codeBlockStyle: "fenced", preformattedCode: true } });
  for (const source of sourcesFiles) {
    console.log(`处理 ${source}`);
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
      const destFile = path.join(dest, name.replace(".html", ".md"));
      await Deno.writeTextFile(destFile, md);
    } else {
      console.error(`无法解析 ${source}`);
    }
  }

}

await new Command()
  .name("webclips")
  .version("0.0.2")
  .description("transform html webclips to markdown")
  .option("-d, --dest <dest:string>", "output dir.", {
    default: "./pages",
  })
  .option("-o, --overwrite [overwrite:boolean]", "overwrite exist files.", {
    default: false,
  })
  .arguments("<input...:file>")
  .action(transformWeblips)
  .parse(Deno.args);
