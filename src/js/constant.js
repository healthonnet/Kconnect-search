app.constant('SELECT_SERVICE_URL', '/hon-search/select');
app.constant('TRUST_SERVICE_URL', '/hon-search/trustability');
app.constant('TRANSLATION_SERVICE_URL', '/hon-search/translation');
app.constant('DISAMBIGUATOR_SERVICE_URL', '/hon-search/khresmoiDisambiguator');
app.constant('NEWS_SERVICE_URL', '/feeds');
app.constant('SUGGEST_SERVICE_URL', '/hon-terms-dictionary/suggest');
app.constant('SPELLCHECK_SERVICE_URL', '/hon-search/suggest');
app.constant('TYPEAHEAD_SERVICE_URL', '/hon-search/typeahead');
app.constant('TYPEAHEADLABEL_SERVICE_URL', '/hon-search/typeaheadlabel');
app.constant('MIMIR_SERVICE_URL', '/hon-search/mimir');
app.constant('AUTOCORRECT_SERVICE_URL', '/hon-search/spell');
app.constant('QUESTIONS_SERVICE_URL', '/people-also-ask/questions');
app.constant('SCREENSHOT_SERVICE_URL', 'http://everyone.khresmoi.eu:3000');
app.constant('MAXIMUM_FREQUENCY_RATIO', 0.01);
app.constant('VERSION', 'rel-0.1.6');
app.constant('FONT_SIZE_SPAN', 4);
app.constant('DEFAULT_FONT_SIZE', 14);
app.constant('DEFAULT_PREFERENCES', {
  fontSize: 14,
  lowVision: false,
  mainColor: 'White',
  advancedSearch: true,
  advancedNews: false,
  translatedResults: true,
});
app.constant('LANGUAGES', {
  bg: {
    name: 'български',
    flag: 'bg',
    key: 'bg',
  },
  cs: {
    name: 'čeština',
    flag: 'cz',
    key: 'cs',
    translatableTargets: ['en'],
  },
  da: {
    name: 'dansk',
    flag: 'dk',
    key: 'da',
  },
  de: {
    name: 'Deutsch',
    flag: 'de',
    key: 'de',
    translatableTargets: ['en'],
  },
  el: {
    name: 'ελληνικά',
    flag: 'gr',
    key: 'el',
  },
  et: {
    name: 'eesti keel',
    flag: 'ee',
    key: 'et',
  },
  en: {
    name: 'English',
    flag: 'gb',
    key: 'en',
    translatableTargets: ['cs', 'de', 'fr', 'sv', 'es'],
  },
  es: {
    name: 'español',
    flag: 'es',
    key: 'es',
    translatableTargets: ['en'],
  },
  hr: {
    name: 'hrvatski',
    flag: 'hr',
    key: 'hr',
  },
  fr: {
    name: 'français',
    flag: 'fr',
    key: 'fr',
    translatableTargets: ['en'],
  },
  it: {
    name: 'italiano',
    flag: 'it',
    key: 'it',
  },
  lv: {
    name: 'latviešu valoda',
    flag: 'lv',
    key: 'lv',
  },
  lt: {
    name: 'lietuvių kalba',
    flag: 'lt',
    key: 'lt',
  },
  hu: {
    name: 'magyar',
    flag: 'hu',
    key: 'hu',
  },
  mt: {
    name: 'Malti',
    flag: 'mt',
    key: 'mt',
  },
  nl: {
    name: 'Nederlands',
    flag: 'nl',
    key: 'nl',
  },
  pl: {
    name: 'polski',
    flag: 'pl',
    key: 'pl',
  },
  pt: {
    name: 'português',
    flag: 'pt',
    key: 'pt',
  },
  ro: {
    name: 'română',
    flag: 'ro',
    key: 'ro',
  },
  sk: {
    name: 'slovenčina',
    flag: 'sk',
    key: 'sk',
  },
  sl: {
    name: 'slovenščina',
    flag: 'si',
    key: 'sl',
  },
  fi: {
    name: 'suomi',
    flag: 'fi',
    key: 'fi',
  },
  sv: {
    name: 'svenska',
    flag: 'se',
    key: 'sv',
    translatableTargets: ['en'],
  },
});
app.constant('COOKIESCALE', {
  few: 15,
  more: 30,
});
