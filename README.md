# jayjfu.github.io

Personal homepage and technical blog of Jian (Jay) Fu, built with Jekyll for GitHub Pages.

## Deploy

1. Create a public repo named exactly `jayjfu.github.io`.
2. In `_config.yml`, set `email` and the `social` links. Check the repo links in `_data/projects.yml`.
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
tags: [LLM, post-training, coding]   # drive the Writing filters and Focus cards
---
```

Writing shows 6 posts at a time with a "Show more" button. Tag buttons filter with AND logic (a post must carry every selected tag). Each card in `_data/focus.yml` is a saved tag combination. Clicking it applies those tags to Writing, so a focus like `LLM + post-training + coding` lists exactly the posts on that topic. Tags match regardless of case.

`_posts/2026-11-19-how-this-blog-works.md` shows every supported feature: KaTeX math, code with copy buttons, callouts, tables, figures, footnotes, the table of contents and the BibTeX "Cite this post" block. Delete it, or keep it as a reference.

## Project Structure

```
_config.yml          site settings (name, links, URL)
_data/projects.yml   "Selected work" cards
_data/focus.yml      "What I'm focused on" cards (tag combinations)
_layouts/            default, post
_includes/           head, header, social links, figure, post row
_posts/              blog posts (Markdown)
assets/css/main.css  all styles and the light/dark theme
assets/js/site.js    theme toggle, TOC, callouts, copy buttons, tag filter, show more, focus cards, nav highlight
index.html           the whole site: intro, writing, work, focus
```
