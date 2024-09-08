---
title: 如何维护更新日志
date: 2024-08-13T14:47:49.927Z
categories:
  - webclip
tags:
  - webclip
origin_url: 'https://keepachangelog.com/zh-CN/1.1.0/'
---

# 如何维护更新日志

## 更新日志绝对不应该是 git 日志的堆砌物

[Version **1.1.0**](https://github.com/olivierlacan/keep-a-changelog/blob/main/CHANGELOG.md)

```
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- v1.1 Brazilian Portuguese translation.
- v1.1 German Translation
- v1.1 Spanish translation.
- v1.1 Italian translation.
- v1.1 Polish translation.
- v1.1 Ukrainian translation.

### Changed

- Use frontmatter title & description in each language version template
- Replace broken OpenGraph image with an appropriately-sized Keep a Changelog 
  image that will render properly (although in English for all languages)
- Fix OpenGraph title & description for all languages so the title and 
description when links are shared are language-appropriate

### Removed

- Trademark sign previously shown after the project description in version 
0.3.0

## [1.1.1] - 2023-03-05

### Added

- Arabic translation (#444).
- v1.1 French translation.
- v1.1 Dutch translation (#371).
- v1.1 Russian translation (#410).
- v1.1 Japanese translation (#363).
- v1.1 Norwegian Bokmål translation (#383).
- v1.1 "Inconsistent Changes" Turkish translation (#347).
- Default to most recent versions available for each languages.
- Display count of available translations (26 to date!).
- Centralize all links into `/data/links.json` so they can be updated easily.

### Fixed

- Improve French translation (#377).
- Improve id-ID translation (#416).
- Improve Persian translation (#457).
- Improve Russian translation (#408).
- Improve Swedish title (#419).
- Improve zh-CN translation (#359).
- Improve French translation (#357).
- Improve zh-TW translation (#360, #355).
- Improve Spanish (es-ES) transltion (#362).
- Foldout menu in Dutch translation (#371).
- Missing periods at the end of each change (#451).
- Fix missing logo in 1.1 pages.
- Display notice when translation isn't for most recent version.
- Various broken links, page versions, and indentations.

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file.
- Identical links assigned in each translation file.
- Duplicate index file for the english version.

## [1.1.0] - 2019-02-15

### Added

- Danish translation (#297).
- Georgian translation from (#337).
- Changelog inconsistency section in Bad Practices.

### Fixed

- Italian translation (#332).
- Indonesian translation (#336).

## [1.0.0] - 2017-06-20

### Added

- New visual identity by [@tylerfortune8](https://github.com/tylerfortune8).
- Version navigation.
- Links to latest released version in previous versions.
- "Why keep a changelog?" section.
- "Who needs a changelog?" section.
- "How do I make a changelog?" section.
- "Frequently Asked Questions" section.
- New "Guiding Principles" sub-section to "How do I make a changelog?".
- Simplified and Traditional Chinese translations from [@tianshuo](https://github.com/tianshuo).
- German translation from [@mpbzh](https://github.com/mpbzh) & [@Art4](https://github.com/Art4).
- Italian translation from [@azkidenz](https://github.com/azkidenz).
- Swedish translation from [@magol](https://github.com/magol).
- Turkish translation from [@emreerkan](https://github.com/emreerkan).
- French translation from [@zapashcanon](https://github.com/zapashcanon).
- Brazilian Portuguese translation from [@Webysther](https://github.com/Webysther).
- Polish translation from [@amielucha](https://github.com/amielucha) & [@m-aciek](https://github.com/m-aciek).
- Russian translation from [@aishek](https://github.com/aishek).
- Czech translation from [@h4vry](https://github.com/h4vry).
- Slovak translation from [@jkostolansky](https://github.com/jkostolansky).
- Korean translation from [@pierceh89](https://github.com/pierceh89).
- Croatian translation from [@porx](https://github.com/porx).
- Persian translation from [@Hameds](https://github.com/Hameds).
- Ukrainian translation from [@osadchyi-s](https://github.com/osadchyi-s).

### Changed

- Start using "changelog" over "change log" since it's the common usage.
- Start versioning based on the current English version at 0.3.0 to help
  translation authors keep things up-to-date.
- Rewrite "What makes unicorns cry?" section.
- Rewrite "Ignoring Deprecations" sub-section to clarify the ideal
  scenario.
- Improve "Commit log diffs" sub-section to further argument against
  them.
- Merge "Why can’t people just use a git log diff?" with "Commit log
  diffs".
- Fix typos in Simplified Chinese and Traditional Chinese translations.
- Fix typos in Brazilian Portuguese translation.
- Fix typos in Turkish translation.
- Fix typos in Czech translation.
- Fix typos in Swedish translation.
- Improve phrasing in French translation.
- Fix phrasing and spelling in German translation.

### Removed

- Section about "changelog" vs "CHANGELOG".

## [0.3.0] - 2015-12-03

### Added

- RU translation from [@aishek](https://github.com/aishek).
- pt-BR translation from [@tallesl](https://github.com/tallesl).
- es-ES translation from [@ZeliosAriex](https://github.com/ZeliosAriex).

## [0.2.0] - 2015-10-06

### Changed

- Remove exclusionary mentions of "open source" since this project can
  benefit both "open" and "closed" source projects equally.

## [0.1.0] - 2015-10-06

### Added

- Answer "Should you ever rewrite a change log?".

### Changed

- Improve argument against commit logs.
- Start following [SemVer](https://semver.org) properly.

## [0.0.8] - 2015-02-17

### Changed

- Update year to match in every README example.
- Reluctantly stop making fun of Brits only, since most of the world
  writes dates in a strange way.

### Fixed

- Fix typos in recent README changes.
- Update outdated unreleased diff link.

## [0.0.7] - 2015-02-16

### Added

- Link, and make it obvious that date format is ISO 8601.

### Changed

- Clarified the section on "Is there a standard change log format?".

### Fixed

- Fix Markdown links to tag comparison URL with footnote-style links.

## [0.0.6] - 2014-12-12

### Added

- README section on "yanked" releases.

## [0.0.5] - 2014-08-09

### Added

- Markdown links to version tags on release headings.
- Unreleased section to gather unreleased changes and encourage note
  keeping prior to releases.

## [0.0.4] - 2014-08-09

### Added

- Better explanation of the difference between the file ("CHANGELOG")
  and its function "the change log".

### Changed

- Refer to a "change log" instead of a "CHANGELOG" throughout the site
  to differentiate between the file and the purpose of the file — the
  logging of changes.

### Removed

- Remove empty sections from CHANGELOG, they occupy too much space and
  create too much noise in the file. People will have to assume that the
  missing sections were intentionally left out because they contained no
  notable changes.

## [0.0.3] - 2014-08-09

### Added

- "Why should I care?" section mentioning The Changelog podcast.

## [0.0.2] - 2014-07-10

### Added

- Explanation of the recommended reverse chronological release ordering.

## [0.0.1] - 2014-05-31

### Added

- This CHANGELOG file to hopefully serve as an evolving example of a
  standardized open source project CHANGELOG.
- CNAME file to enable GitHub Pages custom domain.
- README now contains answers to common questions about CHANGELOGs.
- Good examples and basic guidelines, including proper date formatting.
- Counter-examples: "What makes unicorns cry?".

[unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.8...v0.1.0
[0.0.8]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/olivierlacan/keep-a-changelog/releases/tag/v0.0.1
```

### [](#what)更新日志是什么？

更新日志（Change Log）是一个由人工编辑、以时间为倒序的列表，用于记录项目中每个版本的显著变动。

### [](#why)为何要提供更新日志？

为了让用户和开发人员更简单清晰地知晓项目的不同版本之间有哪些显著变动。

### [](#who)哪些人需要更新日志？

人人需要更新日志。无论是用户还是开发者。当软件有变动时，大家希望知道改动是为何、以及如何进行的。

### [](#how)怎样制作高质量的更新日志？

#### [](#principles)指导原则

* 记住日志是写给*人*而非机器的。
* 每个版本都应该有独立的入口。
* 同类改动应该分组放置。
* 不同版本应分别设置链接。
* 新版本在前，旧版本在后。
* 应包括每个版本的发布日期。
* 注明是否遵守[语义化版本规范](https://semver.org/)。

[](#types)

#### 变动类型

* `Added` 新添加的功能。
* `Changed` 对现有功能的变更。
* `Deprecated` 已经不建议使用，即将移除的功能。
* `Removed` 已经移除的功能。
* `Fixed` 对 bug 的修复。
* `Security` 对安全性的改进。

### [](#effort)如何减少维护更新日志的精力？

在文档最上方提供 `Unreleased` 区块以记录即将发布的更新内容。

这样做有两个好处：

* 大家可以知道在未来版本中可能会有哪些变更。
* 在发布新版本时，直接将 `Unreleased` 区块中的内容移动至新发布版本的描述区块就可以了。

### [](#bad-practices)有很糟糕的更新日志吗？

当然有，下面就是一些糟糕的方式。

#### [](#log-diffs)使用 git 日志

使用 git 日志作为更新日志是个非常糟糕的方式：git 日志充满各种无意义的信息，如合并提交、语焉不详的提交标题、文档更新等。

提交的目的是记录源码的演化。一些项目会清理提交记录，一些则不会。

更新日志的目的则是记录重要的变更以供受众阅读，记录范围通常涵盖多次提交。

#### [](#ignoring-deprecations)无视即将弃用的功能

当从一个版本升级至另一个时，人们应清楚（尽管痛苦）地知道哪些部分将不再被支持。应该允许先升级至一个列出哪些功能将会被弃用的版本，待去掉那些不再支持的部分后，再升级至把那些弃用功能真正移除的版本。

即使其他什么都不做，也至少要在更新日志中列出 deprecations，removals 以及其他重大变动。

#### [](#confusing-dates)易混淆的日期格式

不同区域有着不同的时间格式，要找到让大家都满意的日期格式不是件容易的事。`2012-06-02` 的格式从大到小排列符合逻辑、不容易与其他日期格式混淆，而且还符合 [ISO 标准](https://www.iso.org/iso-8601-date-and-time-format.html)。因此，推荐在更新日志中采用使用此种日期格式。

#### [](#inconsistent-changes)不一致的变更

仅提到部分变更的更新日志可能和没有更新日志一样危险。 虽然许多变更可能并不相关 —— 例如，删除一个空格可能在所有情况下都不需要被记录下来 —— 但任何重要的变更都应该在更新日志中提及。 通过不一致地应用变更，你的用户可能会错误地认为更新日志是事实的唯一来源。 理应如此。能力越大，责任越大 —— 拥有一个好的更新日志意味着拥有一个一致性更新的更新日志。

还有更多内容？请通过 [Issues](https://github.com/olivierlacan/keep-a-changelog/issues) 或是 Pull Request 协助收集。

### [](#frequently-asked-questions)常见问题

#### [](#standard)是否有一个标准化的更新日志格式？

并没有。虽然有[GNU 更新日志指南](https://www.gnu.org/prep/standards/html_node/Style-of-Change-Logs.html#Style-of-Change-Logs)，以及那个仅有两段长的 [GNU - The NEWS File 指南](https://www.gnu.org/prep/standards/html_node/NEWS-File.html#NEWS-File)，但两者均远远不够。

此项目旨在提供一个 [更好的更新日志范例](https://github.com/olivierlacan/keep-a-changelog/blob/main/CHANGELOG.md)，所有点子都来自于对开源社区中优秀实例的观察与记录。

欢迎[提供](https://github.com/olivierlacan/keep-a-changelog/issues)有建设性的批评、讨论及建议。

#### [](#filename)更新日志文件应被如何命名？

通常使用 `CHANGELOG.md`。有些项目将其命名为 `HISTORY`、`NEWS` 或是 `RELEASES`。

当然，你可能认为更新日志的命名并不那么重要，但为什么要为难那些仅仅是想看到都有哪些重大变更的用户呢？

#### [](#github-releases)GitHub Releases 怎么样？

这是个非常好的提议。[GitHub Releases](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository) 可通过手动添加发布日志或将带有注释的 git 标签信息抓取后转换的方式，将简单的 git 标签（如一个叫 `v1.0.0` 的标签）转换为信息丰富的发布日志。

GitHub Releases 会创建一个非便携、仅可在 GitHub 环境下显示的更新日志。尽管会花费更多时间，但将之处理成更新日志格式是完全可能的。

现行版本的 GitHub Releases 不像那些典型的大写文件（`README`，`CONTRIBUTING` 等），仍可以认为是不利于用户探索的。另一个小问题则是目前的 GitHub Releases 界面并没有提供不同版本间的 commit 日志链接。

#### [](#automatic)更新日志可以被自动识别吗？

非常困难，因为有各种不同的文件格式和命名。

[Vandamme](https://github.com/tech-angels/vandamme/) 是一个 Ruby 程序，由 Gemnasium 团队制作，可以解析多种（但绝对不是全部）开源库的更新日志。

#### [](#yanked)那些后来撤下的版本怎么办？

因重大 bug 或安全性原因而被撤下的版本通常不会出现在更新日志中，但仍然建议记录下来。你可以这样作出记录：

`## [0.0.5] - 2014-12-13 [YANKED]`

因为这类更改十分重要，所以 `[YANKED]` 标签应该非常醒目。此外，用方括号包围可使其更易被程序识别。

#### [](#rewrite)是否可以重写更新日志？

当然可以。总会有合适的原因去改进更新日志。我也时常提 Pull Request 来为那些未维护更新日志的开源项目加入缺失的发布信息。

另外，你很有可能发现自己忘记记录一个重大功能更新。这种情况下显然应该重写更新日志。

#### [](#contribute)如何贡献？

本文档并非**真理**。而是我深思熟虑后的建议，以及我收集的信息与样例。

希望我们的社区可以对此达成一致。我相信讨论的过程与最终结果一样重要。

所以欢迎 **[贡献](https://github.com/olivierlacan/keep-a-changelog)** 。
