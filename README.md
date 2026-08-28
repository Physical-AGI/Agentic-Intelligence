# Agentic Intelligence and Latent Lookahead for Robust Manipulation

Project page for the ICRA 2027 submission.

A closed-loop manipulation policy: a frozen vision-language agent proposes programs in a
**nine-primitive robot DSL**, a **Code-to-Token Bridge** conditions a JEPA-style latent dynamics
model, and a **learned verifier** ranks imagined trajectories before the arm moves. On LIBERO-PRO
Spatial the complete loop reaches 0.50 Position and 0.49 Task success, where OpenVLA and pi-0 score
0.00. Across Meta-World difficulty splits it averages 94.0%.

## Anonymity

The paper is currently submitted as "Anonymous Authors", so this page is **author-blind on purpose**:
no names, no affiliations, no `citation_author` meta tags, no personal or repository links. Every
place that needs updating after de-anonymization is marked with a `TODO` comment in `index.html`:

1. Uncomment the author block in the hero section.
2. Uncomment the `citation_author` / `citation_pdf_url` meta tags.
3. Replace every `REPLACE-ME` URL with the real project domain.
4. Replace the `.is-pending` placeholder buttons with real arXiv, PDF and code links.
5. Replace the placeholder BibTeX entry.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html              # the whole page
static/css/index.css    # theme + interactive component styles
static/js/index.js      # nav, loop walkthrough, results matrix, rule builder, lightbox
static/images/          # figures copied from the paper
```

## Where the numbers come from

Every figure and number on the page is transcribed from the paper source at
`../AGI/ICRA'27_Agentic Model/00.main.tex`:

| Page section | Paper source |
|---|---|
| Teaser | `Figs/teaser.png` (`fig:teaser`) |
| Framework figure | `Figs/Model_Figure.png` (`fig:arch`) |
| LIBERO-PRO matrix | Table `tab:libero_pro` |
| Meta-World + LIBERO-X | Table `tab:metaworld` / `tab:liberox` |
| Decision-rule builder | Table `tab:ablation_selector`, panel (a) |
| Selector ladder | Table `tab:ablation_selector`, panel (b) |
| Interface diagnostics | Table `tab:ablation_interface` |
| Planning cost | Table `tab:realtime` |
| Qualitative rollouts | `Figs/LIBERO_four_suite_successful_frames.jpg` |
| Auditability | `Figs/interpretability_vs_blackbox.png` |

Machine-readable copies of the same tables live in `../AGI/results/paper/*.json`. If the paper
tables change, update `PRO_METHODS` / `RULES` in `static/js/index.js` and the static tables in
`index.html` to match.

Page template adapted from [Nerfies](https://nerfies.github.io), licensed
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
