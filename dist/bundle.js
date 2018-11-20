(function () {
  'use strict';

  /**
   * Úr sýnilausn fyrir verkefni 7.
   */
  var operators = ['+', '-', '*', '/'];
  /**
  * Skilar tölu af handahófi á bilinu [min, max]
  */

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  /**
  * Útbýr spurningu og skilar sem hlut:
  * { problem: strengur með spurningu, answer: svar við spurningu sem tala }
  */


  function question() {
    var operator = operators[randomNumber(0, operators.length - 1)];
    var a = null;
    var b = null;
    var answer = null;

    switch (operator) {
      case '+':
        a = randomNumber(10, 100);
        b = randomNumber(10, 100);
        answer = a + b;
        break;

      case '-':
        a = randomNumber(10, 100);
        b = randomNumber(10, a);
        answer = a - b;
        break;

      case '*':
        a = randomNumber(1, 10);
        b = randomNumber(1, 10);
        answer = a * b;
        break;

      case '/':
        b = randomNumber(2, 10);
        a = randomNumber(2, 10) * b;
        answer = a / b;
        break;

      default:
        break;
    }

    return {
      problem: "".concat(a, " ").concat(operator, " ").concat(b),
      answer: answer
    };
  }

  /**
   * Hreinsa börn úr elementi
   *
   * @param {object} element Element sem á að hreinsa börn úr
   */
  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  /**
  * Búa til element og aukalega setja börn ef send með
  *
  * @param {string} name Nafn á element
  * @param  {...any} children Börn fyrir element
  */

  function el(name) {
    var element = document.createElement(name);

    for (var _len = arguments.length, children = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      children[_key - 1] = arguments[_key];
    }

    if (Array.isArray(children)) {
      children.forEach(function (child) {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child) {
          element.appendChild(child);
        }
      });
    }

    return element;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * Sækir og vistar í localStorage
   */
  // Fast sem skilgreinir heiti á lykli sem vistað er undir í localStorage
  var LOCALSTORAGE_KEY = 'calc_game_scores';
  /**
   * Sækir gögn úr localStorage. Skilað sem röðuðum lista á forminu:
   * { points: <stig>, name: <nafn> }
   *
   * @returns {array} Raðað fylki af svörum eða tóma fylkið ef ekkert vistað.
   */

  var geymsla = [];
  function load() {
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

  function save(name, points) {
    var vistadurLeikmadur = {
      points: points,
      name: name
    };
    geymsla = geymsla.concat(vistadurLeikmadur);
    geymsla.sort(function (a, b) {
      return Number(b.points) - Number(a.points);
    });
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(geymsla));
  }
  /**
   * Hreinsa öll stig úr localStorage
   */

  function clear() {
    geymsla = [];
    localStorage.clear();
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  /**
   * Reikna út stig fyrir svör út frá heildarfjölda svarað á tíma.
   * Ekki þarf að gera ráð fyrir hversu lengi seinasta spurning var sýnd. Þ.e.a.s.
   * stig verða alltaf reiknuð fyrir n-1 af n spurningum.
   *
   * @param {number} total Heildarfjöldi spurninga
   * @param {number} correct Fjöldi svarað rétt
   * @param {number} time Tími sem spurningum var svarað á í sekúndum
   * @returns {number} Stig fyrir svör
   */

  function score(total, correct, time) {
    // Útfærum gefna jöfnu:
    var gildi = (correct / total * (correct / total) + correct) * total / time; // Námunda að næstu heilu tölu og margfalda með 100

    gildi = Math.round(gildi) * 100;
    return gildi;
  }
  /**
  * Útbúa stigatöflu, sækir gögn í gegnum storage.js
  */

  var Highscore =
  /*#__PURE__*/
  function () {
    function Highscore() {
      _classCallCheck(this, Highscore);

      this.scores = document.querySelector('.highscore__scores');
      this.button = document.querySelector('.highscore__button');
      this.button.addEventListener('click', this.clear.bind(this));
    }
    /**
     * Hlaða stigatöflu inn
     */


    _createClass(Highscore, [{
      key: "load",
      value: function load$$1() {
        this.highscore(load());
      }
      /**
       * Hreinsa allar færslur úr stigatöflu, tengt við takka .highscore__button
       */

    }, {
      key: "clear",
      value: function clear$$1() {
        clear();
        empty(this.scores);
        var stigSkrad = el('p', 'Engin stig skráð');
        this.scores.appendChild(stigSkrad);
        this.button.classList.add('highscore__button--hidden');
      }
      /**
       * Hlaða inn stigatöflu fyrir gefin gögn.
       *
       * @param {array} data Fylki af færslum í stigatöflu
       */

    }, {
      key: "highscore",
      value: function highscore(data) {
        empty(this.scores);
        this.button.classList.add('highscore__button--hidden');
        var ordList = el('oL');
        this.score.appendChild(ordList);
        data.forEach(function (pts) {
          var listi = el('li');
          var stig = el('span', "".concat(pts.points));
          stig.classList.add('highscore__number');
          stig.classList.add('highscore__name');
          var nafn = el('span', "".concat(stig.name));
          ordList.appendChild(listi);
          listi.appendChild(stig);
          listi.appendChild(nafn);
        });
      }
    }]);

    return Highscore;
  }();

  var startButton; // takki sem byrjar leik

  var problem; // element sem heldur utan um verkefni, sjá index.html

  var result; // element sem heldur utan um niðurstöðu, sjá index.html
  // Bætt við

  var teljari;
  var svar;
  var svorin;
  var birtaTexta;
  var stig;
  var met;
  var resultInput;
  var points; // Fjöldi stiga
  // Lokið

  var playTime; // hversu lengi á að spila? Sent inn gegnum init()

  var total = 0; // fjöldi spurninga í núverandi leik

  var correct = 0; // fjöldi réttra svara í núverandi leik

  var currentProblem; // spurning sem er verið að sýna
  // Fall sem hreinsar svar reitinn.

  function hreinsun() {
    svar.value = '';
  } // Reiknar stig og birtir í result.


  function finish() {
    points = score(total, correct, playTime);
    var text = "\xDE\xFA svara\xF0ir ".concat(correct, " r\xE9tt af ").concat(total, " spurningum og f\xE9kkst ").concat(points, " stig fyrir. Skr\xE1\xF0u \xFEig \xE1 stigat\xF6fluna!");
    hreinsun();
    var nytt = el('span', text);
    empty(birtaTexta);
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
    empty(teljari);
    var nytt = el('span', "".concat(current));
    teljari.appendChild(nytt);
    setTimeout(function () {
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
    currentProblem = new question();
    total += 1;
    var problemQuestion = problem.querySelector('.problem__question');
    empty(problemQuestion);
    var span = el('span', currentProblem.problem);
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
    var a = svar.value.trim();

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
    var a = resultInput.value.trim();
    save(a, points);
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


  function init(_playTime) {
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
    startButton = document.addevenListener('click', start);
    svorin.addEventListener('submit', onSubmit);
    stig.addEventListener('submit', onSubmitScore);
  }

  var PLAY_TIME = 10;
  document.addEventListener('DOMContentLoaded', function () {
    init(PLAY_TIME);
    var highscore = new Highscore();
    highscore.load();
  });

}());
//# sourceMappingURL=bundle.js.map
