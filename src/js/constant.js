app.constant('SELECT_SERVICE_URL', '/select');
app.constant('TRUST_SERVICE_URL', '/trustability');
app.constant('TRANSLATION_SERVICE_URL', '/translation');
app.constant('DISAMBIGUATOR_SERVICE_URL', '/khresmoiDisambiguator');
app.constant('NEWS_SERVICE_URL', '/feeds');
app.constant('SUGGEST_SERVICE_URL', '/suggest');
app.constant('QUESTIONS_SERVICE_URL', '/questions');
app.constant('SCREENSHOT_SERVICE_URL', 'http://everyone.khresmoi.eu:3000');
app.constant('VERSION', '0.1.1-pagination');
app.constant('DEFAULT_PREFERENCES', {
  hello: 'world',
  test: true,
  advancedSearch: true,
  advancedNews: false,
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
    translatableTargets: ['cs', 'de', 'fr'],
  },
  es: {
    name: 'español',
    flag: 'es',
    key: 'es',
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
  },
});
