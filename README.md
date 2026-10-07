# Verbes — French verb trainer

A phone-first web app for daily conjugation practice: 10–20 exercises a day over
41 verbs, fifteen tenses, spaced repetition, and no English anywhere.

No dependencies, no build step, no Node. Plain HTML/CSS/JS. A sibling of
[Verbos](https://github.com/dc0192648/Verbos), the Spanish version, but an
independent project: no shared code.

---

## Getting it on your iPhone

Open the published address in **Safari** (Chrome on iOS cannot add to the Home
Screen), tap **Share** → **Add to Home Screen** → **Add**. It launches fullscreen
with its own icon and works with no signal.

### Moving your progress

Progress lives in the browser's local storage, which does **not** follow you from
one address to another. To carry it over:

1. On the old one: **Réglages** → **Copier** (under *Sauvegarde*).
2. On the new one: **Réglages** → **Importer…** and paste.

Do this occasionally as a backup too — clearing Safari's website data erases
progress.

---

## Using it

- **Exercices** — the daily session. The subject is given (*je*, *qu'il*…);
  type the verb form that fills the blank, then tap *Vérifier*. Compound tenses
  take the whole form (*suis allée*), pronominal verbs include the pronoun
  (*me lève*, *m'étais levé*). Accents matter: a missing accent shows as
  *presque* and the item does not advance. Agreement with *être* and both
  spellings of *payer* (*paie* / *paye*) are accepted.
- **Verbes** — all 41 verbs. Tap one for full tables across every tense;
  highlights show what is irregular about each form, the dot shows how well you
  know it. Tap any form to drill it now.
- **Réglages** — daily target, which tenses are active, backup and reset.

### Start small

It ships with **présent + passé composé** active — about 490 items. Switching
more tenses on adds them gradually as new material. The four literary tenses
(passé simple, passé antérieur, subjonctif imparfait and plus-que-parfait) are
there but off by default. Turning a tense **off freezes** its progress rather
than deleting it.

---

## Files

| File | What it is |
|---|---|
| `app/index.html` | The app — UI, spaced repetition, storage |
| `app/engine.js` | Conjugation engine. Produces every form for every verb |
| `app/data.js` | Sentence frames, grammar notes, answer checking |
| `app/frequency.js` | Corpus counts that decide which new forms come first (generated) |
| `tests/tests.html` / `tests/tests.js` | ~1600 assertions. Open `tests.html` to run them |
| `app/sw.js`, `app/manifest.json`, `app/icons/` | What makes it installable and offline |
| `scripts/build.py` | Inlines the scripts into `dist/index.html` (single-file build) |
| `scripts/mirror.py` | Regenerates `publish/` from `app/` — what gets deployed |
| `scripts/count_freq.py` | Downloads the UD French treebanks and regenerates `app/frequency.js` |
| `scripts/make_icons.py` | Regenerates the icons (stdlib only, no Pillow) |
| `scripts/serve.py` | Local dev server: `python3 scripts/serve.py` → localhost:8766 |

## Working on it

Run the tests before and after any change to `app/engine.js` or `app/data.js`:

```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc app/engine.js app/data.js tests/tests.js
```

Or in a browser: `python3 scripts/serve.py`, then open
`http://127.0.0.1:8766/tests/tests.html`.

- **Answers are computed, never stored.** `data.js` holds sentences but no
  French answer strings — the engine supplies them, including every accepted
  variant (`CONJ.variants`). That keeps a typo from reaching an answer key.
- After editing `app/`, run `python3 scripts/mirror.py` to update `publish/`,
  and bump `CACHE` in `app/sw.js` — the service worker serves its cached copy
  first by design.
