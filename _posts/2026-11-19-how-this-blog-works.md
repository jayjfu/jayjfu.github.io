---
title: "How this blog works: math, code, figures and notes"
description: A reference post showing every formatting feature this site supports. Copy it as a template for new posts.
category: Notes
tags: [meta, template]
---

This post is a living style guide. Every new post is a Markdown file in `_posts/` named `YYYY-MM-DD-slug.md`. Copy this file as a starting point and delete the parts you don't need.

## Front matter

```yaml
---
title: "Reproducing DPO on a 1B model"
description: One-sentence summary shown in lists and link previews.
category: Research        # Research | Notes | Findings, used by the blog filter
tags: [post-training, dpo]
updated: 2026-12-01       # optional
math: true                # default true for posts
toc: true                 # "On this page" sidebar; a sticky bar on narrower screens
---
```

## Math

Inline math uses double dollars, $$\pi_\theta(y \mid x)$$, and a display equation goes on its own lines:

$$
\mathcal{L}_{\text{DPO}} = -\,\mathbb{E}_{(x, y_w, y_l)}\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}\right)\right]
$$

## Code

```python
def dpo_loss(policy_chosen, policy_rejected, ref_chosen, ref_rejected, beta=0.1):
    chosen_margin = policy_chosen - ref_chosen
    rejected_margin = policy_rejected - ref_rejected
    return -F.logsigmoid(beta * (chosen_margin - rejected_margin)).mean()
```

## Callouts

> **Finding.** Use a blockquote that starts with a bolded label for the key takeaway of a post. It renders as a highlighted callout.

Without the bold label, a blockquote stays a regular quotation:

> A plain blockquote stays a quiet quotation.

## Tables

| Model | Params | Win rate vs SFT |
|:--|--:|--:|
| SFT | 1.2B | 50.0% |
| + DPO | 1.2B | 63.4% |
| + PPO | 1.2B | 61.8% |

*(The numbers are placeholders.)*

## Figures

Put images in `assets/img/` and use the figure include:

{% raw %}
```liquid
{% include figure.html src="/assets/img/loss-curve.png" caption="**Fig. 1.** Training loss." %}
```
{% endraw %}

## Footnotes

Footnotes are handy for asides.[^1] They're collected at the end of the post.

[^1]: Like this one.
