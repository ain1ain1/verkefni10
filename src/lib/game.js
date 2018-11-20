 import Question from './question';
import * as helper from './helpers';
import Highscore, { score } from './highscore';
import * as storage from './storage';
// allar breytur hér eru aðeins sýnilegar innan þessa módúl

let startButton; // takki sem byrjar leik
let problem; // element sem heldur utan um verkefni, sjá index.html
let result; // element sem heldur utan um niðurstöðu, sjá index.html
// Bætt við
let teljari;
let svar;
let svorin;
let birtaTexta;
let stig;
let met;
let resultInput;
let points; // Fjöldi stiga
// Lokið
let playTime; // hversu lengi á að spila? Sent inn gegnum init()
let total = 0; // fjöldi spurninga í núverandi leik
let correct = 0; // fjöldi réttra svara í núverandi leik
let currentProblem; // spurning sem er verið að sýna
// Fall sem hreinsar svar reitinn.
function hreinsun() {
  svar.value = '';
}
// Reiknar stig og birtir í result.
function finish() {
  points = score(total, correct, playTime);
  const text = `Þú svaraðir ${correct} rétt af ${total} spurningum og fékkst ${points} stig fyrir. Skráðu þig á stigatöfluna!`;
  hreinsun();
  const nytt = helper.el('span', text);
  helper.empty(birtaTexta);
  birtaTexta.appendChild(nytt);
  /**
  * Klárar leik. Birtir result og felur problem.
  */
  problem.classList.add('problem--hidden');
  result.classList.remove('result--hidden');
}

/**
 * Keyrir áfram leikinn. Telur niður eftir því hve langur leikur er og þegar
 * tími er búinn kallar í finish().
 *
 * Í staðinn fyrir að nota setInterval köllum við í setTimeout á sekúndu fresti.
 * Þurfum þá ekki að halda utan um id á intervali og skilum falli sem lokar
 * yfir fjölda sekúnda sem eftir er.
 *
 * @param {number} current Sekúndur eftir
 */
function tick(current) {
  helper.empty(teljari);
  const nytt = helper.el('span', `${current}`);
  teljari.appendChild(nytt);
  setTimeout(() => {
    if (current <= 0) {
      return finish();
    }

    return tick(current - 1);
  }, 1000);
}

/**
 * Býr til nýja spurningu og sýnir undir .problem__question
 */
function showQuestion() {
  currentProblem = new Question();
  total += 1;
  const problemQuestion = problem.querySelector('.problem__question');
  helper.empty(problemQuestion);
  const span = helper.el('span', currentProblem.problem);
  problemQuestion.appendChild(span);
}

/**
 * Byrjar leik
 *
 * - Felur startButton og sýnir problem
 * - Núllstillir total og correct
 * - Kallar í fyrsta sinn í tick()
 * - Sýnir fyrstu spurningu
 */
function start() {
  correct = 0;
  total = 0;
  points = 0;
  startButton.classList.add('button--hidden');
  problem.classList.remove('problem--hidden');
  tick(playTime);
  showQuestion();
}

/**
 * Event handler fyrir það þegar spurningu er svarað. Athugar hvort svar sé
 * rétt, hreinsar input og birtir nýja spurningu.
 *
 * @param {object} e Event þegar spurningu svarað
 */
function onSubmit(e) {
  e.preventDefault();
  const a = svar.value.trim();

  if (parseInt(a, 10) === currentProblem.answer) {
    correct += 1;
  }
  hreinsun();
  showQuestion();
}

/**
 * Event handler fyrir þegar stig eru skráð eftir leik.
 *
 * @param {*} e Event þegar stig eru skráð
 */
function onSubmitScore(e) {
  e.preventDefault();
  const a = resultInput.value.trim();

  storage.save(a, points);
  met.load();
  result.classList.add('result--hidden');
  problem.classList.add('problem--hidden');
  startButton.classList.remove('button--hidden');
}

/**
 * Finnur öll element DOM og setur upp event handlers.
 *
 * @param {number} _playTime Fjöldi sekúnda sem hver leikur er
 */
export default function init(_playTime) {
  playTime = _playTime;
  met = new Highscore();

  problem = document.querySelector('.problem');
  result = document.querySelector('.result');
  teljari = document.querySelector('.problem__timer');
  svar = document.querySelector('.problem__input');
  startButton = document.querySelector('.start');
  svorin = document.querySelector('.problem__answer');
  birtaTexta = document.querySelector('.result__text');
  stig = document.querySelector('.result__form');
  resultInput = document.querySelector('.result__input');
  startButton.document.addEventListener('click', start);
  svorin.addEventListener('submit', onSubmit);
  stig.addEventListener('submit', onSubmitScore);
}
