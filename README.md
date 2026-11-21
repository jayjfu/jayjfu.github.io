# jayjfu.github.io

Personal homepage and technical blog of Jian (Jay) Fu, built with Jekyll for GitHub Pages.

## Deploy

1. Create a public repo named exactly `jayjfu.github.io`.
2. In `_config.yml`, set `email` and the `social` links. Check the repo links in `_data/focus.yml`.
3. Push to `main`. In **Settings → Pages**, set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
4. The site goes live at `https://jayjfu.github.io` within a minute or two.

## Run locally

```bash
bundle install
bundle exec jekyll serve --livereload
```

## Write a post

Add `_posts/YYYY-MM-DD-slug.md`:

```yaml
---
title: "Reproducing DPO on a 1B model"
description: One-line summary for lists and link previews.
category: Research   # Research | Notes | Findings (label shown on the post)
tags: [LLM Coding, DPO, "NLP: Text-to-Text"]   # spelled as in _data/tags.yml
---
```

Writing shows 6 posts at a time with a "Show more" button. Tag buttons filter with AND logic (a post must carry every selected tag). `_data/focus.yml` defines the Focus areas (LLM Training, Retrieval and Ranking, ...). Each area has topics and projects. A topic is a saved tag combination: clicking it applies those tags to Writing, so the `LLM Coding` topic lists exactly the posts tagged that way. A project with a `status` also shows in the intro's "Now building" line. The right rail groups tags as listed in `_data/tags.yml` (tags not listed there go under "Other"); dashed tags have no posts yet. The intro shows the two newest posts, and scrolling inside that box loads more. Filtering ignores case, but post counts need the exact spelling.

`_posts/2026-11-19-how-this-blog-works.md` shows every supported feature: KaTeX math, code with copy buttons, callouts, tables, figures, footnotes, the table of contents and the BibTeX "Cite this post" block. Delete it, or keep it as a reference.

## Project Structure

```
_config.yml          site settings (name, links, URL)
_data/focus.yml      Focus areas: summary, topics (tag combinations) and projects
_data/tags.yml       tag groups (Highlights, Methods, Task Name, Task Type) for the rail and filters
_data/timeline.yml   education and experience timeline in the intro
_layouts/            default, post
_includes/           head, header, social links, figure, post row
_posts/              blog posts (Markdown)
assets/css/main.css  all styles and the light/dark theme
assets/js/site.js    theme toggle, TOC, callouts, copy buttons, tag filter, show more, focus cards, nav highlight
index.html           home page: about (intro, recent posts, timeline), focus areas, writing, right rail (TOC + tags)
```
