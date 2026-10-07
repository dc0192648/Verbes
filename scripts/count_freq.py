#!/usr/bin/env python3
"""Count verb x tense frequencies in the UD French treebanks -> app/frequency.js.

Standard library only. Downloads UD_French-GSD and UD_French-Sequoia (release
branch) into corpus/ (gitignored) on first run, then counts one cell per
(verb, tense), summed across person — like Verbos, the weighting only needs
"how common is this verb in this tense".

Compound tenses: UD splits "a parlé" into an auxiliary token plus a past
participle. Counting tokens naively would give passé composé ~0 and inflate
avoir/être. So a past participle with an `aux:tense` child takes its tense
from that auxiliary (Ind Pres -> passeCompose, Ind Imp -> pqp, ...), and the
`aux:tense` token itself is not counted as a use of avoir/être. Passive
`aux:pass` is skipped for the same reason.

    python3 scripts/count_freq.py
"""
import os
import sys
import urllib.request

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORPUS = os.path.join(HERE, 'corpus')
OUT = os.path.join(HERE, 'app', 'frequency.js')

BASE = 'https://raw.githubusercontent.com/UniversalDependencies/%s/master/%s'
FILES = [
    ('UD_French-GSD', 'fr_gsd-ud-%s.conllu'),
    ('UD_French-Sequoia', 'fr_sequoia-ud-%s.conllu'),
]
SPLITS = ('train', 'dev', 'test')

VERBS = [
    'être', 'avoir', 'aller', 'faire', 'dire', 'pouvoir', 'vouloir', 'savoir',
    'voir', 'venir', 'devoir', 'prendre', 'mettre', 'croire', 'tenir',
    'recevoir', 'boire', 'lire', 'écrire', 'vivre', 'connaître', 'conduire',
    'ouvrir', 'courir', 'mourir', 'naître', 'partir', 'sortir', 'dormir',
    'rendre', 'attendre', 'parler', 'finir', 'manger', 'commencer', 'acheter',
    'appeler', 'préférer', 'payer', 'envoyer', 'se lever',
]
TENSES = ['pres', 'imparf', 'passeSimple', 'futur', 'cond', 'passeCompose',
          'pqp', 'passeAnt', 'futAnt', 'condPasse', 'subjPres', 'subjPasse',
          'subjImparf', 'subjPqp', 'imperatif']

# (Mood, Tense) of a finite form -> simple tense key
SIMPLE = {
    ('Ind', 'Pres'): 'pres', ('Ind', 'Imp'): 'imparf', ('Ind', 'Past'): 'passeSimple',
    ('Ind', 'Fut'): 'futur', ('Cnd', 'Pres'): 'cond', ('Cnd', None): 'cond',
    ('Sub', 'Pres'): 'subjPres', ('Sub', 'Imp'): 'subjImparf',
    ('Imp', 'Pres'): 'imperatif', ('Imp', None): 'imperatif',
}
# simple tense of the auxiliary -> compound tense of the participle
COMPOUND = {
    'pres': 'passeCompose', 'imparf': 'pqp', 'passeSimple': 'passeAnt',
    'futur': 'futAnt', 'cond': 'condPasse', 'subjPres': 'subjPasse',
    'subjImparf': 'subjPqp',
}


def fetch():
    os.makedirs(CORPUS, exist_ok=True)
    paths = []
    for repo, pattern in FILES:
        for split in SPLITS:
            name = pattern % split
            path = os.path.join(CORPUS, name)
            if not os.path.exists(path):
                url = BASE % (repo, name)
                sys.stderr.write('fetching %s\n' % url)
                with urllib.request.urlopen(url) as r, open(path, 'wb') as f:
                    f.write(r.read())
            paths.append(path)
    return paths


def feats(s):
    if s == '_':
        return {}
    return dict(kv.split('=', 1) for kv in s.split('|') if '=' in kv)


def simple_tense(f):
    if f.get('VerbForm') != 'Fin':
        return None
    mood, tense = f.get('Mood'), f.get('Tense')
    return SIMPLE.get((mood, tense)) or SIMPLE.get((mood, None))


def sentences(path):
    sent = []
    with open(path, encoding='utf-8') as fh:
        for line in fh:
            line = line.rstrip('\n')
            if not line:
                if sent:
                    yield sent
                sent = []
                continue
            if line.startswith('#'):
                continue
            cols = line.split('\t')
            if '-' in cols[0] or '.' in cols[0]:
                continue                    # multiword token / empty node
            sent.append({'id': cols[0], 'lemma': cols[2], 'upos': cols[3],
                         'feats': feats(cols[5]), 'head': cols[6], 'deprel': cols[7]})
    if sent:
        yield sent


def count(paths):
    cells = {t: {} for t in TENSES}
    wanted = set(VERBS)

    def bump(tense, verb):
        cells[tense][verb] = cells[tense].get(verb, 0) + 1

    for path in paths:
        for sent in sentences(path):
            kids = {}
            for tok in sent:
                kids.setdefault(tok['head'], []).append(tok)
            for tok in sent:
                if tok['upos'] not in ('VERB', 'AUX'):
                    continue
                rel = tok['deprel']
                if rel.startswith('aux:tense') or rel.startswith('aux:pass'):
                    continue                # counted through its participle
                lemma = tok['lemma']
                if lemma == 'lever' and any(k['deprel'].startswith('expl')
                                            for k in kids.get(tok['id'], [])):
                    lemma = 'se lever'
                if lemma not in wanted:
                    continue
                f = tok['feats']
                if f.get('VerbForm') == 'Part':
                    # recent UD French releases move Tense=Past out of FEATS,
                    # so the aux:tense child is the signal, not the feature
                    auxes = [k for k in kids.get(tok['id'], [])
                             if k['deprel'].startswith('aux:tense')]
                    if not auxes:
                        continue            # bare participle: not a conjugated form
                    t = simple_tense(auxes[0]['feats'])
                    if t in COMPOUND:
                        bump(COMPOUND[t], lemma)
                    continue
                t = simple_tense(f)
                if t:
                    bump(t, lemma)
    return cells


def write(cells, paths):
    lines = []
    for t in TENSES:
        row = sorted(cells[t].items(), key=lambda kv: (-kv[1], kv[0]))
        body = ', '.join("'%s': %d" % (v, n) for v, n in row)
        lines.append('    %s: { %s }' % (t, body))
    js = '''/* frequency.js -- corpus frequency counts for new-card selection weighting.
 *
 * GENERATED by scripts/count_freq.py -- do not edit by hand.
 *
 * Source: UD_French-GSD + UD_French-Sequoia (all splits), written register,
 * hand-checked morphology. Counts are per (verb, tense) cell, summed across
 * person/number. Compound tenses are counted on the participle, with the
 * tense read off its aux:tense auxiliary; the auxiliary itself is not counted
 * as a use of avoir/etre. Only non-zero cells are stored; FREQ.count()
 * returns 0 for anything absent.
 *
 * Known caveats in the source data (kept as-is, not corrected for): it is
 * news, wiki and administrative prose, so the impératif and the 1st/2nd
 * persons are drastically undercounted relative to speech, and the passé
 * simple shows up in narrative/encyclopedic text more than in conversation.
 * Se lever is counted only where the parse marks the reflexive pronoun. Etre
 * as a copula ("a ete content") hangs its auxiliary off the predicate, not off
 * "ete", so etre's own compound tenses are undercounted.
 */
var FREQ = (function () {
  var CELLS = {
%s
  };

  function count(verb, tense) {
    var row = CELLS[tense];
    return (row && row[verb]) || 0;
  }

  return { count: count, CELLS: CELLS };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = FREQ;
''' % ',\n'.join(lines)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(js)
    sys.stderr.write('wrote %s from %d files\n' % (OUT, len(paths)))


def main():
    paths = fetch()
    cells = count(paths)
    write(cells, paths)
    for t in TENSES:
        sys.stderr.write('%-13s %6d\n' % (t, sum(cells[t].values())))


if __name__ == '__main__':
    main()
