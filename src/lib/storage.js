/**
 * Sækir og vistar í localStorage
 */

// Fast sem skilgreinir heiti á lykli sem vistað er undir í localStorage
const LOCALSTORAGE_KEY = 'calc_game_scores';

/**
 * Sækir gögn úr localStorage. Skilað sem röðuðum lista á forminu:
 * { points: <stig>, name: <nafn> }
 *
 * @returns {array} Raðað fylki af svörum eða tóma fylkið ef ekkert vistað.
 */
let geymsla = [];
export function load() {
  if (localStorage.getItem(LOCALSTORAGE_KEY)) {
    geymsla = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
  }
  return geymsla;
}

/**
 * Vista stig
 *
 * @param {string} name Nafn þess sem á að vista
 * @param {number} points Stig sem á að vista
 */
export function save(name, points) {
  const vistadurLeikmadur = { points, name };
  geymsla = geymsla.concat(vistadurLeikmadur);
  geymsla.sort((a, b) => Number(b.points) - Number(a.points));
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(geymsla));
}

/**
 * Hreinsa öll stig úr localStorage
 */
export function clear() {
  geymsla = [];
  localStorage.clear();
  window.localStorage.removeItem(LOCALSTORAGE_KEY);
}
