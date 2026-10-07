/* engine.js — French conjugation engine. No dependencies, no build step.
 *
 * CONJ.conjugate(inf, tense, person) -> string     (the primary form)
 * CONJ.variants(inf, tense, person)  -> [string]   (every accepted form)
 *
 * Design note: exercise answers are COMPUTED here rather than stored in the
 * sentence bank, so a content typo can never reach an answer key and a fix
 * here silently corrects every affected exercise. Keep it that way.
 */
const CONJ = (function () {
  'use strict';

  /* ---------- persons ---------- */

  const PERSONS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  // French cannot drop vous the way Verbos drops vosotros: all six are drilled.
  const DRILL_PERSONS = PERSONS.slice();
  const IDX = { je: 0, tu: 1, il: 2, nous: 3, vous: 4, ils: 5 };
  const PLURAL = { je: false, tu: false, il: false, nous: true, vous: true, ils: true };

  const PERSON_LABEL = {
    je: 'je',
    tu: 'tu',
    il: 'il / elle / on',
    nous: 'nous',
    vous: 'vous',
    ils: 'ils / elles'
  };
  // the pronoun actually written in front of the blank
  const SUBJECT = { je: 'je', tu: 'tu', il: 'il', nous: 'nous', vous: 'vous', ils: 'ils' };
  const IMP_PERSONS = ['tu', 'nous', 'vous'];
  const IMP_IDX = { tu: 0, nous: 1, vous: 2 };
  const IMP_LABEL = { tu: 'tu', nous: 'nous', vous: 'vous' };

  /* ---------- tenses ---------- */

  const TENSES = {
    // badge: time + name, unique on its own; the UI adds the mood as color + glyph
    pres:         { label: 'Présent',                     badge: 'présent',                   mood: 'ind' },
    imparf:       { label: 'Imparfait',                   badge: 'passé · imparfait',         mood: 'ind' },
    passeSimple:  { label: 'Passé simple',                badge: 'passé · simple',            mood: 'ind', literary: true },
    futur:        { label: 'Futur simple',                badge: 'futur',                     mood: 'ind' },
    cond:         { label: 'Conditionnel présent',        badge: 'conditionnel',              mood: 'ind' },
    passeCompose: { label: 'Passé composé',               badge: 'passé · composé',           mood: 'ind', compound: 'pres' },
    pqp:          { label: 'Plus-que-parfait',            badge: 'passé · plus-que-parfait',  mood: 'ind', compound: 'imparf' },
    passeAnt:     { label: 'Passé antérieur',             badge: 'passé · antérieur',         mood: 'ind', compound: 'passeSimple', literary: true },
    futAnt:       { label: 'Futur antérieur',             badge: 'futur · antérieur',         mood: 'ind', compound: 'futur' },
    condPasse:    { label: 'Conditionnel passé',          badge: 'conditionnel · passé',      mood: 'ind', compound: 'cond' },
    subjPres:     { label: 'Subjonctif présent',          badge: 'présent · subj.',           mood: 'subj' },
    subjPasse:    { label: 'Subjonctif passé',            badge: 'passé · subj.',             mood: 'subj', compound: 'subjPres' },
    subjImparf:   { label: 'Subjonctif imparfait',        badge: 'imparfait · subj.',         mood: 'subj', literary: true },
    subjPqp:      { label: 'Subjonctif plus-que-parfait', badge: 'plus-que-parfait · subj.',  mood: 'subj', compound: 'subjImparf', literary: true },
    // ne … pas wraps the verb, so the negative imperative can't be one blank
    imperatif:    { label: 'Impératif',                   badge: 'impératif',                 mood: 'imp', persons: IMP_PERSONS }
  };
  const TENSE_KEYS = Object.keys(TENSES);

  /* ---------- regular endings ---------- */

  const END = {
    pres: {
      er:  ['e', 'es', 'e', 'ons', 'ez', 'ent'],
      ir2: ['is', 'is', 'it', 'issons', 'issez', 'issent'],
      re:  ['s', 's', 't', 'ons', 'ez', 'ent']
    },
    imparf:   ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
    futur:    ['ai', 'as', 'a', 'ons', 'ez', 'ont'],
    cond:     ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
    subjPres: ['e', 'es', 'e', 'ions', 'iez', 'ent'],
    ps: {
      a:  ['ai', 'as', 'a', 'âmes', 'âtes', 'èrent'],
      i:  ['is', 'is', 'it', 'îmes', 'îtes', 'irent'],
      u:  ['us', 'us', 'ut', 'ûmes', 'ûtes', 'urent'],
      in: ['ins', 'ins', 'int', 'înmes', 'întes', 'inrent']
    },
    // 3rd singular is circumflex + t on the stem: parlât, finît, fût, vînt
    subjImparf: ['sse', 'sses', 't', 'ssions', 'ssiez', 'ssent']
  };

  // -er present endings that begin with a mute e (je, tu, il, ils)
  const MUTE = [true, true, true, false, false, true];

  const REFL = { je: 'me', tu: 'te', il: 'se', nous: 'nous', vous: 'vous', ils: 'se' };
  const REFL_IMP = { tu: 'toi', nous: 'nous', vous: 'vous' };

  /* ---------- string helpers ---------- */

  const VOWEL_START = /^[aeiouyhàâäéèêëîïôöûùüœ]/;

  /* je/me/te/se/que lose their e before a vowel: j'ai, m'étais, qu'il. */
  function elide(word, next) {
    if (/e$/.test(word) && VOWEL_START.test(next)) return word.slice(0, -1) + '\'' + next;
    return word + ' ' + next;
  }

  const CIRC = { a: 'â', i: 'î', u: 'û' };
  function circumflexLast(s) {
    for (let i = s.length - 1; i >= 0; i--) {
      if (CIRC[s[i]]) return s.slice(0, i) + CIRC[s[i]] + s.slice(i + 1);
    }
    return s;
  }

  function replaceLast(s, from, to) {
    const i = s.lastIndexOf(from);
    return i < 0 ? s : s.slice(0, i) + to + s.slice(i + from.length);
  }

  function stemOf(inf) { return inf.replace(/(er|ir|oir|re)$/, ''); }

  /* er = 1st group, ir2 = 2nd group (-iss-), re = everything else. The 3rd
     group has no single pattern, so it is measured against rendre. */
  function classOf(v) {
    if (v.group === 2) return 'ir2';
    if (/er$/.test(v.inf)) return 'er';
    return 're';
  }

  /* Spelling changes keep the SOUND regular: mangeons, commençais. */
  function soften(v, stem, ending) {
    if (!v.spell || !/^[aâo]/.test(ending)) return stem;
    return v.spell === 'ger' ? stem + 'e' : stem.replace(/c$/, 'ç');
  }

  /* Before a mute e the stem shifts: achète, appelle, préfère, paie.
     `alt` keeps the y of payer (paye), which is equally standard. */
  function muteStem(v, stem, alt) {
    if (v.mute === 'è') stem = replaceLast(stem, 'e', 'è');
    else if (v.mute === 'é') stem = replaceLast(stem, 'é', 'è');
    else if (v.mute === 'll') stem = stem + 'l';
    if (v.ySpell && !(alt && v.yAlt)) stem = stem.replace(/y$/, 'i');
    return stem;
  }

  /* ---------- verb table ----------
   *
   * Only deviations are recorded; anything absent is regular.
   *   pres        all six present forms
   *   presStems   [singular, nous/vous, ils] stems for the 3rd group
   *   presX       -x, -x, -t in the singular (peux, veux)
   *   presEr      present takes -er endings (ouvrir: ouvre)
   *   circ        î before t (connaît, naîtrai); the 1990 spelling without it is accepted
   *   imparfStem  imparfait stem, where it isn't the nous stem (être: ét-)
   *   psStem      passé simple stem    psType: 'a' | 'i' | 'u' | 'in'
   *   futStem     future/conditional stem
   *   subj        all six subjonctif présent forms
   *   subjStems   [je/tu/il/ils, nous/vous] subjonctif stems
   *   part        past participle
   *   imperatif   [tu, nous, vous]
   *   aux         'etre' for verbs conjugated with être (agreement applies)
   *   mute        'è' (acheter), 'é' (préférer), 'll' (appeler): stem before a mute e
   *   yAlt        payer: the y spelling (paye, payerai) is accepted too
   *   noImp       no imperative drilled
   *   suppletive  no regular twin to compare against (être, avoir)
   * -ger/-cer/-yer spelling changes are detected from the infinitive.
   */
  const VERBS = {
    'être':     { suppletive: true,
                  pres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
                  imparfStem: 'ét', psStem: 'f', psType: 'u', futStem: 'ser',
                  subj: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
                  part: 'été', imperatif: ['sois', 'soyons', 'soyez'] },
    avoir:      { suppletive: true,
                  pres: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
                  psStem: 'e', psType: 'u', futStem: 'aur',
                  subj: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
                  part: 'eu', imperatif: ['aie', 'ayons', 'ayez'] },
    aller:      { aux: 'etre', pres: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
                  futStem: 'ir', subjStems: ['aill', 'all'] },
    faire:      { pres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
                  psStem: 'f', futStem: 'fer', subjStems: ['fass', 'fass'], part: 'fait' },
    dire:       { pres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
                  psStem: 'd', part: 'dit' },
    pouvoir:    { presStems: ['peu', 'pouv', 'peuv'], presX: true, psStem: 'p', psType: 'u',
                  futStem: 'pourr', subjStems: ['puiss', 'puiss'], part: 'pu', noImp: true },
    vouloir:    { presStems: ['veu', 'voul', 'veul'], presX: true, psType: 'u',
                  futStem: 'voudr', subjStems: ['veuill', 'voul'],
                  imperatif: ['veuille', 'veuillons', 'veuillez'] },
    savoir:     { presStems: ['sai', 'sav', 'sav'], psStem: 's', psType: 'u', futStem: 'saur',
                  subjStems: ['sach', 'sach'], part: 'su',
                  imperatif: ['sache', 'sachons', 'sachez'] },
    voir:       { presStems: ['voi', 'voy', 'voi'], futStem: 'verr', part: 'vu' },
    venir:      { aux: 'etre', presStems: ['vien', 'ven', 'vienn'], psStem: 'v', psType: 'in',
                  futStem: 'viendr', part: 'venu' },
    devoir:     { presStems: ['doi', 'dev', 'doiv'], psStem: 'd', psType: 'u', part: 'dû', noImp: true },
    prendre:    { presStems: ['prend', 'pren', 'prenn'], psStem: 'pr', part: 'pris' },
    mettre:     { presStems: ['met', 'mett', 'mett'], psStem: 'm', part: 'mis' },
    croire:     { presStems: ['croi', 'croy', 'croi'], psStem: 'cr', psType: 'u', part: 'cru' },
    tenir:      { presStems: ['tien', 'ten', 'tienn'], psStem: 't', psType: 'in',
                  futStem: 'tiendr', part: 'tenu' },
    recevoir:   { presStems: ['reçoi', 'recev', 'reçoiv'], psStem: 'reç', psType: 'u', part: 'reçu' },
    boire:      { presStems: ['boi', 'buv', 'boiv'], psStem: 'b', psType: 'u', part: 'bu' },
    lire:       { presStems: ['li', 'lis', 'lis'], psStem: 'l', psType: 'u', part: 'lu' },
    'écrire':   { presStems: ['écri', 'écriv', 'écriv'], psStem: 'écriv', part: 'écrit' },
    vivre:      { presStems: ['vi', 'viv', 'viv'], psStem: 'véc', psType: 'u', part: 'vécu' },
    'connaître': { presStems: ['connai', 'connaiss', 'connaiss'], circ: true,
                  psStem: 'conn', psType: 'u', part: 'connu' },
    conduire:   { presStems: ['condui', 'conduis', 'conduis'], psStem: 'conduis', part: 'conduit' },
    ouvrir:     { presEr: true, part: 'ouvert' },
    courir:     { psType: 'u', futStem: 'courr', part: 'couru' },
    mourir:     { aux: 'etre', presStems: ['meur', 'mour', 'meur'], psType: 'u',
                  futStem: 'mourr', part: 'mort' },
    'naître':   { aux: 'etre', presStems: ['nai', 'naiss', 'naiss'], circ: true,
                  psStem: 'naqu', part: 'né', noImp: true },
    partir:     { aux: 'etre', presStems: ['par', 'part', 'part'] },
    sortir:     { aux: 'etre', presStems: ['sor', 'sort', 'sort'] },
    dormir:     { presStems: ['dor', 'dorm', 'dorm'] },
    rendre:     { model: true },
    attendre:   {},
    parler:     { model: true },
    finir:      { model: true, group: 2 },
    manger:     {},
    commencer:  {},
    acheter:    { mute: 'è' },
    appeler:    { mute: 'll' },
    'préférer': { mute: 'é' },
    payer:      { yAlt: true },
    envoyer:    { futStem: 'enverr' },
    'se lever': { conj: 'lever', reflexive: true, aux: 'etre', mute: 'è' }
  };

  /* Resolve a verb entry into what the conjugator reads. */
  function spec(inf) {
    const v = VERBS[inf];
    if (!v) throw new Error('unknown verb: ' + inf);
    const s = Object.assign({}, v, { inf: v.conj || inf, display: inf });
    s.cls = classOf(s);
    if (s.cls === 'er') {
      s.spell = /ger$/.test(s.inf) ? 'ger' : /cer$/.test(s.inf) ? 'cer' : null;
      s.ySpell = /yer$/.test(s.inf);
    }
    return s;
  }

  /* ---------- participle ---------- */

  function participleOf(v) {
    if (v.part) return v.part;
    const st = stemOf(v.inf);
    if (v.cls === 'er') return st + 'é';
    if (v.cls === 'ir2' || /[^o]ir$/.test(v.inf)) return st + 'i';
    return st + 'u';
  }

  function agree(part, fem, plural) {
    let p = part + (fem ? 'e' : '');
    if (plural && !/[sx]$/.test(p)) p += 's';
    return p;
  }

  /* ---------- simple tenses ---------- */

  function present(v, i, alt) {
    if (v.pres) return v.pres[i];
    if (v.cls === 'er' || v.presEr) {
      const ending = END.pres.er[i];
      let st = stemOf(v.inf);
      st = MUTE[i] ? muteStem(v, st, alt) : soften(v, st, ending);
      return st + ending;
    }
    if (v.cls === 'ir2') return stemOf(v.inf) + END.pres.ir2[i];
    const stems = v.presStems || [stemOf(v.inf), stemOf(v.inf), stemOf(v.inf)];
    const st = stems[i < 3 ? 0 : i < 5 ? 1 : 2];
    let ending = (v.presX && i < 2) ? 'x' : END.pres.re[i];
    if (i === 2 && /[dt]$/.test(st)) ending = '';       // il rend, il met
    let form = st + ending;
    if (v.circ && i === 2) form = form.replace(/ait$/, 'aît');
    return form;
  }

  /* The nous stem carries the imparfait and the nous/vous subjonctif. */
  function nousStem(v) {
    if (v.imparfStem) return v.imparfStem;
    if (v.pres) return v.pres[3].replace(/ons$/, '');
    if (v.presStems) return v.presStems[1];
    if (v.cls === 'ir2') return stemOf(v.inf) + 'iss';
    return stemOf(v.inf);
  }

  function imparfait(v, i) {
    const ending = END.imparf[i];
    return soften(v, nousStem(v), ending) + ending;
  }

  function passeSimple(v, i) {
    const type = v.psType || (v.cls === 'er' ? 'a' : 'i');
    const st = v.psStem != null ? v.psStem : stemOf(v.inf);
    const ending = END.ps[type][i];
    return soften(v, st, ending) + ending;
  }

  function futureStem(v, alt) {
    if (v.futStem) return v.futStem;
    if (v.cls === 'er') {
      let st = stemOf(v.inf);
      // préférer keeps é in the traditional spelling; 1990 allows è
      if (v.mute === 'é') { if (alt) st = replaceLast(st, 'é', 'è'); }
      else st = muteStem(v, st, alt);
      return st + 'er';
    }
    if (/re$/.test(v.inf)) return v.inf.slice(0, -1);
    if (/oir$/.test(v.inf)) return stemOf(v.inf) + 'r';
    return v.inf;
  }

  function subjonctif(v, i, alt) {
    if (v.subj) return v.subj[i];
    let st;
    if (v.subjStems) st = (i === 3 || i === 4) ? v.subjStems[1] : v.subjStems[0];
    else if (i === 3 || i === 4) st = nousStem(v);
    else st = present(v, 5, alt).replace(/ent$/, '');   // ils viennent -> vienne
    return st + END.subjPres[i];
  }

  /* Always built on the passé simple: tu fus -> fusse, il fût. */
  function subjImparfait(v, i) {
    const st = passeSimple(v, 1).replace(/s$/, '');
    return i === 2 ? circumflexLast(st) + 't' : st + END.subjImparf[i];
  }

  function imperatif(v, p, alt) {
    if (v.imperatif) return v.imperatif[IMP_IDX[p]];
    let form = present(v, IDX[p], alt);
    // -er verbs (and ouvrir-type -es forms) drop the s: parle, va, ouvre
    if (p === 'tu' && (v.cls === 'er' || /es$/.test(form))) form = form.replace(/s$/, '');
    return form;
  }

  function simple(v, tense, p, alt) {
    const i = IDX[p];
    switch (tense) {
      case 'pres':        return present(v, i, alt);
      case 'imparf':      return imparfait(v, i);
      case 'passeSimple': return passeSimple(v, i);
      case 'futur':       return futureStem(v, alt) + END.futur[i];
      case 'cond':        return futureStem(v, alt) + END.cond[i];
      case 'subjPres':    return subjonctif(v, i, alt);
      case 'subjImparf':  return subjImparfait(v, i);
      case 'imperatif':   return imperatif(v, p, alt);
    }
    throw new Error('unknown tense: ' + tense);
  }

  /* ---------- assembly ---------- */

  /* opts.alt: alternative spelling; opts.fem / opts.plural: être agreement. */
  function build(v, tense, p, opts) {
    opts = opts || {};
    const t = TENSES[tense];
    let form;
    if (t.compound) {
      const aux = spec(v.aux === 'etre' ? 'être' : 'avoir');
      let part = participleOf(v);
      if (v.aux === 'etre') {
        part = agree(part, !!opts.fem, opts.plural === undefined ? PLURAL[p] : opts.plural);
      }
      form = simple(aux, t.compound, p) + ' ' + part;
    } else {
      form = simple(v, tense, p, opts.alt);
    }
    if (!v.reflexive) return form;
    if (tense === 'imperatif') return form + '-' + REFL_IMP[p];
    return elide(REFL[p], form);
  }

  function absent(v, tense, p) {
    const t = TENSES[tense];
    if (!t) throw new Error('unknown tense: ' + tense);
    if (t.persons && t.persons.indexOf(p) < 0) return true;
    return !!(v.noImp && t.mood === 'imp');
  }

  function conjugate(inf, tense, person) {
    const v = spec(inf);
    if (absent(v, tense, person)) return null;
    return build(v, tense, person);
  }

  /* Every accepted answer, primary first:
       - être agreement: allé / allée (je, tu); allés / allées (nous); vous
         takes either number. il / ils stay masculine — the sentence says il.
       - payer: paie / paye;  préférer: préférerai / préfèrerai
       - connaître, naître: the 1990 spelling without î (connait) */
  function variants(inf, tense, person) {
    const v = spec(inf);
    if (absent(v, tense, person)) return [];
    const out = [build(v, tense, person)];
    function add(f) { if (out.indexOf(f) < 0) out.push(f); }

    if (TENSES[tense].compound && v.aux === 'etre') {
      // the sentence writes il / ils, which fixes the gender; je, tu, nous
      // and vous don't, and vous may also be one person (vous êtes allée)
      let combos;
      if (person === 'je' || person === 'tu') combos = [[false, false], [true, false]];
      else if (person === 'nous') combos = [[false, true], [true, true]];
      else if (person === 'vous') combos = [[false, true], [true, true], [false, false], [true, false]];
      else combos = [];
      combos.forEach(function (c) { add(build(v, tense, person, { fem: c[0], plural: c[1] })); });
    }
    if (v.yAlt || v.mute === 'é') add(build(v, tense, person, { alt: true }));
    if (v.circ) out.slice().forEach(function (f) { add(f.replace(/aît/g, 'ait')); });
    return out;
  }

  /* ---------- irregularity analysis ----------
   *
   * Conjugate the verb as if it were perfectly regular, then diff. What differs
   * IS the irregularity — nothing is hand-labelled, so this cannot drift out of
   * step with the engine.
   */

  /* The regular ending for a slot, where one is well defined. */
  function endingFor(tense, cls, i) {
    switch (tense) {
      case 'pres':        return END.pres[cls][i];
      case 'imparf':      return END.imparf[i];
      case 'passeSimple': return END.ps[cls === 'er' ? 'a' : 'i'][i];
      case 'futur':       return END.futur[i];
      case 'cond':        return END.cond[i];
      case 'subjPres':    return END.subjPres[i];
      case 'subjImparf':  return END.subjImparf[i];
    }
    return null;
  }

  /* The verb's regular twin: same infinitive, class, auxiliary and pronoun,
     none of its recorded deviations. keepSpelling applies the -ger/-cer/-yer
     spelling rules, which change letters but not sound. */
  function regularSpec(v, keepSpelling) {
    return {
      inf: v.inf, display: v.display, cls: v.cls, group: v.group,
      aux: v.aux, reflexive: v.reflexive,
      spell: keepSpelling ? v.spell : null,
      ySpell: keepSpelling ? v.ySpell : false
    };
  }

  function regularForm(inf, tense, person, keepSpelling) {
    const v = spec(inf);
    if (v.suppletive) return null;
    if (absent(v, tense, person)) return null;
    return build(regularSpec(v, keepSpelling), tense, person);
  }

  /* Longest shared prefix and suffix; whatever is left in the middle changed. */
  function diffParts(a, b) {
    let i = 0;
    const m = Math.min(a.length, b.length);
    while (i < m && a.charAt(i) === b.charAt(i)) i++;
    let j = 0;
    while (j < m - i && a.charAt(a.length - 1 - j) === b.charAt(b.length - 1 - j)) j++;
    // When the real form is SHORTER than the regular one (parts -> pars) the
    // prefix and suffix meet and nothing is left to mark. Give back one
    // character so the contraction is still visible.
    if (i + j >= a.length && a !== b) {
      if (j > 0) j--; else if (i > 0) i--;
    }
    return { pre: a.slice(0, i), mid: a.slice(i, a.length - j), post: a.slice(a.length - j) };
  }

  /* kind:
   *   regular    — identical to the regular pattern
   *   spelling   — only an orthographic change, which keeps the SOUND regular
   *                (mangeons, commençais, paie) — a spelling rule, not an exception
   *   stem       — the ending is intact, the root changed (viens, achète, viendrai)
   *   ending     — the ending itself deviates (peux, ouvre)
   *   participle — compound tense whose participle is irregular (ai ouvert)
   *   total      — suppletive; no meaningful regular twin exists (être, avoir)
   */
  function irregularity(inf, tense, person) {
    const actual = conjugate(inf, tense, person);
    if (actual === null) return null;

    // bare = no spelling rules applied; spelled = spelling rules only
    const bare = regularForm(inf, tense, person, false);
    if (bare === null) {
      return { form: actual, regular: null, kind: 'total', pre: '', mid: actual, post: '' };
    }
    if (actual === bare) {
      return { form: actual, regular: bare, kind: 'regular', pre: actual, mid: '', post: '' };
    }

    const d = diffParts(actual, bare);
    const spelled = regularForm(inf, tense, person, true);
    if (actual === spelled) {
      return { form: actual, regular: bare, kind: 'spelling',
               pre: d.pre, mid: d.mid, post: d.post };
    }

    let kind;
    if (TENSES[tense].compound) {
      kind = 'participle';
    } else {
      const v = spec(inf);
      const tn = tense === 'imperatif' ? 'pres' : tense;
      const ending = endingFor(tn, v.cls, IDX[person]);
      if (ending && tense !== 'imperatif') {
        kind = actual.slice(-ending.length) === ending ? 'stem' : 'ending';
      } else {
        kind = d.post.length ? 'stem' : 'ending';       // imperatif drops endings
      }
    }
    return { form: actual, regular: bare, kind: kind, pre: d.pre, mid: d.mid, post: d.post };
  }

  /* Overall shape of a verb's irregularity.
   *
   * Compound tenses are EXCLUDED from the proportion on purpose. All of them
   * are determined by the single past participle, so counting them per-slot
   * multiplies one fact by thirty and makes a verb like ouvrir look far more
   * irregular than it is. The participle is reported once, as its own fact.
   */
  function profile(inf) {
    let total = 0, irregular = 0, spelling = 0;
    TENSE_KEYS.forEach(function (t) {
      if (TENSES[t].compound) return;
      DRILL_PERSONS.forEach(function (p) {
        const a = irregularity(inf, t, p);
        if (!a) return;
        total++;
        if (a.kind === 'spelling') spelling++;
        else if (a.kind !== 'regular') irregular++;
      });
    });
    const v = spec(inf);
    const part = participleOf(v);
    return {
      total: total, irregular: irregular, spelling: spelling,
      regular: total - irregular - spelling,
      participle: part,
      participleIrregular: !v.suppletive && part !== participleOf(regularSpec(v, true))
    };
  }

  /* How many of the drilled forms deviate, for a verb or a single tense.
     Spelling-only changes are counted apart: they are a rule to apply, not an
     exception to memorise. */
  function irregularCount(inf, tense) {
    const tenses = tense ? [tense] : TENSE_KEYS;
    let total = 0, irregular = 0, spelling = 0;
    tenses.forEach(function (t) {
      DRILL_PERSONS.forEach(function (p) {
        const a = irregularity(inf, t, p);
        if (!a) return;
        total++;
        if (a.kind === 'spelling') spelling++;
        else if (a.kind !== 'regular') irregular++;
      });
    });
    return { total: total, irregular: irregular, spelling: spelling };
  }

  /* ---------- public ---------- */

  return {
    PERSONS: PERSONS,
    DRILL_PERSONS: DRILL_PERSONS,
    PERSON_LABEL: PERSON_LABEL,
    IMP_LABEL: IMP_LABEL,
    SUBJECT: SUBJECT,
    TENSES: TENSES,
    TENSE_KEYS: TENSE_KEYS,
    VERBS: VERBS,
    list: function () {
      return Object.keys(VERBS).sort(function (a, b) { return a.localeCompare(b, 'fr'); });
    },
    info: function (inf) { return VERBS[inf]; },
    isReflexive: function (inf) { return !!(VERBS[inf] && VERBS[inf].reflexive); },
    elide: elide,
    conjugate: conjugate,
    variants: variants,
    participle: function (inf) { return participleOf(spec(inf)); },
    regularForm: regularForm,
    irregularity: irregularity,
    irregularCount: irregularCount,
    profile: profile
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = CONJ;
