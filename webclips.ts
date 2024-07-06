#!/usr/bin/env -S deno run -A

import { ActionHandler, Command } from "jsr:@cliffy/command@1.0.0-rc.4";
import { htmlToMarkdown } from "jsr:@pinkrabbit/packages";

import type { Node, Root, Link, VFile } from "npm:mdast@3.0.0";
import {
  type Plugin,
  type Transformer,
} from "npm:unified@11.0.5";
import { visit, type Visitor } from "npm:unist-util-visit@5.0.0";


import * as path from "jsr:@std/path@^0.224.0";
import { existsSync } from "jsr:@std/fs@^0.224.0";
import { DOMParser } from "npm:linkedom@0.16.11";

function buildLumeSite() {
  const command = new Deno.Command("deno", {
    args: ["task", "build"],
  });
  command.outputSync();
}

const extractTimeAndURL = (document: Document) => {
  const labelElements = document.querySelectorAll('footer>label');
  let time = null;
  if (labelElements?.length > 1) {
    // 获取label元素的文本内容
    const labelElement = labelElements[1];
    const labelText = labelElement.textContent;

    // 使用正则表达式匹配时间部分，这里假设时间格式为YYYY-MM-DD HH:mm:ss
    const timeRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/;
    const match = labelText?.match(timeRegex);

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

const WebClipFixPlugin: Plugin<[], Root> = function () {
  const visitor: Visitor<Link> = (
    node: Node,
    index?: number,
    parent?: Node,
  ) => {
    const url: string = node.url ?? '';
    const isZhihu = url.includes('zhihu.com/search');
    if (parent && typeof index === 'number' && isZhihu) {
      parent.children[index] = {
        type: 'text',
        value: node.children.map((child: { value: string; }) => child.value).join(''),
      };
    }
  };
  const transformer: Transformer<Root> = (tree: Node, _: VFile) => {
    visit(tree, (node: Node) => node.type === "link", visitor);
  };

  return transformer;
};

async function transformWeblips({ dest, overwrite, build }: { dest: string; overwrite: boolean; build: boolean; }, ...inputs: string[]) {
  for (const input of inputs) {
    console.log(`处理 ${input}`, { dest, overwrite, build });
    const name = path.basename(input);
    const destFile = path.join(dest, name.replace(".html", ".md"));
    const isExist = existsSync(destFile);
    if (!isExist || overwrite) {
      const html = await Deno.readTextFile(input);
      const md = await htmlToMarkdown(html, { remarkPlugins: [WebClipFixPlugin] });

      if (!md) {
        console.log(`无法转换 ${input}`);
        continue;
      }

      const dom = new DOMParser().parseFromString(html, "text/html");
      const title = dom.querySelector("title").textContent;
      const [time, url] = extractTimeAndURL(dom as unknown as Document);
      const content = `---
title: ${title}
date: ${time}
categories:
  - webclip
tags:
  - webclip
origin_url: '${url}'
---
      
      ${md}
      
        `;
      Deno.writeTextFileSync(destFile, content, { create: true });
    }
  }

  if (build) {
    buildLumeSite();
  }
}

const prettyMarkdown: ActionHandler = ({ overwrite, build }: { overwrite: boolean; build: boolean; }, ...inputs: string[]) => {
  for (const input of inputs) {
    console.log(`处理 ${input}`, { overwrite, build });
  }
};

await new Command()
  .name("webclips")
  .version("0.0.2")
  .description("command line tool for webclips")
  .globalOption("-b, --build [build:boolean]", "build lume site.", { default: false })
  .action(function () {
    this.showHelp();
  })
  .command("transform <input...:file>", "transform html webclips to markdown")
  .option("-d, --dest <dest:string>", "output dir.", {
    default: "./pages",
  })
  .option("-o, --overwrite [overwrite:boolean]", "overwrite exist files.", {
    default: false,
  })
  .arguments("<input...:file>")
  .action(transformWeblips)
  .command("pretty <input...:file>", "pretty markdown webclips")
  .option("-o, --overwrite [overwrite:boolean]", "overwrite exist files.", {
    default: true,
  })
  .arguments("<input...:file>")
  .action(prettyMarkdown)
  .parse(Deno.args);
