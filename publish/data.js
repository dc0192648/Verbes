/* data.js — content for Verbes.
 *
 * Sentence frames store NO French answer strings: the answer is computed by
 * engine.js at runtime.
 */
const VERB_DATA = (function () {
  'use strict';

  /* ---------- sentence frames ----------
     neutral works in ANY tense (no time marker), so one frame covers every
     tense without a dedicated frame below; it is also what the subjonctif
     and the impératif use, so its lead-in is always empty. pres/pc carry a
     time adverbial that pins the tense down. Frames avoid possessives and
     agreeing adjectives, since the person — and, with être, the gender —
     varies. The subject pronoun is NOT in the frame: frameFor() adds it,
     elided where the answer starts with a vowel. */
  const FRAMES = {
    'être':      { neutral: { b: '', a: " à l'heure." },
                   pres:    { b: 'En ce moment, ', a: ' à la maison.' },
                   pc:      { b: 'Hier, ', a: ' en retard.' } },
    avoir:       { neutral: { b: '', a: ' du courage.' },
                   pres:    { b: "Aujourd'hui, ", a: ' beaucoup de travail.' },
                   pc:      { b: 'Hier, ', a: ' de la chance.' } },
    aller:       { neutral: { b: '', a: ' au marché.' },
                   pres:    { b: 'Le samedi, ', a: ' au marché.' },
                   pc:      { b: 'Hier, ', a: ' au cinéma.' } },
    faire:       { neutral: { b: '', a: ' la cuisine.' },
                   pres:    { b: 'Le dimanche, ', a: ' la cuisine.' },
                   pc:      { b: 'Hier soir, ', a: ' la vaisselle.' } },
    dire:        { neutral: { b: '', a: ' la vérité.' },
                   pres:    { b: "D'habitude, ", a: ' bonjour aux voisins.' },
                   pc:      { b: 'Hier, ', a: ' au revoir à tout le monde.' } },
    pouvoir:     { neutral: { b: '', a: ' venir à la fête.' },
                   pres:    { b: 'Maintenant, ', a: ' sortir.' },
                   pc:      { b: 'Finalement, ', a: ' partir plus tôt.' } },
    vouloir:     { neutral: { b: '', a: ' entrer.' },
                   pres:    { b: 'Ce soir, ', a: ' rester à la maison.' },
                   pc:      { b: 'Hier, ', a: ' sortir.' } },
    savoir:      { neutral: { b: '', a: ' la réponse.' },
                   pres:    { b: 'Maintenant, ', a: ' nager.' },
                   pc:      { b: 'Tout à coup, ', a: ' la vérité.' } },
    voir:        { neutral: { b: '', a: ' la mer.' },
                   pres:    { b: 'Chaque matin, ', a: ' les voisins.' },
                   pc:      { b: 'Hier, ', a: ' un bon film.' } },
    venir:       { neutral: { b: '', a: ' à la fête.' },
                   pres:    { b: 'Chaque été, ', a: ' ici.' },
                   pc:      { b: 'Hier, ', a: ' en avance.' } },
    devoir:      { neutral: { b: '', a: ' travailler.' },
                   pres:    { b: 'Ce soir, ', a: ' étudier.' },
                   pc:      { b: 'Hier, ', a: ' attendre le bus.' } },
    prendre:     { neutral: { b: '', a: ' le train.' },
                   pres:    { b: 'Tous les jours, ', a: ' le métro.' },
                   pc:      { b: 'Ce matin, ', a: ' un taxi.' } },
    mettre:      { neutral: { b: '', a: ' la table.' },
                   pres:    { b: 'Chaque soir, ', a: ' la table.' },
                   pc:      { b: 'Hier, ', a: ' un manteau.' } },
    croire:      { neutral: { b: '', a: ' cette histoire.' },
                   pres:    { b: "Aujourd'hui encore, ", a: ' aux miracles.' },
                   pc:      { b: 'Au début, ', a: ' le vendeur.' } },
    tenir:       { neutral: { b: '', a: ' la porte.' },
                   pres:    { b: 'Par politesse, ', a: ' la porte.' },
                   pc:      { b: 'Hier, ', a: ' parole.' } },
    recevoir:    { neutral: { b: '', a: ' une lettre.' },
                   pres:    { b: 'Chaque semaine, ', a: ' des colis.' },
                   pc:      { b: 'Hier, ', a: ' un cadeau.' } },
    boire:       { neutral: { b: '', a: " de l'eau." },
                   pres:    { b: 'Le matin, ', a: ' du café.' },
                   pc:      { b: 'Hier soir, ', a: ' du vin.' } },
    lire:        { neutral: { b: '', a: ' le journal.' },
                   pres:    { b: 'Le soir, ', a: ' un roman.' },
                   pc:      { b: 'Pendant les vacances, ', a: ' trois livres.' } },
    'écrire':    { neutral: { b: '', a: ' une lettre.' },
                   pres:    { b: 'Chaque jour, ', a: ' dans un carnet.' },
                   pc:      { b: 'Hier, ', a: ' un courriel.' } },
    vivre:       { neutral: { b: '', a: ' à la campagne.' },
                   pres:    { b: "Aujourd'hui, ", a: ' à Paris.' },
                   pc:      { b: 'Pendant dix ans, ', a: ' à Lyon.' } },
    'connaître': { neutral: { b: '', a: ' la ville.' },
                   pres:    { b: 'Depuis longtemps, ', a: ' ce quartier.' },
                   pc:      { b: 'Autrefois, ', a: ' des temps difficiles.' } },
    conduire:    { neutral: { b: '', a: ' prudemment.' },
                   pres:    { b: 'Tous les jours, ', a: " jusqu'au bureau." },
                   pc:      { b: 'Hier, ', a: ' toute la nuit.' } },
    ouvrir:      { neutral: { b: '', a: ' la fenêtre.' },
                   pres:    { b: 'Chaque matin, ', a: ' les volets.' },
                   pc:      { b: "Tout à l'heure, ", a: ' la porte.' } },
    courir:      { neutral: { b: '', a: ' vite.' },
                   pres:    { b: 'Le dimanche, ', a: ' dans le parc.' },
                   pc:      { b: 'Ce matin, ', a: ' dix kilomètres.' } },
    mourir:      { neutral: { b: '', a: ' de rire.' },
                   pres:    { b: 'À chaque blague, ', a: ' de rire.' },
                   pc:      { b: 'Hier soir, ', a: ' de rire.' } },
    // no pres frame: "chaque printemps, je nais" is not a sentence anyone says
    'naître':    { neutral: { b: '', a: ' en hiver.' },
                   pc:      { b: 'En 1990, ', a: ' à Marseille.' } },
    partir:      { neutral: { b: '', a: ' en vacances.' },
                   pres:    { b: 'Chaque été, ', a: ' en vacances.' },
                   pc:      { b: 'Hier, ', a: ' très tôt.' } },
    sortir:      { neutral: { b: '', a: ' avec des amis.' },
                   pres:    { b: 'Le vendredi, ', a: ' avec des amis.' },
                   pc:      { b: 'Samedi dernier, ', a: ' danser.' } },
    dormir:      { neutral: { b: '', a: ' huit heures.' },
                   pres:    { b: "D'habitude, ", a: ' huit heures.' },
                   pc:      { b: 'Cette nuit, ', a: ' dix heures.' } },
    rendre:      { neutral: { b: '', a: ' les livres à la bibliothèque.' },
                   pres:    { b: 'Chaque mois, ', a: ' visite aux grands-parents.' },
                   pc:      { b: 'Hier, ', a: ' les clés.' } },
    attendre:    { neutral: { b: '', a: ' le bus.' },
                   pres:    { b: 'Chaque matin, ', a: ' le bus.' },
                   pc:      { b: 'Hier, ', a: ' une heure.' } },
    parler:      { neutral: { b: '', a: ' plus lentement.' },
                   pres:    { b: 'En classe, ', a: ' français.' },
                   pc:      { b: 'Hier, ', a: ' au directeur.' } },
    finir:       { neutral: { b: '', a: ' le travail.' },
                   pres:    { b: "D'habitude, ", a: ' à six heures.' },
                   pc:      { b: 'Hier soir, ', a: ' le livre.' } },
    manger:      { neutral: { b: '', a: ' des légumes.' },
                   pres:    { b: 'Le midi, ', a: ' à la cantine.' },
                   pc:      { b: 'Hier soir, ', a: ' au restaurant.' } },
    commencer:   { neutral: { b: '', a: ' le projet.' },
                   pres:    { b: 'Chaque matin, ', a: ' à huit heures.' },
                   pc:      { b: 'Hier, ', a: ' un nouveau livre.' } },
    acheter:     { neutral: { b: '', a: ' du pain.' },
                   pres:    { b: 'Le samedi, ', a: ' des fleurs.' },
                   pc:      { b: 'Hier, ', a: ' une voiture.' } },
    appeler:     { neutral: { b: '', a: ' le médecin.' },
                   pres:    { b: 'Le dimanche, ', a: ' la famille.' },
                   pc:      { b: 'Hier soir, ', a: ' un taxi.' } },
    'préférer':  { neutral: { b: '', a: ' le thé.' },
                   pres:    { b: 'Le matin, ', a: ' le café.' },
                   pc:      { b: 'Finalement, ', a: ' rester.' } },
    payer:       { neutral: { b: '', a: " l'addition." },
                   pres:    { b: 'Chaque mois, ', a: ' le loyer.' },
                   pc:      { b: 'Hier, ', a: ' en espèces.' } },
    envoyer:     { neutral: { b: '', a: ' un message.' },
                   pres:    { b: 'Chaque semaine, ', a: ' des cartes postales.' },
                   pc:      { b: 'Hier, ', a: ' le colis.' } },
    'se lever':  { neutral: { b: '', a: ' tôt.' },
                   pres:    { b: 'Chaque jour, ', a: ' à sept heures.' },
                   pc:      { b: 'Ce matin, ', a: " avant l'aube." } }
  };

  /* The subjonctif needs a trigger clause — a bare subjonctif is not a sentence. */
  const SUBJ_WRAP = {
    subjPres:   'Il faut que',
    subjPasse:  'Bien que',
    subjImparf: 'Il fallait que',
    subjPqp:    'Bien que'
  };

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* Build the displayed exercise for a (verb, tense, person) slot.
     French can't drop the subject, so the pronoun goes in front of the
     blank — and since je elides before a vowel (j'ai), the pronoun depends on
     the answer. That gives away whether the answer starts with a vowel,
     which is fine: the sentence would, too. */
  function frameFor(verb, tense, person) {
    const f = FRAMES[verb];
    if (!f) return null;
    const base = (tense === 'pres' && f.pres) ? f.pres
               : (tense === 'passeCompose' && f.pc) ? f.pc
               : f.neutral;

    if (tense === 'imperatif') {
      return { before: '', after: base.a, capitalize: true };
    }

    const answer = CONJ.conjugate(verb, tense, person) || '';
    const subj = CONJ.SUBJECT[person];
    // "je " or "j'" — the blank follows directly
    const s = CONJ.elide(subj, answer).slice(0, -answer.length || undefined);

    let before;
    const wrap = SUBJ_WRAP[tense];
    if (wrap) before = CONJ.elide(wrap, s);       // que il -> qu'il
    else if (base.b) before = base.b + s;
    else before = cap(s);

    return { before: before, after: base.a, capitalize: false };
  }

  /* ---------- grammar notes shown on a miss ---------- */
  const TENSE_NOTES = {
    pres:         'Présent : ce qui se passe maintenant ou habituellement.',
    imparf:       "Imparfait : radical du « nous » au présent + -ais, -ais, -ait, -ions, -iez, -aient (nous finissons → je finissais). Seule exception : être (j'étais).",
    passeSimple:  'Passé simple : le temps du récit écrit. -ai, -as, -a pour les verbes en -er ; -is, -us ou -ins pour les autres.',
    futur:        "Futur : -ai, -as, -a, -ons, -ez, -ont ajoutés à l'infinitif (sans le e final des verbes en -re).",
    cond:         "Conditionnel : radical du futur + terminaisons de l'imparfait.",
    passeCompose: "Passé composé : avoir ou être au présent + participe passé. Avec être, le participe s'accorde avec le sujet.",
    pqp:          "Plus-que-parfait : avoir ou être à l'imparfait + participe passé.",
    passeAnt:     'Passé antérieur : avoir ou être au passé simple + participe passé.',
    futAnt:       'Futur antérieur : avoir ou être au futur + participe passé.',
    condPasse:    'Conditionnel passé : avoir ou être au conditionnel + participe passé.',
    subjPres:     "Subjonctif présent : radical de « ils » au présent (ils prennent → que je prenne) ; nous et vous reprennent l'imparfait (que nous prenions).",
    subjPasse:    'Subjonctif passé : avoir ou être au subjonctif présent + participe passé.',
    subjImparf:   "Subjonctif imparfait : formé sur le passé simple (tu fus → que je fusse), avec un accent circonflexe à la 3e personne : qu'il fût.",
    subjPqp:      'Subjonctif plus-que-parfait : avoir ou être au subjonctif imparfait + participe passé.',
    imperatif:    'Impératif : les formes du présent, sans sujet. Les verbes en -er perdent le s à tu : parle, va.'
  };

  /* Verb-specific notes, shown on a miss and on the verb's page. The three
     model verbs (parler, finir, rendre) have none: they ARE the rule. */
  const VERB_NOTES = {
    'être':      "Totalement irrégulier : suis, étais, fus, serai, sois. Sert aussi d'auxiliaire.",
    avoir:       'Totalement irrégulier : ai, eus, aurai, aie. Auxiliaire de la plupart des temps composés.',
    aller:       'Présent irrégulier (vais, vas, va, vont), futur ir-, subjonctif aille. Se conjugue avec être.',
    faire:       'Vous faites, ils font ; futur fer-, subjonctif fasse, passé simple fis, participe fait.',
    dire:        'Vous dites, pas « disez ». Passé simple dis, participe dit.',
    pouvoir:     'Je peux, en -x ; ils peuvent. Futur pourr-, subjonctif puisse, participe pu.',
    vouloir:     'Je veux, en -x ; ils veulent. Futur voudr-, subjonctif veuille mais voulions, impératif veuillez.',
    savoir:      'Futur saur-, subjonctif et impératif sur sach- : sache, sachons. Participe su.',
    voir:        'y devant une voyelle prononcée : voyons, voyais. Futur verr-, passé simple vis, participe vu.',
    venir:       'vien- / ven- / vienn- au présent, futur viendr-, passé simple vins. Se conjugue avec être.',
    devoir:      'dois / devons / doivent. Participe dû, avec accent seulement au masculin singulier.',
    prendre:     'Perd le d au pluriel : prenons, et deux n à ils prennent. Participe pris.',
    mettre:      'Un seul t au singulier (mets, met), deux au pluriel. Passé simple et participe : mis.',
    croire:      'y devant une voyelle prononcée : croyons, croyais. Participe cru.',
    tenir:       'Comme venir : tiens, tenons, tiennent, futur tiendr-, passé simple tins. Mais avec avoir.',
    recevoir:    'ç devant o et u : reçois, reçu. Radical reçoiv- à ils reçoivent.',
    boire:       'Trois radicaux : bois, buvons, boivent. Participe bu.',
    lire:        'Radical lis- au pluriel : lisons, lisent. Participe lu.',
    'écrire':    'Radical écriv- au pluriel : écrivons, écrivent. Participe écrit.',
    vivre:       'Je vis, comme voir au passé simple. Passé simple vécus, participe vécu.',
    'connaître': 'î devant t : il connaît, je connaîtrai. Radical connaiss- au pluriel. Participe connu.',
    conduire:    'Radical conduis- au pluriel : conduisons. Participe conduit.',
    ouvrir:      "Se conjugue comme un verbe en -er au présent : j'ouvre, tu ouvres. Participe ouvert.",
    courir:      'Deux r au futur et au conditionnel : je courrai. Participe couru.',
    mourir:      'meur- / mour- au présent, futur mourr-, participe mort. Se conjugue avec être.',
    'naître':    'î devant t (il naît), passé simple naquis, participe né. Se conjugue avec être.',
    partir:      'Perd le t au singulier : je pars, il part. Se conjugue avec être.',
    sortir:      'Perd le t au singulier : je sors, il sort. Se conjugue avec être.',
    dormir:      'Perd le m au singulier : je dors, il dort.',
    attendre:    "Régulier en -re, comme rendre : j'attends, il attend.",
    manger:      'e devant a et o pour garder le son « j » : mangeons, mangeais.',
    commencer:   'ç devant a et o pour garder le son « s » : commençons, commençais.',
    acheter:     "e → è devant une syllabe muette : j'achète, j'achèterai, mais nous achetons.",
    appeler:     "l → ll devant une syllabe muette : j'appelle, j'appellerai, mais nous appelons.",
    'préférer':  'é → è devant une terminaison muette : je préfère, mais nous préférons. Futur préférerai (ou préfèrerai).',
    payer:       'Deux orthographes correctes : je paie ou je paye, je paierai ou je payerai.',
    envoyer:     "y → i devant un e muet (j'envoie) et futur irrégulier : j'enverrai.",
    'se lever':  "Pronominal : me, te, se… devant le verbe, être aux temps composés, lève-toi à l'impératif. Et e → è comme acheter."
  };

  /* ---------- answer checking ----------
     Returns 'correct', 'accent' (right form, wrong accents — shown and
     corrected but the box does not advance) or 'wrong'. */

  const ACC_MAP = {
    'à': 'a', 'â': 'a', 'ä': 'a', 'ç': 'c', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'î': 'i', 'ï': 'i', 'ô': 'o', 'ö': 'o', 'û': 'u', 'ù': 'u', 'ü': 'u', 'ÿ': 'y',
    'œ': 'oe', 'æ': 'ae'
  };

  /* The apostrophe and hyphen are part of the answer (m'étais, lève-toi), so
     they are kept — but the iPhone keyboard types ’, so that is mapped to '. */
  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[’‘ʼ`´]/g, '\'')
      .replace(/[.,!?;:"«»]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/'\s+/g, '\'')
      .replace(/\s*-\s*/g, '-')
      .trim();
  }

  function stripAccents(s) {
    return normalize(s).replace(/[àâäçéèêëîïôöûùüÿœæ]/g, function (c) { return ACC_MAP[c]; });
  }

  function check(input, accepted) {
    const list = Array.isArray(accepted) ? accepted : [accepted];
    const norm = normalize(input);
    if (list.some(function (a) { return normalize(a) === norm; })) return 'correct';
    const bare = stripAccents(input);
    if (list.some(function (a) { return stripAccents(a) === bare; })) return 'accent';
    return 'wrong';
  }

  return {
    FRAMES: FRAMES,
    normalize: normalize,
    stripAccents: stripAccents,
    check: check,
    TENSE_NOTES: TENSE_NOTES,
    VERB_NOTES: VERB_NOTES,
    frameFor: frameFor
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = VERB_DATA;
