import qs from 'qs';

/**
 * Generates a random string of the give length made up of the allowed characters.
 * @param {number} [length=10] - Length of resulting string.
 * @param {string} [allowed=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789] - Characters allowed in the results.
 * @return {string}
 */
export function randomString(
  length = 10,
  allowed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += allowed.charAt(Math.floor(Math.random() * allowed.length));
  }
  return result;
}

/**
 * @param {*} v
 * @returns {("string"|"number"|"boolean"|"array"|"function"|"null"|"undefined"|"object")}
 */
export function getRawType(v) {
  return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
}

/** @param {Request} request */
export function isFetchRequest(request) {
  const accept = request.headers.get('accept');
  const secFetchMode = request.headers.get('sec-fetch-mode');

  return accept.includes('application/json') || secFetchMode === 'cors';
}

/**
 * @param {() => {}} func
 * @param {number} delay
 * @param {{ leading: boolean }} options
 */
export function debounce(func, delay, { leading } = {}) {
  let timerId;

  return (...args) => {
    if (!timerId && leading) {
      func(...args);
    }
    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), delay);
  };
}

const pluralRules = new Intl.PluralRules('en-US');
/**
 * @param {number} count 
 * @param {string} singular 
 * @param {string} plural 
 */
export function pluralize(count, singular, plural) {
  const grammaticalNumber = pluralRules.select(count);
  switch (grammaticalNumber) {
    case 'one':
      return singular;
    case 'other':
      return plural;
    default:
      throw new Error('Unknown: ' + grammaticalNumber);
  }
}

const DEFAULT_PER_PAGE = 12;
/**
 * @param {sring|URLSearchParams} search
 * @return {Record<string, any> & {
 * page: number,
 * perPage: number,
 * sortBy: [string, 'asc'|'desc'][]
 * }}
 */
export function searchParamsToQuery(search) {
  const searchParams = new URLSearchParams(search);
  const query = qs.parse(searchParams.toString(), { ignoreQueryPrefix: true });

  if (query.sortBy == null) {
    query.sortBy = [];
  } else if (!Array.isArray(query.sortBy)) {
    query.sortBy = [query.sortBy];
  }
  if (query.sortDir == null) {
    query.sortDir = [];
  } else if (!Array.isArray(query.sortDir)) {
    query.sortDir = [query.sortDir];
  }

  query.perPage = query.perPage ? parseInt(query.perPage) : DEFAULT_PER_PAGE;
  query.perPage = Math.max(query.perPage, 1);
  query.page = query.page ? parseInt(query.page) : 1;
  query.page = Math.max(query.page, 0);

  return query;
}

/**
 * @param {keyof typeSvgMap} petType
 */
export function getPetTypeSvgHref(petType) {
  const typeSvgMap = /** @type {const} */ ({
    bird: '#icon-bird',
    bunny: '#icon-bunny',
    cat: '#icon-cat',
    dog: '#icon-dog',
    fish: '#icon-fish',
    reptile: '#icon-lizard',
  });
  if (typeSvgMap[petType]) {
    return typeSvgMap[petType];
  }
  return '#icon-paw-print';
}
