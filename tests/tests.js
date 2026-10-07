/* tests.js — conjugation assertions.
 *
 * Expected forms are written from standard references (Bescherelle-style
 * tables), NOT copied from engine output. Every gap-fill answer in the app
 * derives from the engine, so this must be fully green before any sentence
 * content is authored.
 *
 * Runs under jsc (`jsc engine.js data.js tests.js`) and in tests.html.
 */
var TESTS = (function () {
  'use strict';

  var failures = [];
  var count = 0;

  function eq(actual, expected, label) {
    count++;
    if (actual !== expected) {
      failures.push(label + '\n      expected: ' + expected + '\n      got:      ' + actual);
    }
  }

  /* Full six-person row, in CONJ.PERSONS order. */
  function row(inf, tense, expected) {
    CONJ.PERSONS.forEach(function (p, i) {
      eq(CONJ.conjugate(inf, tense, p), expected[i], inf + ' · ' + tense + ' · ' + p);
    });
  }

  /* Imperative rows have only tu / nous / vous. */
  function imp(inf, forms) {
    ['tu', 'nous', 'vous'].forEach(function (p, i) {
      eq(CONJ.conjugate(inf, 'imperatif', p), forms[i], inf + ' · imperatif · ' + p);
    });
  }

  function one(inf, tense, person, expected) {
    eq(CONJ.conjugate(inf, tense, person), expected, inf + ' · ' + tense + ' · ' + person);
  }

  /* Every accepted answer for a slot, primary first. */
  function accepts(inf, tense, person, list) {
    eq(CONJ.variants(inf, tense, person).join(' | '), list.join(' | '),
       inf + ' · ' + tense + ' · ' + person + ' variants');
  }

  function run() {
    failures = [];
    count = 0;

    /* ===== model verbs, every tense ===== */

    // parler — 1st group
    row('parler', 'pres',         ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent']);
    row('parler', 'imparf',       ['parlais', 'parlais', 'parlait', 'parlions', 'parliez', 'parlaient']);
    row('parler', 'passeSimple',  ['parlai', 'parlas', 'parla', 'parlâmes', 'parlâtes', 'parlèrent']);
    row('parler', 'futur',        ['parlerai', 'parleras', 'parlera', 'parlerons', 'parlerez', 'parleront']);
    row('parler', 'cond',         ['parlerais', 'parlerais', 'parlerait', 'parlerions', 'parleriez', 'parleraient']);
    row('parler', 'passeCompose', ['ai parlé', 'as parlé', 'a parlé', 'avons parlé', 'avez parlé', 'ont parlé']);
    row('parler', 'pqp',          ['avais parlé', 'avais parlé', 'avait parlé', 'avions parlé', 'aviez parlé', 'avaient parlé']);
    row('parler', 'passeAnt',     ['eus parlé', 'eus parlé', 'eut parlé', 'eûmes parlé', 'eûtes parlé', 'eurent parlé']);
    row('parler', 'futAnt',       ['aurai parlé', 'auras parlé', 'aura parlé', 'aurons parlé', 'aurez parlé', 'auront parlé']);
    row('parler', 'condPasse',    ['aurais parlé', 'aurais parlé', 'aurait parlé', 'aurions parlé', 'auriez parlé', 'auraient parlé']);
    row('parler', 'subjPres',     ['parle', 'parles', 'parle', 'parlions', 'parliez', 'parlent']);
    row('parler', 'subjPasse',    ['aie parlé', 'aies parlé', 'ait parlé', 'ayons parlé', 'ayez parlé', 'aient parlé']);
    row('parler', 'subjImparf',   ['parlasse', 'parlasses', 'parlât', 'parlassions', 'parlassiez', 'parlassent']);
    row('parler', 'subjPqp',      ['eusse parlé', 'eusses parlé', 'eût parlé', 'eussions parlé', 'eussiez parlé', 'eussent parlé']);
    imp('parler', ['parle', 'parlons', 'parlez']);

    // finir — 2nd group (-iss-)
    row('finir', 'pres',         ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent']);
    row('finir', 'imparf',       ['finissais', 'finissais', 'finissait', 'finissions', 'finissiez', 'finissaient']);
    row('finir', 'passeSimple',  ['finis', 'finis', 'finit', 'finîmes', 'finîtes', 'finirent']);
    row('finir', 'futur',        ['finirai', 'finiras', 'finira', 'finirons', 'finirez', 'finiront']);
    row('finir', 'cond',         ['finirais', 'finirais', 'finirait', 'finirions', 'finiriez', 'finiraient']);
    row('finir', 'passeCompose', ['ai fini', 'as fini', 'a fini', 'avons fini', 'avez fini', 'ont fini']);
    row('finir', 'subjPres',     ['finisse', 'finisses', 'finisse', 'finissions', 'finissiez', 'finissent']);
    row('finir', 'subjImparf',   ['finisse', 'finisses', 'finît', 'finissions', 'finissiez', 'finissent']);
    row('finir', 'subjPqp',      ['eusse fini', 'eusses fini', 'eût fini', 'eussions fini', 'eussiez fini', 'eussent fini']);
    imp('finir', ['finis', 'finissons', 'finissez']);

    // rendre — regular -re
    row('rendre', 'pres',         ['rends', 'rends', 'rend', 'rendons', 'rendez', 'rendent']);
    row('rendre', 'imparf',       ['rendais', 'rendais', 'rendait', 'rendions', 'rendiez', 'rendaient']);
    row('rendre', 'passeSimple',  ['rendis', 'rendis', 'rendit', 'rendîmes', 'rendîtes', 'rendirent']);
    row('rendre', 'futur',        ['rendrai', 'rendras', 'rendra', 'rendrons', 'rendrez', 'rendront']);
    row('rendre', 'cond',         ['rendrais', 'rendrais', 'rendrait', 'rendrions', 'rendriez', 'rendraient']);
    row('rendre', 'passeCompose', ['ai rendu', 'as rendu', 'a rendu', 'avons rendu', 'avez rendu', 'ont rendu']);
    row('rendre', 'subjPres',     ['rende', 'rendes', 'rende', 'rendions', 'rendiez', 'rendent']);
    row('rendre', 'subjImparf',   ['rendisse', 'rendisses', 'rendît', 'rendissions', 'rendissiez', 'rendissent']);
    imp('rendre', ['rends', 'rendons', 'rendez']);

    row('attendre', 'pres',        ['attends', 'attends', 'attend', 'attendons', 'attendez', 'attendent']);
    row('attendre', 'passeSimple', ['attendis', 'attendis', 'attendit', 'attendîmes', 'attendîtes', 'attendirent']);
    one('attendre', 'passeCompose', 'il', 'a attendu');

    /* ===== the two auxiliaries ===== */

    row('être', 'pres',         ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']);
    row('être', 'imparf',       ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient']);
    row('être', 'passeSimple',  ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent']);
    row('être', 'futur',        ['serai', 'seras', 'sera', 'serons', 'serez', 'seront']);
    row('être', 'cond',         ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient']);
    row('être', 'passeCompose', ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été']);
    row('être', 'subjPres',     ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient']);
    row('être', 'subjImparf',   ['fusse', 'fusses', 'fût', 'fussions', 'fussiez', 'fussent']);
    row('être', 'passeAnt',     ['eus été', 'eus été', 'eut été', 'eûmes été', 'eûtes été', 'eurent été']);
    imp('être', ['sois', 'soyons', 'soyez']);

    row('avoir', 'pres',         ['ai', 'as', 'a', 'avons', 'avez', 'ont']);
    row('avoir', 'imparf',       ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient']);
    row('avoir', 'passeSimple',  ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent']);
    row('avoir', 'futur',        ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront']);
    row('avoir', 'passeCompose', ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu']);
    row('avoir', 'subjPres',     ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient']);
    row('avoir', 'subjImparf',   ['eusse', 'eusses', 'eût', 'eussions', 'eussiez', 'eussent']);
    imp('avoir', ['aie', 'ayons', 'ayez']);

    /* ===== être auxiliary: agreement ===== */

    row('aller', 'pres',         ['vais', 'vas', 'va', 'allons', 'allez', 'vont']);
    row('aller', 'imparf',       ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient']);
    row('aller', 'passeSimple',  ['allai', 'allas', 'alla', 'allâmes', 'allâtes', 'allèrent']);
    row('aller', 'futur',        ['irai', 'iras', 'ira', 'irons', 'irez', 'iront']);
    row('aller', 'cond',         ['irais', 'irais', 'irait', 'irions', 'iriez', 'iraient']);
    row('aller', 'passeCompose', ['suis allé', 'es allé', 'est allé', 'sommes allés', 'êtes allés', 'sont allés']);
    row('aller', 'pqp',          ['étais allé', 'étais allé', 'était allé', 'étions allés', 'étiez allés', 'étaient allés']);
    row('aller', 'passeAnt',     ['fus allé', 'fus allé', 'fut allé', 'fûmes allés', 'fûtes allés', 'furent allés']);
    row('aller', 'futAnt',       ['serai allé', 'seras allé', 'sera allé', 'serons allés', 'serez allés', 'seront allés']);
    row('aller', 'condPasse',    ['serais allé', 'serais allé', 'serait allé', 'serions allés', 'seriez allés', 'seraient allés']);
    row('aller', 'subjPres',     ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent']);
    row('aller', 'subjPasse',    ['sois allé', 'sois allé', 'soit allé', 'soyons allés', 'soyez allés', 'soient allés']);
    row('aller', 'subjImparf',   ['allasse', 'allasses', 'allât', 'allassions', 'allassiez', 'allassent']);
    row('aller', 'subjPqp',      ['fusse allé', 'fusses allé', 'fût allé', 'fussions allés', 'fussiez allés', 'fussent allés']);
    imp('aller', ['va', 'allons', 'allez']);

    accepts('aller', 'passeCompose', 'je',   ['suis allé', 'suis allée']);
    accepts('aller', 'passeCompose', 'tu',   ['es allé', 'es allée']);
    accepts('aller', 'passeCompose', 'il',   ['est allé']);          // the sentence says il
    accepts('aller', 'passeCompose', 'nous', ['sommes allés', 'sommes allées']);
    accepts('aller', 'passeCompose', 'vous', ['êtes allés', 'êtes allées', 'êtes allé', 'êtes allée']);
    accepts('aller', 'passeCompose', 'ils',  ['sont allés']);
    accepts('naître', 'passeCompose', 'je',  ['suis né', 'suis née']);
    accepts('mourir', 'pqp', 'nous',         ['étions morts', 'étions mortes']);
    accepts('parler', 'passeCompose', 'je',  ['ai parlé']);     // avoir: no agreement
    accepts('parler', 'pres', 'je',          ['parle']);

    row('venir', 'pres',         ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent']);
    row('venir', 'imparf',       ['venais', 'venais', 'venait', 'venions', 'veniez', 'venaient']);
    row('venir', 'passeSimple',  ['vins', 'vins', 'vint', 'vînmes', 'vîntes', 'vinrent']);
    row('venir', 'futur',        ['viendrai', 'viendras', 'viendra', 'viendrons', 'viendrez', 'viendront']);
    row('venir', 'passeCompose', ['suis venu', 'es venu', 'est venu', 'sommes venus', 'êtes venus', 'sont venus']);
    row('venir', 'subjPres',     ['vienne', 'viennes', 'vienne', 'venions', 'veniez', 'viennent']);
    row('venir', 'subjImparf',   ['vinsse', 'vinsses', 'vînt', 'vinssions', 'vinssiez', 'vinssent']);
    imp('venir', ['viens', 'venons', 'venez']);

    row('partir', 'pres',         ['pars', 'pars', 'part', 'partons', 'partez', 'partent']);
    row('partir', 'passeSimple',  ['partis', 'partis', 'partit', 'partîmes', 'partîtes', 'partirent']);
    row('partir', 'futur',        ['partirai', 'partiras', 'partira', 'partirons', 'partirez', 'partiront']);
    row('partir', 'passeCompose', ['suis parti', 'es parti', 'est parti', 'sommes partis', 'êtes partis', 'sont partis']);
    row('partir', 'subjPres',     ['parte', 'partes', 'parte', 'partions', 'partiez', 'partent']);
    imp('partir', ['pars', 'partons', 'partez']);

    row('sortir', 'pres',         ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent']);
    row('sortir', 'passeCompose', ['suis sorti', 'es sorti', 'est sorti', 'sommes sortis', 'êtes sortis', 'sont sortis']);

    row('mourir', 'pres',         ['meurs', 'meurs', 'meurt', 'mourons', 'mourez', 'meurent']);
    row('mourir', 'passeSimple',  ['mourus', 'mourus', 'mourut', 'mourûmes', 'mourûtes', 'moururent']);
    row('mourir', 'futur',        ['mourrai', 'mourras', 'mourra', 'mourrons', 'mourrez', 'mourront']);
    row('mourir', 'passeCompose', ['suis mort', 'es mort', 'est mort', 'sommes morts', 'êtes morts', 'sont morts']);
    row('mourir', 'subjPres',     ['meure', 'meures', 'meure', 'mourions', 'mouriez', 'meurent']);

    row('naître', 'pres',         ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent']);
    row('naître', 'imparf',       ['naissais', 'naissais', 'naissait', 'naissions', 'naissiez', 'naissaient']);
    row('naître', 'passeSimple',  ['naquis', 'naquis', 'naquit', 'naquîmes', 'naquîtes', 'naquirent']);
    row('naître', 'futur',        ['naîtrai', 'naîtras', 'naîtra', 'naîtrons', 'naîtrez', 'naîtront']);
    row('naître', 'passeCompose', ['suis né', 'es né', 'est né', 'sommes nés', 'êtes nés', 'sont nés']);
    row('naître', 'subjImparf',   ['naquisse', 'naquisses', 'naquît', 'naquissions', 'naquissiez', 'naquissent']);

    /* ===== pronominal: se lever ===== */

    row('se lever', 'pres',         ['me lève', 'te lèves', 'se lève', 'nous levons', 'vous levez', 'se lèvent']);
    row('se lever', 'imparf',       ['me levais', 'te levais', 'se levait', 'nous levions', 'vous leviez', 'se levaient']);
    row('se lever', 'passeSimple',  ['me levai', 'te levas', 'se leva', 'nous levâmes', 'vous levâtes', 'se levèrent']);
    row('se lever', 'futur',        ['me lèverai', 'te lèveras', 'se lèvera', 'nous lèverons', 'vous lèverez', 'se lèveront']);
    row('se lever', 'cond',         ['me lèverais', 'te lèverais', 'se lèverait', 'nous lèverions', 'vous lèveriez', 'se lèveraient']);
    row('se lever', 'passeCompose', ['me suis levé', 't\'es levé', 's\'est levé', 'nous sommes levés', 'vous êtes levés', 'se sont levés']);
    row('se lever', 'pqp',          ['m\'étais levé', 't\'étais levé', 's\'était levé', 'nous étions levés', 'vous étiez levés', 's\'étaient levés']);
    row('se lever', 'futAnt',       ['me serai levé', 'te seras levé', 'se sera levé', 'nous serons levés', 'vous serez levés', 'se seront levés']);
    row('se lever', 'subjPres',     ['me lève', 'te lèves', 'se lève', 'nous levions', 'vous leviez', 'se lèvent']);
    row('se lever', 'subjPasse',    ['me sois levé', 'te sois levé', 'se soit levé', 'nous soyons levés', 'vous soyez levés', 'se soient levés']);
    row('se lever', 'subjImparf',   ['me levasse', 'te levasses', 'se levât', 'nous levassions', 'vous levassiez', 'se levassent']);
    imp('se lever', ['lève-toi', 'levons-nous', 'levez-vous']);
    accepts('se lever', 'passeCompose', 'je', ['me suis levé', 'me suis levée']);
    accepts('se lever', 'pqp', 'il', ['s\'était levé']);

    /* ===== spelling changes (sound stays regular) ===== */

    row('manger', 'pres',        ['mange', 'manges', 'mange', 'mangeons', 'mangez', 'mangent']);
    row('manger', 'imparf',      ['mangeais', 'mangeais', 'mangeait', 'mangions', 'mangiez', 'mangeaient']);
    row('manger', 'passeSimple', ['mangeai', 'mangeas', 'mangea', 'mangeâmes', 'mangeâtes', 'mangèrent']);
    row('manger', 'futur',       ['mangerai', 'mangeras', 'mangera', 'mangerons', 'mangerez', 'mangeront']);
    row('manger', 'subjPres',    ['mange', 'manges', 'mange', 'mangions', 'mangiez', 'mangent']);
    row('manger', 'subjImparf',  ['mangeasse', 'mangeasses', 'mangeât', 'mangeassions', 'mangeassiez', 'mangeassent']);
    imp('manger', ['mange', 'mangeons', 'mangez']);

    row('commencer', 'pres',        ['commence', 'commences', 'commence', 'commençons', 'commencez', 'commencent']);
    row('commencer', 'imparf',      ['commençais', 'commençais', 'commençait', 'commencions', 'commenciez', 'commençaient']);
    row('commencer', 'passeSimple', ['commençai', 'commenças', 'commença', 'commençâmes', 'commençâtes', 'commencèrent']);
    row('commencer', 'subjImparf',  ['commençasse', 'commençasses', 'commençât', 'commençassions', 'commençassiez', 'commençassent']);
    one('commencer', 'passeCompose', 'je', 'ai commencé');
    imp('commencer', ['commence', 'commençons', 'commencez']);

    /* ===== stem changes before a mute e ===== */

    row('acheter', 'pres',     ['achète', 'achètes', 'achète', 'achetons', 'achetez', 'achètent']);
    row('acheter', 'imparf',   ['achetais', 'achetais', 'achetait', 'achetions', 'achetiez', 'achetaient']);
    row('acheter', 'futur',    ['achèterai', 'achèteras', 'achètera', 'achèterons', 'achèterez', 'achèteront']);
    row('acheter', 'cond',     ['achèterais', 'achèterais', 'achèterait', 'achèterions', 'achèteriez', 'achèteraient']);
    row('acheter', 'subjPres', ['achète', 'achètes', 'achète', 'achetions', 'achetiez', 'achètent']);
    row('acheter', 'passeSimple', ['achetai', 'achetas', 'acheta', 'achetâmes', 'achetâtes', 'achetèrent']);
    imp('acheter', ['achète', 'achetons', 'achetez']);

    row('appeler', 'pres',        ['appelle', 'appelles', 'appelle', 'appelons', 'appelez', 'appellent']);
    row('appeler', 'futur',       ['appellerai', 'appelleras', 'appellera', 'appellerons', 'appellerez', 'appelleront']);
    row('appeler', 'subjPres',    ['appelle', 'appelles', 'appelle', 'appelions', 'appeliez', 'appellent']);
    row('appeler', 'passeSimple', ['appelai', 'appelas', 'appela', 'appelâmes', 'appelâtes', 'appelèrent']);
    imp('appeler', ['appelle', 'appelons', 'appelez']);

    row('préférer', 'pres',     ['préfère', 'préfères', 'préfère', 'préférons', 'préférez', 'préfèrent']);
    row('préférer', 'imparf',   ['préférais', 'préférais', 'préférait', 'préférions', 'préfériez', 'préféraient']);
    row('préférer', 'futur',    ['préférerai', 'préféreras', 'préférera', 'préférerons', 'préférerez', 'préféreront']);
    row('préférer', 'subjPres', ['préfère', 'préfères', 'préfère', 'préférions', 'préfériez', 'préfèrent']);
    row('préférer', 'passeSimple', ['préférai', 'préféras', 'préféra', 'préférâmes', 'préférâtes', 'préférèrent']);
    imp('préférer', ['préfère', 'préférons', 'préférez']);
    // 1990 spelling reform: the future may also take è
    accepts('préférer', 'futur', 'je', ['préférerai', 'préfèrerai']);
    accepts('préférer', 'pres', 'je', ['préfère']);

    // payer: both spellings are standard
    row('payer', 'pres',     ['paie', 'paies', 'paie', 'payons', 'payez', 'paient']);
    row('payer', 'imparf',   ['payais', 'payais', 'payait', 'payions', 'payiez', 'payaient']);
    row('payer', 'futur',    ['paierai', 'paieras', 'paiera', 'paierons', 'paierez', 'paieront']);
    row('payer', 'subjPres', ['paie', 'paies', 'paie', 'payions', 'payiez', 'paient']);
    row('payer', 'passeSimple', ['payai', 'payas', 'paya', 'payâmes', 'payâtes', 'payèrent']);
    imp('payer', ['paie', 'payons', 'payez']);
    accepts('payer', 'pres', 'je', ['paie', 'paye']);
    accepts('payer', 'pres', 'ils', ['paient', 'payent']);
    accepts('payer', 'pres', 'nous', ['payons']);
    accepts('payer', 'cond', 'il', ['paierait', 'payerait']);
    accepts('payer', 'imperatif', 'tu', ['paie', 'paye']);

    row('envoyer', 'pres',        ['envoie', 'envoies', 'envoie', 'envoyons', 'envoyez', 'envoient']);
    row('envoyer', 'imparf',      ['envoyais', 'envoyais', 'envoyait', 'envoyions', 'envoyiez', 'envoyaient']);
    row('envoyer', 'futur',       ['enverrai', 'enverras', 'enverra', 'enverrons', 'enverrez', 'enverront']);
    row('envoyer', 'cond',        ['enverrais', 'enverrais', 'enverrait', 'enverrions', 'enverriez', 'enverraient']);
    row('envoyer', 'subjPres',    ['envoie', 'envoies', 'envoie', 'envoyions', 'envoyiez', 'envoient']);
    row('envoyer', 'passeSimple', ['envoyai', 'envoyas', 'envoya', 'envoyâmes', 'envoyâtes', 'envoyèrent']);
    accepts('envoyer', 'pres', 'je', ['envoie']);           // no -ye spelling here

    /* ===== 3rd group ===== */

    row('faire', 'pres',        ['fais', 'fais', 'fait', 'faisons', 'faites', 'font']);
    row('faire', 'imparf',      ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient']);
    row('faire', 'passeSimple', ['fis', 'fis', 'fit', 'fîmes', 'fîtes', 'firent']);
    row('faire', 'futur',       ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront']);
    row('faire', 'subjPres',    ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent']);
    row('faire', 'subjImparf',  ['fisse', 'fisses', 'fît', 'fissions', 'fissiez', 'fissent']);
    one('faire', 'passeCompose', 'nous', 'avons fait');
    imp('faire', ['fais', 'faisons', 'faites']);

    row('dire', 'pres',        ['dis', 'dis', 'dit', 'disons', 'dites', 'disent']);
    row('dire', 'imparf',      ['disais', 'disais', 'disait', 'disions', 'disiez', 'disaient']);
    row('dire', 'passeSimple', ['dis', 'dis', 'dit', 'dîmes', 'dîtes', 'dirent']);
    row('dire', 'futur',       ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront']);
    row('dire', 'subjPres',    ['dise', 'dises', 'dise', 'disions', 'disiez', 'disent']);
    one('dire', 'passeCompose', 'je', 'ai dit');
    imp('dire', ['dis', 'disons', 'dites']);

    row('pouvoir', 'pres',        ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent']);
    row('pouvoir', 'imparf',      ['pouvais', 'pouvais', 'pouvait', 'pouvions', 'pouviez', 'pouvaient']);
    row('pouvoir', 'passeSimple', ['pus', 'pus', 'put', 'pûmes', 'pûtes', 'purent']);
    row('pouvoir', 'futur',       ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront']);
    row('pouvoir', 'subjPres',    ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent']);
    row('pouvoir', 'subjImparf',  ['pusse', 'pusses', 'pût', 'pussions', 'pussiez', 'pussent']);
    one('pouvoir', 'passeCompose', 'il', 'a pu');

    row('vouloir', 'pres',        ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent']);
    row('vouloir', 'passeSimple', ['voulus', 'voulus', 'voulut', 'voulûmes', 'voulûtes', 'voulurent']);
    row('vouloir', 'futur',       ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront']);
    row('vouloir', 'subjPres',    ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent']);
    one('vouloir', 'passeCompose', 'je', 'ai voulu');
    imp('vouloir', ['veuille', 'veuillons', 'veuillez']);

    row('savoir', 'pres',        ['sais', 'sais', 'sait', 'savons', 'savez', 'savent']);
    row('savoir', 'imparf',      ['savais', 'savais', 'savait', 'savions', 'saviez', 'savaient']);
    row('savoir', 'passeSimple', ['sus', 'sus', 'sut', 'sûmes', 'sûtes', 'surent']);
    row('savoir', 'futur',       ['saurai', 'sauras', 'saura', 'saurons', 'saurez', 'sauront']);
    row('savoir', 'subjPres',    ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent']);
    one('savoir', 'passeCompose', 'tu', 'as su');
    imp('savoir', ['sache', 'sachons', 'sachez']);

    row('voir', 'pres',        ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient']);
    row('voir', 'imparf',      ['voyais', 'voyais', 'voyait', 'voyions', 'voyiez', 'voyaient']);
    row('voir', 'passeSimple', ['vis', 'vis', 'vit', 'vîmes', 'vîtes', 'virent']);
    row('voir', 'futur',       ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront']);
    row('voir', 'subjPres',    ['voie', 'voies', 'voie', 'voyions', 'voyiez', 'voient']);
    one('voir', 'passeCompose', 'ils', 'ont vu');
    imp('voir', ['vois', 'voyons', 'voyez']);

    row('devoir', 'pres',        ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent']);
    row('devoir', 'passeSimple', ['dus', 'dus', 'dut', 'dûmes', 'dûtes', 'durent']);
    row('devoir', 'futur',       ['devrai', 'devras', 'devra', 'devrons', 'devrez', 'devront']);
    row('devoir', 'subjPres',    ['doive', 'doives', 'doive', 'devions', 'deviez', 'doivent']);
    one('devoir', 'passeCompose', 'je', 'ai dû');

    row('prendre', 'pres',        ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent']);
    row('prendre', 'imparf',      ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient']);
    row('prendre', 'passeSimple', ['pris', 'pris', 'prit', 'prîmes', 'prîtes', 'prirent']);
    row('prendre', 'futur',       ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront']);
    row('prendre', 'subjPres',    ['prenne', 'prennes', 'prenne', 'prenions', 'preniez', 'prennent']);
    row('prendre', 'subjImparf',  ['prisse', 'prisses', 'prît', 'prissions', 'prissiez', 'prissent']);
    one('prendre', 'passeCompose', 'je', 'ai pris');
    imp('prendre', ['prends', 'prenons', 'prenez']);

    row('mettre', 'pres',        ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent']);
    row('mettre', 'passeSimple', ['mis', 'mis', 'mit', 'mîmes', 'mîtes', 'mirent']);
    row('mettre', 'futur',       ['mettrai', 'mettras', 'mettra', 'mettrons', 'mettrez', 'mettront']);
    row('mettre', 'subjPres',    ['mette', 'mettes', 'mette', 'mettions', 'mettiez', 'mettent']);
    one('mettre', 'passeCompose', 'il', 'a mis');
    imp('mettre', ['mets', 'mettons', 'mettez']);

    row('croire', 'pres',        ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient']);
    row('croire', 'imparf',      ['croyais', 'croyais', 'croyait', 'croyions', 'croyiez', 'croyaient']);
    row('croire', 'passeSimple', ['crus', 'crus', 'crut', 'crûmes', 'crûtes', 'crurent']);
    row('croire', 'futur',       ['croirai', 'croiras', 'croira', 'croirons', 'croirez', 'croiront']);
    row('croire', 'subjPres',    ['croie', 'croies', 'croie', 'croyions', 'croyiez', 'croient']);
    one('croire', 'passeCompose', 'je', 'ai cru');

    row('tenir', 'pres',        ['tiens', 'tiens', 'tient', 'tenons', 'tenez', 'tiennent']);
    row('tenir', 'passeSimple', ['tins', 'tins', 'tint', 'tînmes', 'tîntes', 'tinrent']);
    row('tenir', 'futur',       ['tiendrai', 'tiendras', 'tiendra', 'tiendrons', 'tiendrez', 'tiendront']);
    row('tenir', 'subjPres',    ['tienne', 'tiennes', 'tienne', 'tenions', 'teniez', 'tiennent']);
    row('tenir', 'passeCompose', ['ai tenu', 'as tenu', 'a tenu', 'avons tenu', 'avez tenu', 'ont tenu']);

    row('recevoir', 'pres',        ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent']);
    row('recevoir', 'imparf',      ['recevais', 'recevais', 'recevait', 'recevions', 'receviez', 'recevaient']);
    row('recevoir', 'passeSimple', ['reçus', 'reçus', 'reçut', 'reçûmes', 'reçûtes', 'reçurent']);
    row('recevoir', 'futur',       ['recevrai', 'recevras', 'recevra', 'recevrons', 'recevrez', 'recevront']);
    row('recevoir', 'subjPres',    ['reçoive', 'reçoives', 'reçoive', 'recevions', 'receviez', 'reçoivent']);
    one('recevoir', 'passeCompose', 'je', 'ai reçu');

    row('boire', 'pres',        ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent']);
    row('boire', 'imparf',      ['buvais', 'buvais', 'buvait', 'buvions', 'buviez', 'buvaient']);
    row('boire', 'passeSimple', ['bus', 'bus', 'but', 'bûmes', 'bûtes', 'burent']);
    row('boire', 'futur',       ['boirai', 'boiras', 'boira', 'boirons', 'boirez', 'boiront']);
    row('boire', 'subjPres',    ['boive', 'boives', 'boive', 'buvions', 'buviez', 'boivent']);
    one('boire', 'passeCompose', 'je', 'ai bu');
    imp('boire', ['bois', 'buvons', 'buvez']);

    row('lire', 'pres',        ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent']);
    row('lire', 'passeSimple', ['lus', 'lus', 'lut', 'lûmes', 'lûtes', 'lurent']);
    row('lire', 'futur',       ['lirai', 'liras', 'lira', 'lirons', 'lirez', 'liront']);
    row('lire', 'subjPres',    ['lise', 'lises', 'lise', 'lisions', 'lisiez', 'lisent']);
    one('lire', 'passeCompose', 'je', 'ai lu');

    row('écrire', 'pres',        ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent']);
    row('écrire', 'imparf',      ['écrivais', 'écrivais', 'écrivait', 'écrivions', 'écriviez', 'écrivaient']);
    row('écrire', 'passeSimple', ['écrivis', 'écrivis', 'écrivit', 'écrivîmes', 'écrivîtes', 'écrivirent']);
    row('écrire', 'futur',       ['écrirai', 'écriras', 'écrira', 'écrirons', 'écrirez', 'écriront']);
    row('écrire', 'subjPres',    ['écrive', 'écrives', 'écrive', 'écrivions', 'écriviez', 'écrivent']);
    one('écrire', 'passeCompose', 'je', 'ai écrit');

    row('vivre', 'pres',        ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent']);
    row('vivre', 'passeSimple', ['vécus', 'vécus', 'vécut', 'vécûmes', 'vécûtes', 'vécurent']);
    row('vivre', 'futur',       ['vivrai', 'vivras', 'vivra', 'vivrons', 'vivrez', 'vivront']);
    row('vivre', 'subjImparf',  ['vécusse', 'vécusses', 'vécût', 'vécussions', 'vécussiez', 'vécussent']);
    one('vivre', 'passeCompose', 'je', 'ai vécu');

    row('connaître', 'pres',        ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent']);
    row('connaître', 'imparf',      ['connaissais', 'connaissais', 'connaissait', 'connaissions', 'connaissiez', 'connaissaient']);
    row('connaître', 'passeSimple', ['connus', 'connus', 'connut', 'connûmes', 'connûtes', 'connurent']);
    row('connaître', 'futur',       ['connaîtrai', 'connaîtras', 'connaîtra', 'connaîtrons', 'connaîtrez', 'connaîtront']);
    row('connaître', 'subjPres',    ['connaisse', 'connaisses', 'connaisse', 'connaissions', 'connaissiez', 'connaissent']);
    one('connaître', 'passeCompose', 'je', 'ai connu');
    // 1990 spelling reform drops the circumflex on i
    accepts('connaître', 'pres', 'il', ['connaît', 'connait']);
    accepts('connaître', 'futur', 'je', ['connaîtrai', 'connaitrai']);
    accepts('connaître', 'pres', 'je', ['connais']);

    row('conduire', 'pres',        ['conduis', 'conduis', 'conduit', 'conduisons', 'conduisez', 'conduisent']);
    row('conduire', 'passeSimple', ['conduisis', 'conduisis', 'conduisit', 'conduisîmes', 'conduisîtes', 'conduisirent']);
    row('conduire', 'futur',       ['conduirai', 'conduiras', 'conduira', 'conduirons', 'conduirez', 'conduiront']);
    row('conduire', 'subjPres',    ['conduise', 'conduises', 'conduise', 'conduisions', 'conduisiez', 'conduisent']);
    one('conduire', 'passeCompose', 'je', 'ai conduit');

    row('ouvrir', 'pres',        ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent']);
    row('ouvrir', 'imparf',      ['ouvrais', 'ouvrais', 'ouvrait', 'ouvrions', 'ouvriez', 'ouvraient']);
    row('ouvrir', 'passeSimple', ['ouvris', 'ouvris', 'ouvrit', 'ouvrîmes', 'ouvrîtes', 'ouvrirent']);
    row('ouvrir', 'futur',       ['ouvrirai', 'ouvriras', 'ouvrira', 'ouvrirons', 'ouvrirez', 'ouvriront']);
    row('ouvrir', 'subjPres',    ['ouvre', 'ouvres', 'ouvre', 'ouvrions', 'ouvriez', 'ouvrent']);
    one('ouvrir', 'passeCompose', 'je', 'ai ouvert');
    imp('ouvrir', ['ouvre', 'ouvrons', 'ouvrez']);

    row('courir', 'pres',        ['cours', 'cours', 'court', 'courons', 'courez', 'courent']);
    row('courir', 'passeSimple', ['courus', 'courus', 'courut', 'courûmes', 'courûtes', 'coururent']);
    row('courir', 'futur',       ['courrai', 'courras', 'courra', 'courrons', 'courrez', 'courront']);
    row('courir', 'subjPres',    ['coure', 'coures', 'coure', 'courions', 'couriez', 'courent']);
    one('courir', 'passeCompose', 'je', 'ai couru');
    imp('courir', ['cours', 'courons', 'courez']);

    row('dormir', 'pres',        ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment']);
    row('dormir', 'passeSimple', ['dormis', 'dormis', 'dormit', 'dormîmes', 'dormîtes', 'dormirent']);
    row('dormir', 'futur',       ['dormirai', 'dormiras', 'dormira', 'dormirons', 'dormirez', 'dormiront']);
    row('dormir', 'subjPres',    ['dorme', 'dormes', 'dorme', 'dormions', 'dormiez', 'dorment']);
    one('dormir', 'passeCompose', 'je', 'ai dormi');

    /* ===== structural guarantees ===== */

    eq(CONJ.conjugate('parler', 'imperatif', 'je'), null, 'imperative has no je form');
    eq(CONJ.conjugate('parler', 'imperatif', 'il'), null, 'imperative has no il form');
    eq(CONJ.conjugate('parler', 'imperatif', 'ils'), null, 'imperative has no ils form');
    eq(CONJ.conjugate('pouvoir', 'imperatif', 'tu'), null, 'pouvoir has no imperative');
    eq(CONJ.DRILL_PERSONS.join(','), 'je,tu,il,nous,vous,ils', 'all six persons drilled');
    eq(CONJ.list().length, 41, 'verb count');
    eq(CONJ.TENSE_KEYS.length, 15, 'tense count');
    eq(CONJ.TENSE_KEYS.filter(function (t) { return CONJ.TENSES[t].literary; }).join(','),
       'passeSimple,passeAnt,subjImparf,subjPqp', 'literary tenses');

    // every verb produces a non-empty string for every drilled slot
    var holes = [];
    CONJ.list().forEach(function (inf) {
      CONJ.TENSE_KEYS.forEach(function (t) {
        CONJ.DRILL_PERSONS.forEach(function (p) {
          var f = CONJ.conjugate(inf, t, p);
          if (f === null) return;                       // legitimately absent
          if (typeof f !== 'string' || !f.length || /undefined|NaN|null/.test(f)) {
            holes.push(inf + '/' + t + '/' + p + ' = ' + f);
          }
          var vs = CONJ.variants(inf, t, p);
          if (vs[0] !== f) holes.push(inf + '/' + t + '/' + p + ' variants[0] = ' + vs[0]);
        });
      });
    });
    eq(holes.length, 0, 'no malformed forms anywhere' + (holes.length ? ': ' + holes.slice(0, 8).join(', ') : ''));

    /* ===== irregularity analysis =====
       The highlight in the verb tables is derived from these, so a wrong
       classification would visibly mislabel what is irregular about a form. */

    function irr(inf, t, p, kind, mid) {
      var a = CONJ.irregularity(inf, t, p);
      var label = inf + ' · ' + t + ' · ' + p;
      eq(a.kind, kind, label + ' kind');
      if (mid !== undefined) eq(a.mid, mid, label + ' highlighted span');
      // the three pieces must always reassemble into the real form
      eq(a.pre + a.mid + a.post, CONJ.conjugate(inf, t, p), label + ' parts reassemble');
    }

    // the models highlight nothing, in any tense
    irr('parler', 'pres', 'je', 'regular', '');
    irr('parler', 'subjImparf', 'il', 'regular', '');
    irr('finir', 'pres', 'nous', 'regular', '');
    irr('finir', 'passeSimple', 'ils', 'regular', '');
    irr('rendre', 'pres', 'il', 'regular', '');
    irr('rendre', 'passeCompose', 'je', 'regular', '');
    irr('attendre', 'futur', 'vous', 'regular', '');

    // spelling only: the sound stays regular
    irr('manger', 'pres', 'nous', 'spelling', 'e');           // mangons -> mangeons
    irr('commencer', 'imparf', 'je', 'spelling', 'ç');        // commencais -> commençais
    irr('payer', 'pres', 'je', 'spelling', 'i');              // paye -> paie
    irr('manger', 'pres', 'je', 'regular', '');

    // root changes, ending intact
    irr('acheter', 'pres', 'je', 'stem', 'è');                // achete -> achète
    irr('appeler', 'pres', 'ils', 'stem');                    // appelent -> appellent
    irr('préférer', 'pres', 'tu', 'stem', 'è');
    irr('venir', 'pres', 'je', 'stem');                       // venis -> viens
    irr('partir', 'pres', 'je', 'stem', 's');                 // parts -> pars: contraction
    irr('venir', 'futur', 'je', 'stem');                      // venirai -> viendrai
    irr('faire', 'subjPres', 'je', 'stem');                   // faie -> fasse

    // the ending itself deviates
    irr('pouvoir', 'pres', 'je', 'ending');                   // peux: -x, not -s
    irr('ouvrir', 'pres', 'je', 'ending');                    // ouvre: -er endings

    // compound tenses with an irregular participle
    irr('ouvrir', 'passeCompose', 'je', 'participle');        // ai ouvert
    irr('faire', 'pqp', 'il', 'participle');
    irr('aller', 'passeCompose', 'je', 'regular', '');        // suis allé — regular participle

    // suppletive
    irr('être', 'pres', 'je', 'total');
    irr('avoir', 'futur', 'nous', 'total');

    // the pieces reassemble for every slot of every verb
    var badAnalysis = [];
    CONJ.list().forEach(function (v) {
      CONJ.TENSE_KEYS.forEach(function (t) {
        CONJ.DRILL_PERSONS.forEach(function (p) {
          var a = CONJ.irregularity(v, t, p);
          if (a === null) return;
          if (a.pre + a.mid + a.post !== a.form) badAnalysis.push(v + '/' + t + '/' + p + ' reassembly');
          if (a.kind !== 'regular' && a.kind !== 'total' && !a.mid) badAnalysis.push(v + '/' + t + '/' + p + ' empty mark');
        });
      });
    });
    eq(badAnalysis.length, 0, 'irregularity analysis is well formed' +
      (badAnalysis.length ? ': ' + badAnalysis.slice(0, 6).join(', ') : ''));

    var pr = CONJ.profile('parler');
    eq(pr.irregular + pr.spelling, 0, 'parler profile is fully regular');
    eq(CONJ.profile('ouvrir').participleIrregular, true, 'ouvrir participle flagged');

    /* ===== content: every verb reachable, every slot renderable ===== */

    // data.js must be loaded — a silent skip here would hide content failures
    eq(typeof VERB_DATA !== 'undefined', true, 'VERB_DATA loaded (content assertions run)');

    if (typeof VERB_DATA !== 'undefined') {
      var missingFrame = CONJ.list().filter(function (v) { return !VERB_DATA.FRAMES[v]; });
      eq(missingFrame.join(',') || '(none)', '(none)', 'every verb has a sentence frame');

      var missingNote = CONJ.list().filter(function (v) {
        return !CONJ.info(v).model && !VERB_DATA.VERB_NOTES[v];
      });
      eq(missingNote.join(',') || '(none)', '(none)', 'every non-model verb has a note');

      var badFrame = [];
      CONJ.list().forEach(function (v) {
        CONJ.TENSE_KEYS.forEach(function (t) {
          CONJ.DRILL_PERSONS.forEach(function (p) {
            if (CONJ.conjugate(v, t, p) === null) return;
            var fr = VERB_DATA.frameFor(v, t, p);
            if (!fr || typeof fr.before !== 'string' || typeof fr.after !== 'string' ||
                /undefined|NaN|null/.test(fr.before + fr.after)) {
              badFrame.push(v + '/' + t + '/' + p);
            }
          });
        });
      });
      eq(badFrame.length, 0, 'every drilled slot renders a frame' +
        (badFrame.length ? ': ' + badFrame.slice(0, 6).join(', ') : ''));

      // the subject pronoun sits outside the blank and elides before a vowel
      function before(v, t, p) { return VERB_DATA.frameFor(v, t, p).before; }
      eq(/j'$/i.test(before('avoir', 'pres', 'je')), true, 'je elides before ai');
      eq(/Je $/.test(before('parler', 'pres', 'je')) || /je $/.test(before('parler', 'pres', 'je')), true, 'je before a consonant');
      eq(/qu'il $/.test(before('parler', 'subjPres', 'il')), true, 'que il -> qu\'il');
      eq(/que j'$/.test(before('aller', 'subjPres', 'je')), true, 'que je -> que j\' before aille');
      eq(/que je $/.test(before('faire', 'subjPres', 'je')), true, 'que je before fasse');
      eq(before('parler', 'imperatif', 'tu'), '', 'imperative has no subject');
      eq(/nous $/.test(before('se lever', 'pres', 'nous')), true, 'nous before nous levons');

      // accent tolerance is "almost", never silently correct
      eq(VERB_DATA.check('parlé', 'parlé'), 'correct', 'exact');
      eq(VERB_DATA.check('parle', 'parlé'), 'accent', 'missing accent');
      eq(VERB_DATA.check('parlons', 'parlé'), 'wrong', 'wrong form');
      eq(VERB_DATA.check('  Ai  Parlé ', 'ai parlé'), 'correct', 'case and spacing');
      eq(VERB_DATA.check('m’étais levé', 'm\'étais levé'), 'correct', 'smart apostrophe');
      eq(VERB_DATA.check('m\' étais levé', 'm\'étais levé'), 'correct', 'space after apostrophe');
      eq(VERB_DATA.check('metais leve', 'm\'étais levé'), 'wrong', 'apostrophe is not optional');
      eq(VERB_DATA.check('lève - toi', 'lève-toi'), 'correct', 'spaced hyphen');
      eq(VERB_DATA.check('leve-toi', 'lève-toi'), 'accent', 'imperative missing accent');
      eq(VERB_DATA.check('commencons', 'commençons'), 'accent', 'cedilla counts as an accent');
      eq(VERB_DATA.check('suis allée', ['suis allé', 'suis allée']), 'correct', 'feminine agreement');
      eq(VERB_DATA.check('paye', ['paie', 'paye']), 'correct', 'alternative spelling');
    }

    return { count: count, failures: failures };
  }

  return { run: run };
})();

/* jsc entry point */
if (typeof print === 'function' && typeof document === 'undefined') {
  var r = TESTS.run();
  if (r.failures.length) {
    print('\n  ' + r.failures.length + ' of ' + r.count + ' assertions FAILED\n');
    r.failures.forEach(function (f) { print('  ✗ ' + f); });
    print('');
  } else {
    print('\n  ✓ all ' + r.count + ' assertions passed\n');
  }
}
