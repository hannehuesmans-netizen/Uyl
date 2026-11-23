/* Leeslingo — Spaans → Nederlands opzoeken met het WikDict-woordenboek (CC BY-SA).
   lookup(word) → {t:[...vertalingen], lemma} of null.
   Het woordenboek bevat grondvormen; dit bestand zoekt bij een vervoegde vorm de grondvorm. */
(function (G) {
  let DICT = null;

  /* Veelvoorkomende woorden: WikDict geeft hier vaak een te smalle vertaling */
  const CORE = {
    el:["de","het"],la:["de","het","haar"],los:["de","ze"],las:["de","ze"],lo:["het","hem"],le:["hem","haar"],les:["hun","hen"],
    un:["een"],una:["een"],unos:["enkele","een paar"],unas:["enkele","een paar"],
    de:["van","uit"],del:["van de"],a:["naar","aan","om"],al:["naar de","aan de","bij het"],en:["in","op"],con:["met"],sin:["zonder"],
    por:["door","voor","via"],para:["voor","om te"],sobre:["over","op"],entre:["tussen"],hasta:["tot","zelfs"],desde:["sinds","vanaf"],
    hacia:["naar","richting"],contra:["tegen"],según:["volgens"],tras:["na","achter"],ante:["voor","tegenover"],bajo:["onder","laag"],
    y:["en"],e:["en"],o:["of"],u:["of"],pero:["maar"],sino:["maar","behalve"],ni:["noch","zelfs niet"],
    que:["dat","die","wat"],qué:["wat","welk"],quien:["wie","die"],quién:["wie"],quienes:["wie","die"],cual:["welke","die"],cuál:["welke"],
    cuando:["wanneer","als","toen"],cuándo:["wanneer"],donde:["waar"],dónde:["waar"],como:["zoals","als","hoe"],cómo:["hoe"],
    porque:["omdat"],"porqué":["waarom","reden"],cuanto:["hoeveel","hoe meer"],cuánto:["hoeveel"],si:["als","of"],sí:["ja","zich"],
    no:["niet","nee"],ya:["al","nu"],muy:["heel","erg","zeer"],más:["meer","nog"],menos:["minder"],tan:["zo"],tanto:["zoveel","zo"],
    también:["ook"],tampoco:["ook niet"],aún:["nog"],aun:["zelfs"],todavía:["nog","nog steeds"],siempre:["altijd"],nunca:["nooit"],
    entonces:["dan","toen"],luego:["daarna","dan"],después:["daarna","na"],antes:["eerder","voor"],ahora:["nu"],aquí:["hier"],allí:["daar"],
    ahí:["daar"],allá:["daarginds"],así:["zo","op die manier"],bien:["goed"],mal:["slecht"],casi:["bijna"],sólo:["alleen","slechts"],solo:["alleen"],
    mientras:["terwijl"],aunque:["hoewel","ook al"],pues:["want","dus"],incluso:["zelfs"],además:["bovendien"],quizá:["misschien"],quizás:["misschien"],
    yo:["ik"],tú:["jij"],él:["hij"],ella:["zij"],usted:["u"],nosotros:["wij"],vosotros:["jullie"],ellos:["zij"],ellas:["zij"],ustedes:["u","jullie"],
    me:["mij","me"],te:["jou","je"],se:["zich","zichzelf"],nos:["ons"],os:["jullie"],mí:["mij"],ti:["jou"],conmigo:["met mij"],contigo:["met jou"],
    mi:["mijn"],mis:["mijn"],tu:["jouw","je"],tus:["jouw","je"],su:["zijn","haar","hun"],sus:["zijn","haar","hun"],
    nuestro:["ons","onze"],nuestra:["onze"],vuestro:["jullie"],este:["deze","dit"],esta:["deze","dit"],esto:["dit"],estos:["deze"],estas:["deze"],
    ese:["die","dat"],esa:["die","dat"],eso:["dat"],esos:["die"],esas:["die"],aquel:["die","dat (daar)"],aquella:["die (daar)"],aquello:["dat"],
    aquellos:["die (daar)"],aquellas:["die (daar)"],todo:["alles","heel"],toda:["heel","hele"],todos:["allemaal","alle"],todas:["alle"],
    algo:["iets"],nada:["niets"],alguien:["iemand"],nadie:["niemand"],alguno:["een of andere","sommige"],algún:["een of andere"],
    ninguno:["geen enkele"],ningún:["geen enkele"],otro:["ander","nog een"],otra:["andere","nog een"],otros:["andere"],otras:["andere"],
    mismo:["zelf","dezelfde"],misma:["zelf","dezelfde"],cada:["elk","ieder"],mucho:["veel"],mucha:["veel"],muchos:["veel"],muchas:["veel"],
    poco:["weinig"],poca:["weinig"],pocos:["weinig","enkele"],varios:["verschillende"],
    ser:["zijn"],estar:["zijn"],haber:["hebben","zijn"],hay:["er is","er zijn"],tener:["hebben"],hacer:["doen","maken"],ir:["gaan"],
    poder:["kunnen"],decir:["zeggen"],dar:["geven"],ver:["zien"],saber:["weten"],querer:["willen","houden van"],llegar:["aankomen"],
    pasar:["gebeuren","voorbijgaan"],deber:["moeten"],poner:["zetten","leggen"],parecer:["lijken"],quedar:["blijven"],creer:["geloven","denken"],
    llevar:["dragen","brengen"],dejar:["laten","verlaten"],seguir:["volgen","doorgaan"],encontrar:["vinden"],llamar:["roepen","noemen","bellen"],
    venir:["komen"],pensar:["denken"],salir:["weggaan","naar buiten gaan"],volver:["terugkomen","opnieuw doen"],tomar:["nemen"],conocer:["kennen"],
    vivir:["leven","wonen"],sentir:["voelen"],mirar:["kijken"],contar:["vertellen","tellen"],empezar:["beginnen"],esperar:["wachten","hopen"],
    buscar:["zoeken"],entrar:["binnenkomen"],trabajar:["werken"],escribir:["schrijven"],perder:["verliezen"],oír:["horen"],
    detener:["stoppen","tegenhouden","arresteren"],señor:["meneer","heer"],señora:["mevrouw"],
    mío:["mijn","van mij"],mía:["mijn","van mij"],míos:["mijn"],mías:["mijn"],tuyo:["jouw","van jou"],tuya:["jouw","van jou"],
    suyo:["zijn","haar","van hem/haar"],suya:["zijn","haar","van hem/haar"],suyos:["zijn","haar","hun"],suyas:["zijn","haar","hun"],
    buen:["goed"],gran:["groot"],primer:["eerste"],tercer:["derde"],cualquier:["elk","welk ook"],cualquiera:["iedereen","welk ook"],
    siquiera:["zelfs","ten minste"],repente:["plotseling"],supuesto:["natuurlijk","verondersteld"],entrecejo:["frons","tussen de wenkbrauwen"],
    consigo:["met zich","bij zich"],ja:["ha"],je:["he"],ende:["daarom"],antemano:["vooraf"],sir:["sir"]
  };

  const IRREG = {
    soy:"ser",eres:"ser",es:"ser",somos:"ser",sois:"ser",son:"ser",era:"ser",eras:"ser",éramos:"ser",erais:"ser",eran:"ser",sido:"ser",siendo:"ser",
    sea:"ser",seas:"ser",seamos:"ser",sean:"ser",sé:"saber",fue:"ser",fui:"ser",fuiste:"ser",fuimos:"ser",fueron:"ser",fuera:"ser",fueras:"ser",fuéramos:"ser",fueran:"ser",fuese:"ser",fuesen:"ser",
    voy:"ir",vas:"ir",va:"ir",vamos:"ir",vais:"ir",van:"ir",iba:"ir",ibas:"ir",íbamos:"ir",iban:"ir",ido:"ir",yendo:"ir",vaya:"ir",vayas:"ir",vayamos:"ir",vayan:"ir",ve:"ir",id:"ir",
    estoy:"estar",estás:"estar",está:"estar",estamos:"estar",están:"estar",esté:"estar",estés:"estar",estén:"estar",
    he:"haber",has:"haber",ha:"haber",hemos:"haber",han:"haber",hay:"haber",haya:"haber",hayas:"haber",hayan:"haber",había:"haber",habían:"haber",
    doy:"dar",das:"dar",da:"dar",dan:"dar",dio:"dar",di:"dar",diste:"dar",dimos:"dar",dieron:"dar",dé:"dar",den:"dar",diera:"dar",dieran:"dar",
    veo:"ver",ves:"ver",vemos:"ver",ven:"ver",vi:"ver",viste:"ver",vio:"ver",vimos:"ver",vieron:"ver",visto:"ver",vea:"ver",veas:"ver",vean:"ver",veía:"ver",veían:"ver",
    sabes:"saber",sabe:"saber",sepa:"saber",sepan:"saber",
    hecho:"hacer",dicho:"decir",puesto:"poner",vuelto:"volver",escrito:"escribir",abierto:"abrir",muerto:"morir",roto:"romper",cubierto:"cubrir",
    oigo:"oír",oye:"oír",oyes:"oír",oyen:"oír",oyó:"oír",oyeron:"oír",oído:"oír",
    haz:"hacer",pon:"poner",sal:"salir",ten:"tener",
    murió:"morir",murieron:"morir",durmió:"dormir",durmieron:"dormir",pidió:"pedir",sintió:"sentir",siguió:"seguir",
    rio:"reír",rió:"reír",rieron:"reír",reía:"reír",reían:"reír",ríe:"reír",ríen:"reír",riendo:"reír",reírse:"reír",
    sonrió:"sonreír",sonrieron:"sonreír",sonreía:"sonreír",sonriendo:"sonreír",sonríe:"sonreír",vete:"ir",
  };
  const PRET = {tuv:"tener",estuv:"estar",anduv:"andar",hub:"haber",pud:"poder",pus:"poner",sup:"saber",quis:"querer",hic:"hacer",hiz:"hacer",
    vin:"venir",dij:"decir",traj:"traer",conduj:"conducir",produj:"producir",tradujo:"traducir",cup:"caber"};
  const PRET_END = ["e","iste","o","imos","isteis","ieron","eron","iera","ieras","iéramos","ieran","iese","iesen","era","eran"];
  const FUT = {tendr:"tener",pondr:"poner",saldr:"salir",vendr:"venir",podr:"poder",sabr:"saber",habr:"haber",querr:"querer",har:"hacer",dir:"decir",cabr:"caber",valdr:"valer"};
  const FUT_END = ["é","ás","á","emos","éis","án","ía","ías","íamos","íais","ían"];

  /* vorm-uitgang → mogelijke infinitief-uitgangen, langste eerst */
  const VERB = [
    ["iéramos",["er","ir"]],["iésemos",["er","ir"]],["áramos",["ar"]],["ásemos",["ar"]],
    ["ábamos",["ar"]],["aríamos",["ar"]],["eríamos",["er"]],["iríamos",["ir"]],
    ["ierais",["er","ir"]],["ieseis",["er","ir"]],["asteis",["ar"]],["isteis",["er","ir"]],["arais",["ar"]],["aseis",["ar"]],["abais",["ar"]],
    ["ieron",["er","ir"]],["yeron",["er","ir"]],["ieran",["er","ir"]],["iesen",["er","ir"]],["yeran",["er","ir"]],["ieras",["er","ir"]],["ieses",["er","ir"]],
    ["iendo",["er","ir"]],["yendo",["er","ir"]],["aron",["ar"]],["aran",["ar"]],["asen",["ar"]],["aban",["ar"]],["abas",["ar"]],["aras",["ar"]],["ases",["ar"]],
    ["iera",["er","ir"]],["iese",["er","ir"]],["yera",["er","ir"]],["ando",["ar"]],["aste",["ar"]],["iste",["er","ir"]],["íamos",["er","ir"]],["íais",["er","ir"]],
    ["amos",["ar"]],["emos",["er"]],["imos",["ir","er"]],["áis",["ar"]],["éis",["er"]],["ís",["ir"]],
    ["ara",["ar"]],["ase",["ar"]],["aba",["ar"]],["ían",["er","ir"]],["ías",["er","ir"]],["ía",["er","ir"]],
    ["ado",["ar"]],["ada",["ar"]],["ados",["ar"]],["adas",["ar"]],["ído",["er","ir"]],["ido",["er","ir"]],["ida",["er","ir"]],["idos",["er","ir"]],["idas",["er","ir"]],
    ["ió",["er","ir"]],["yó",["er","ir"]],["ó",["ar"]],["é",["ar"]],["í",["er","ir"]],
    ["an",["ar","er","ir"]],["en",["er","ir","ar"]],["as",["ar","er","ir"]],["es",["er","ir","ar"]],
    ["a",["ar","er","ir"]],["e",["er","ir","ar"]],["o",["ar","er","ir"]],["ad",["ar"]],["ed",["er"]],["id",["ir"]],
    ["ar",["ar"]],["er",["er"]],["ir",["ir"]]
  ];
  const FUTCOND = ["é","ás","á","emos","éis","án","ía","ías","íamos","íais","ían"];
  const CLITIC = /(me|te|se|nos|os|lo|la|le|los|las|les)$/;
  const deacc = s => s.replace(/á/g,"a").replace(/é/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u");

  /* stam-varianten: klinkerwissel en spelling terugdraaien */
  function stems(s) {
    const out = new Set([s]);
    const swaps = [["ie","e"],["ue","o"],["i","e"],["u","o"],["üe","o"],["qu","c"],["gu","g"],["c","z"],["j","g"],["zc","c"],["y","i"],["y",""],["g",""],["ig",""],["g","c"],["uy","u"]];
    for (const [a, b] of swaps) {
      const i = s.lastIndexOf(a);
      if (i >= 0 && i >= s.length - 4) out.add(s.slice(0, i) + b + s.slice(i + a.length));
    }
    return [...out];
  }
  const has = k => DICT && Object.prototype.hasOwnProperty.call(DICT, k) && DICT[k].length;
  const hit = k => CORE[k] ? CORE[k] : has(k) ? DICT[k] : null;

  function verbLemma(w) {
    if (IRREG[w]) return IRREG[w];
    for (const [tab, ends] of [[PRET, PRET_END], [FUT, FUT_END]])
      for (const [st, inf] of Object.entries(tab)) {
        const i = w.indexOf(st); if (i < 0 || i > 4 || !ends.includes(w.slice(i + st.length))) continue;
        const c = w.slice(0, i) + inf; if (i === 0 || hit(c)) return c;
      }
    for (const end of FUTCOND) if (w.endsWith(end)) { const inf = w.slice(0, -end.length); if (/(ar|er|ir)$/.test(inf) && hit(inf)) return inf; }
    for (const [suf, infs] of VERB) {
      if (!w.endsWith(suf) || w.length - suf.length < 1) continue;
      const stem = w.slice(0, -suf.length);
      for (const s of stems(stem)) for (const e of infs) { const c = s + e; if (c.length > 2 && hit(c)) return c; }
    }
    return null;
  }

  function lemmas(raw) {
    const w = raw.toLowerCase(), out = [w];
    const push = c => { if (c && !out.includes(c)) out.push(c); };
    // meervoud
    if (w.endsWith("ces")) push(w.slice(0, -3) + "z");
    if (w.endsWith("es")) push(w.slice(0, -2));
    if (w.endsWith("s")) push(w.slice(0, -1));
    // werkwoord
    push(verbLemma(w));
    // geslacht, verkleinwoord, overtreffende trap, bijwoord op -mente
    if (w.endsWith("a")) push(w.slice(0, -1) + "o");
    if (w.endsWith("as")) push(w.slice(0, -2) + "o");
    if (w.endsWith("ísimo") || w.endsWith("ísima")) push(w.slice(0, -5) + "o");
    if (/(ito|ita|itos|itas)$/.test(w)) push(w.replace(/(it)(o|a)s?$/, "$2"));
    if (w.endsWith("mente") && w.length > 7) { const a = deacc(w.slice(0, -5)); push(a); if (a.endsWith("a")) push(a.slice(0, -1) + "o"); push(w.slice(0, -5)); }
    // zonder accent (éstos → estos)
    if (deacc(w) !== w) push(deacc(w));
    // aanhangende voornaamwoorden: mirándola, dáselo, decirle
    let base = w;
    for (let i = 0; i < 2; i++) {
      const m = base.match(CLITIC); if (!m || base.length - m[1].length < 3) break;
      base = base.slice(0, -m[1].length);
      const d = deacc(base);
      if (/(ar|er|ir|ír)$/.test(d)) push(d.replace(/ír$/, "ir"));
      push(verbLemma(d)); push(verbLemma(base));
    }
    return out;
  }

  G.LEXICON = {
    ready: false,
    async load(url) {
      const r = await fetch(url); DICT = await r.json(); this.ready = true; return Object.keys(DICT).length;
    },
    useData(d) { DICT = d; this.ready = true; },
    lookup(word) {
      if (!DICT) return null;
      for (const l of lemmas(word)) { const t = hit(l); if (t && t.length) return {t: t.slice(0, 3), lemma: l}; }
      return null;
    },
    lemmas
  };
})(typeof window !== "undefined" ? window : globalThis);
