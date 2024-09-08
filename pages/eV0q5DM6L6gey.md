---
title: Here are 4 TSConfig options you HAVE to know about
date: 2024-08-04T03:16:00.000Z
categories:
  - webclip
tags:
  - webclip
origin_url: 'https://twitter-thread.com/t/1819660693794111660'
---
# Here are 4 TSConfig options you HAVE to know about: Let me explain

[![](https://pbs.twimg.com/media/GUC7we6XoAAAR0k.jpg)](https://pbs.twimg.com/media/GUC7we6XoAAAR0k?format=jpg\&name=4096x4096)

\`noUncheckedIndexedAccess\` is by now pretty well known. Without it, TypeScript lets you stumble into some pretty nasty runtime errors. For instance, the code below won't show an error, but will crash at runtime:

[![](https://pbs.twimg.com/media/GUC7wdLXgAAebrL.jpg)](https://pbs.twimg.com/media/GUC7wdLXgAAebrL?format=jpg\&name=4096x4096)

This is because by default (even with \`strict: true\`), TypeScript will assume that any property in \`obj\` will be a string, even though it could be undefined at runtime.

[![](https://pbs.twimg.com/media/GUC7wc8W4AAjW3m.jpg)](https://pbs.twimg.com/media/GUC7wc8W4AAjW3m?format=jpg\&name=4096x4096)

But with \`noUncheckedIndexedAccess\`, we can get an error at compile time. That's because TypeScript forces you to check if the property exists before accessing it.

[![](https://pbs.twimg.com/media/GUC7weJWMAEmK0Y.jpg)](https://pbs.twimg.com/media/GUC7weJWMAEmK0Y?format=jpg\&name=4096x4096)

\`moduleDetection: force\` tells TypeScript that you have zero global scripts in your project. Without it, TypeScript will treat files without imports and exports as global scripts. This means you get odd errors when you try to declare variables that clash with the global scope:

[![](https://pbs.twimg.com/media/GUC7wd9XcAAyChO.jpg)](https://pbs.twimg.com/media/GUC7wd9XcAAyChO?format=jpg\&name=4096x4096)

But with \`moduleDetection: force\`, it'll behave correctly. It's an auto-include for any modern TS project.

[![](https://pbs.twimg.com/media/GUC7wdUXQAAC9Hs.jpg)](https://pbs.twimg.com/media/GUC7wdUXQAAC9Hs?format=jpg\&name=4096x4096)

\`module\` is a setting with a BUNCH of different options. But really, there are only two modern options. \`NodeNext\` tells TypeScript that your code will be run by Node.js. This imposes some constraints, like needing to use specific \`.js\` extensions for files.

[![](https://pbs.twimg.com/media/GUC7wejWUAAEXmR.jpg)](https://pbs.twimg.com/media/GUC7wejWUAAEXmR?format=jpg\&name=4096x4096)

And \`Preserve\` tells TypeScript that an external bundler will handle the bundling. This means you don't need to specify the \`.js\` extension.

[![](https://pbs.twimg.com/media/GUC7weKWEAAxw10.jpg)](https://pbs.twimg.com/media/GUC7weKWEAAxw10?format=jpg\&name=4096x4096)

As a guide, you should use \`NodeNext\` when you're transpiling with \`tsc\`, and \`Preserve\` the rest of the time (like using a frontend framework, or a bundler like Rollup).

You can specify \`moduleResolution\` to be \`Node\`. This is a pretty common pattern. But it's a terrible idea. Many libraries use 'exports' in package.json to specify multiple entry points to their package. But 'Node' doesn't support this. Kill it with fire wherever you see it:

[![](https://pbs.twimg.com/media/GUC7we1WwAAdoo7.jpg)](https://pbs.twimg.com/media/GUC7we1WwAAdoo7?format=jpg\&name=4096x4096)

Finally, \`verbatimModuleSyntax\` makes TypeScript stricter with how you you use imports and exports. In most cases, this will mean you'll be forced to use \`import type\` and \`export type\` instead of \`import\` and \`export\`.

[![](https://pbs.twimg.com/media/GUC7wdvXYAAISKT.jpg)](https://pbs.twimg.com/media/GUC7wdvXYAAISKT?format=jpg\&name=4096x4096)

The way to fix this is to use \`import type\` instead. Type-only imports are erased at runtime - and the fewer imports you have, the less runtime code will need to be handled by your bundler. So, a setting to enforce them is pretty handy.

[![](https://pbs.twimg.com/media/GUC7wdoWcAAsQMw.jpg)](https://pbs.twimg.com/media/GUC7wdoWcAAsQMw?format=jpg\&name=4096x4096)

If all of this feels bamboozling, you should check out my TSConfig Cheat Sheet. I keep it updated with the latest changes to TSConfig, so you can rely on it.

[totaltypescript.com/tsconfig-cheat…](https://t.co/TA2NJAvxHD)

[The TSConfig Cheat Sheet](https://t.co/TA2NJAvxHD)
