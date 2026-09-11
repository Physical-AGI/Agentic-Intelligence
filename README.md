# AGI: Agentic Intelligence and Latent Lookahead for Robust Manipulation

Project page for the ICRA 2027 submission.

A closed-loop manipulation policy: a frozen vision-language agent proposes programs in a
**nine-primitive robot DSL**, a **Code-to-Token Bridge** conditions a JEPA-style latent dynamics
model, and a **learned verifier** ranks imagined trajectories before the arm moves. On LIBERO-PRO
Spatial the complete loop reaches 0.50 Position and 0.49 Task success, where OpenVLA and pi-0 score
0.00. Across Meta-World difficulty splits it averages 94.0%. On a physical AgileX Piper 6-DoF arm,
AGI achieves 83.8% (67/80) overall success across single-object and sequential two-object placement tasks.

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
index.html              # the complete project page
rollouts.html           # LIBERO-X rollout browser (generated, see below)
rollouts/               # one sprite per rollout, lazy-loaded by rollouts.html
static/css/index.css    # theme + interactive component styles
static/js/index.js      # nav, loop walkthrough, results matrix, rule builder, lightbox
static/images/          # publication figures rendered from the paper
static/videos/          # real-robot MP4 demonstration videos (H.264) and posters
```

`rollouts.html` and `rollouts/` are generated, never hand-edited. Each task is one vertical
sprite of eight frames that the page shifts to scrub, so a visitor downloads only the rollouts
they scroll to rather than one large bundle:

```bash
cd ../AGI
python tools/make_liberox_frames_figure.py --web ../AgenticIntelligence
```

## Where the numbers come from

Every figure and number on the page is transcribed from the paper source at
`../AGI/ICRA'27_Agentic Intelligence/root.tex`:

| Page section | Paper source |
|---|---|
| Teaser | `Figs/teaser.pdf` (`fig:teaser`) |
| Framework figure | `Figs/framework.pdf` (`fig:arch`) |
| Real-robot manipulation | Section VII, `Figs/real_robot.jpg` (`fig:real-robot`), 4 video demos |
| Latent imagination rollouts | `Figs/liberox_latent_imagination.png` (`fig:latent-imagination`) |
| LIBERO-PRO heatmap | `Figs/fig_libero_pro_heatmap.png` (`fig:libero-pro-heatmap`) |
| LIBERO-PRO matrix | Table `tab:libero_pro` |
| Meta-World + LIBERO-X | Table `tab:cross_benchmark` |
| LIBERO-X robustness curves | `Figs/fig_robustness.png` (`fig:robustness-retention`) |
| Decision-rule builder | Section VI-B, Eq. (5) |
| Selector diagnostic & figure | `Figs/fig_selector.png` (`fig:selector-summary`) |
| Interface diagnostics | Table `tab:ablation_interface` |
| Planning cost | Table `tab:realtime` (`tab:cost`), `Figs/fig_cost.png` |
| Auditability trace | `Figs/interpretability_vs_blackbox.png` (`fig:interpretability`) |
| Qualitative rollouts | `Figs/LIBERO_Pro_four_suite_successful_frames.jpg` |
| Meta-World rollouts | `Figs/MetaWorld_four_difficulty_successful_frames.jpg` |
| LIBERO-X rollouts | `Figs/LIBEROX_four_verb_successful_frames.jpg` |

Machine-readable copies of the tables live in `../AGI/results/paper/*.json`. If the paper
tables change, update `PRO_METHODS` / `RULES` in `static/js/index.js` and the static tables in
`index.html` to match.

The two rollout figures are rebuilt from the evaluation logs, not hand-assembled:

```bash
cd ../AGI
python tools/make_metaworld_frames_figure.py     # --list / --score / --tasks to swap a row
python tools/make_liberox_frames_figure.py       # --list / --tasks to swap a row
cp "ICRA'27_Agentic Intelligence/Figs/MetaWorld_four_difficulty_successful_frames.jpg" \
   ../AgenticIntelligence/static/images/metaworld_frames.jpg
cp "ICRA'27_Agentic Intelligence/Figs/LIBEROX_four_verb_successful_frames.jpg" \
   ../AgenticIntelligence/static/images/liberox_frames.jpg
```

Both draw only on episodes the success checker accepted. Note that they come from runs on our own
hardware: the Meta-World panel above is a cross-paper comparison with a different protocol, and the
LIBERO-X sweep behind those frames uses a different checkpoint and task set from the severity table.
The captions say so.

Page template adapted from [Nerfies](https://nerfies.github.io), licensed
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
