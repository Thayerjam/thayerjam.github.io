/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~Bugs
    1) Score Per Click is able to go negative
    2) Score gained from wall bounces is able to gen points by just holding down 1 button
    3) big/smallifying cookie allows it to break game borders
    4) cookie can spawn inside intro text
    5) into text sequence3 -> sequence4 isn't fading out and in properly. Fade is overlapping heavily
    6) top nav bar text shouldn't be pushed to the right until the sidePanel pulls out


~Needs work
    1) Color scheme for buttons
    2) Making buttons come in as the game progresses instead of all showing up at once
    3) Additional Stats for topStatsBar
        i) acceleration
        ii) Top Speed?
            A) Toggles that increase/decrease speed?
    4) Windspeed and Winddirection visuals
    5) Additional intro text instructing the user that the mouse cursor cannot be used
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ideas
    1) Toggleable "skulls" that make the game harder but give more points 
    2) clicker classes, talent trees, experience, skills
      i) press c to get to character menu, where acceleration and physics are easier to deal with
    3) action game, fighting blips on the screen with skills/abilities. freezeframe/slowdown on successful hit

~skills
    1)

~classes
    1) beast neighbor
    2) necrodancer
    3) lance a little


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/* Game Functions */

function windowResizeTriggers() {
  //any position that is explicitly defined at program start needs to be redefines on window resize
}

function redefineButtonCoords() {
  clickableButtons.reset();
  clickableArea.reset();
}

const gameStartProperties = {
  isVertMovementMet: false,
  isHorMovementMet: false,
  isSpacebarClicked: false,
  sequence1Complete: false,
  sequence2Complete: false,
  sequence3Complete: false,
  sequence4Complete: false,
  sequence5Complete: false,
  sequence6Complete: false,
  sequence7Complete: false,
};

function gameStart() {
  htmlObjects.openingTitle.style.opacity = 1;
  //after title displays for 7 seconds, fade out over 3 seconds
  setTimeout(() => {
    htmlObjects.openingTitle.style.opacity = 0;
    //after title is nearly fully faded-out (2.5 seconds), fade-in opener 1 over 3 seconds
    setTimeout(() => {
      htmlObjects.opener1.style.opacity = 1;
      //after 3 seconds, opener 1 is fully faded in. Allow movement to potentially begin sequence2
      setTimeout(() => {
        gameStartProperties.sequence1Complete = true;
      }, 3000);
    }, 2500);
  }, 7000);
  function checkForActions() {
    if (userCursor.acceleration[0] > 20 || userCursor.acceleration[0] < -20) {
      gameStartProperties.isVertMovementMet = true;
    }
    if (userCursor.acceleration[1] > 20 || userCursor.acceleration[1] < -20) {
      gameStartProperties.isHorMovementMet = true;
    }
    if (
      gameStartProperties.isHorMovementMet &&
      gameStartProperties.isVertMovementMet &&
      !gameStartProperties.sequence2Complete &&
      gameStartProperties.sequence1Complete
    ) {
      //fade-out opener1 over 3 seconds
      htmlObjects.opener1.style.opacity = 0;
      //after opener1 is nearly faded out, fade-in opener 2
      setTimeout(() => {
        htmlObjects.opener2.style.opacity = 1;
        //after opener2 is fully faded-in, allow for sequence 3 to potentially begin
        setTimeout(() => {
          gameStartProperties.sequence2Complete = true;
        }, 3000);
      }, 2500);
    }
    if (
      gameStartProperties.isSpacebarClicked &&
      !gameStartProperties.sequence3Complete &&
      gameStartProperties.sequence2Complete
    ) {
      //fade-out opener2 over 3 seconds
      htmlObjects.opener2.style.opacity = 0;
      //after opener2 is nearly faded-out, fade-in opener3 over 3 seconds
      setTimeout(() => {
        htmlObjects.opener3.style.opacity = 1;
        setTimeout(() => {
          gameStartProperties.sequence3Complete = true;
        }, 3000);
      }, 2500);
    }
    if (gameStartProperties.sequence3Complete && !gameStartProperties.sequence4Complete) {
      htmlObjects.opener3.style.opacity = 0;
      setTimeout(() => {
        gameStartProperties.sequence4Complete = true;
      }, 3000);
    }
    if (score >= 3 && gameStartProperties.sequence4Complete) {
      htmlObjects.topStatsBar.style.top = 0;
      gameStartProperties.sequence5Complete = true;
    }
    if (score >= 10 && gameStartProperties.sequence5Complete) {
      htmlObjects.sidePanel.style.left = 0;
      gameStartProperties.sequence6Complete = true;
      setTimeout(() => {
        redefineButtonCoords();
      }, 4000);
    }
  }
  let movementCheckInterval = setInterval(checkForActions, 30);
}

function defineItemCoords(item) {
  let itemCoords = item.getBoundingClientRect();
  let output = {
    left: (itemCoords.left / window.innerWidth) * 100,
    right: (itemCoords.right / window.innerWidth) * 100,
    top: (itemCoords.top / window.innerHeight) * 100,
    bottom: (itemCoords.bottom / window.innerHeight) * 100,
  };
  return output;
}

function checkForClickableArea(cursorPercentX, cursorPercentY) {
  if (
    cursorPercentX >= clickableArea.left &&
    cursorPercentX <= clickableArea.right &&
    cursorPercentY >= clickableArea.top &&
    cursorPercentY <= clickableArea.bottom
  ) {
    return true;
  }
  return false;
}

function checkAndClickButton(cursorPercentY) {
  let counter = -1;
  for (button of Object.entries(clickableButtons)) {
    counter += 1;
    if (cursorPercentY >= button[1].top && cursorPercentY <= button[1].bottom) {
      Object.entries(upgradesAndBuildings)[counter][1].click();
      break;
    }
  }
}

function generateCookie() {
  cookie.x =
    Math.random() * (window.innerWidth - cookie.cookieWidth - windowStats.borderSize - windowStats.sidebarSize) +
    windowStats.borderSize +
    windowStats.sidebarSize;
  cookie.y =
    Math.random() * (window.innerHeight - cookie.cookieHeight - windowStats.borderSize) + windowStats.borderSize;
  htmlObjects.cookie.style.display = "initial"; // can be moved to gameStart function
  cookie.isCookie = true;
  cookie.cookieCoords = defineItemCoords(htmlObjects.cookie);
}

function moveCookie() {
  if (cookie.x < windowStats.sidebarSize) {
    cookie.x = windowStats.sidebarSize;
  }
  if (cookie.x > window.innerWidth - cookie.cookieWidth - windowStats.borderSize) {
    cookie.x = window.innerWidth - cookie.cookieWidth - windowStats.borderSize;
  }
  if (cookie.y < 0) {
    cookie.y = 0;
  }
  if (cookie.y > window.innerHeight - cookie.cookieHeight - windowStats.borderSize) {
    cookie.y = window.innerHeight - cookie.cookieHeight - windowStats.borderSize;
  }
  htmlObjects.cookie.style.left = `${cookie.x}px`;
  htmlObjects.cookie.style.top = `${cookie.y}px`;
  cookie.cookieCoords = defineItemCoords(htmlObjects.cookie);
}

function clearSquare() {
  ctx.clearRect(userCursor.x - 1, userCursor.y - 1, userCursor.size + 2, userCursor.size + 2);
}

function reduceAcceleration() {
  if (userCursor.acceleration[0] > 0) {
    userCursor.acceleration[0] -= 1 - effects.gravity;
  }
  if (userCursor.acceleration[1] > 0) {
    userCursor.acceleration[1] -= 1;
  }
  if (userCursor.acceleration[0] < 0) {
    userCursor.acceleration[0] += 1;
  }
  if (userCursor.acceleration[1] < 0) {
    userCursor.acceleration[1] += 1;
  }
}

function changeAcceleration() {
  if (
    userCursor.y <= windowStats.boxAdjustedHeight &&
    userCursor.y >= 0 &&
    userCursor.x <= windowStats.boxAdjustedWidth &&
    userCursor.x >= 0
  ) {
    if (effects.isGravity && userCursor.y !== windowStats.boxAdjustedHeight) {
      userCursor.acceleration[0] += 1;
    }
    if (userCursor.currentDirection[0] === 1 && userCursor.y < windowStats.boxAdjustedHeight) {
      //down
      userCursor.acceleration[0] += 3;
    }
    if (userCursor.currentDirection[1] === 1 && userCursor.y > 0) {
      //up
      userCursor.acceleration[0] -= 3;
    }
    if (userCursor.currentDirection[2] === 1 && userCursor.x < windowStats.boxAdjustedWidth) {
      //right
      userCursor.acceleration[1] += 3;
    }
    if (userCursor.currentDirection[3] === 1 && userCursor.x > 0) {
      //left
      userCursor.acceleration[1] -= 3;
    }
  }
}

function moveSquare() {
  if (effects.isWind) {
    userCursor.y += userCursor.acceleration[0] + effects.windDirection[0] * effects.windSpeed[0];
    userCursor.x += userCursor.acceleration[1] + effects.windDirection[1] * effects.windSpeed[0];
  } else {
    userCursor.y += userCursor.acceleration[0];
    userCursor.x += userCursor.acceleration[1];
  }

  userCursor.y = Number(userCursor.y.toFixed(2));
  userCursor.x = Number(userCursor.x.toFixed(2));
  if (userCursor.y < 0) {
    userCursor.y = 0;
  }
  if (userCursor.y > windowStats.boxAdjustedHeight) {
    userCursor.y = windowStats.boxAdjustedHeight;
  }
  if (userCursor.x < 0) {
    userCursor.x = 0;
  }
  if (userCursor.x > windowStats.boxAdjustedWidth) {
    userCursor.x = windowStats.boxAdjustedWidth;
  }
}

function edgeCollision() {
  if (userCursor.y <= 0 || userCursor.y >= windowStats.boxAdjustedHeight) {
    userCursor.acceleration[0] = userCursor.acceleration[0] * -1;
    userCursor.acceleration[0] = Math.floor(userCursor.acceleration[0] / 1.3);
    if (effects.isScoringBounces) {
      score += clickFactor;
    }
  }
  if (userCursor.x <= 0 || userCursor.x >= windowStats.boxAdjustedWidth) {
    userCursor.acceleration[1] = userCursor.acceleration[1] * -1;
    userCursor.acceleration[1] = Math.floor(userCursor.acceleration[1] / 1.3);
    if (effects.isScoringBounces) {
      score += clickFactor;
    }
  }
}

function drawSquare() {
  ctx.drawImage(htmlObjects.cursor, userCursor.x, userCursor.y, (userCursor.size / 4) * 3, userCursor.size);
}

function incrementScore() {
  if (effects.isVertScoring) {
    score += Math.round(Math.abs(userCursor.acceleration[0]) / 20);
  }
  if (effects.isHorScoring) {
    score += Math.round(Math.abs(userCursor.acceleration[1]) / 20);
  }
}

function updateDisplay() {
  htmlObjects.scoreDisplay.innerText = `Score: ${score}`;
  htmlObjects.clickFactorDisplay.innerText = `SPC: ${clickFactor}`;
  // htmlObjects.cookieSizeFactorDisplay.innerText = `Cookie Size Factor: ${cookie.sizeFactor}`;
  // htmlObjects.vertAccelerationDisplay.innerText = "Vertical Accel: " + userCursor.acceleration[0];
  // htmlObjects.horAccelerationDisplay.innerText = "Horizontal Accel: " + userCursor.acceleration[1];
  // htmlObjects.windSpeedDisplay.innerText = `Wind Speed: ${effects.windSpeed[0]}`;
  // htmlObjects.windDirectionDisplay.innerText = `Wind Direction: ${effects.windDirection[0]}, ${effects.windDirection[1]}`;
  // htmlObjects.crawlSpeedDisplay.innerText = `Crawl Speed: ${cookie.crawlSpeed[0]}`;
  // htmlObjects.crawlDirectionDisplay.innerText = `Crawl Direction: ${cookie.crawlDirection[0]}, ${cookie.crawlDirection[1]}`;
}

function iterate() {
  if (!cookie.isCookie) {
    generateCookie();
  }
  if (cookie.isCrawling) {
    changeWindOrCrawl(cookie.crawlSpeed, cookie.crawlDirection); // needs to be defined
    cookie.x += cookie.crawlSpeed[0] * cookie.crawlDirection[0];
    cookie.y += cookie.crawlSpeed[0] * cookie.crawlDirection[1];
    cookie.x = Number(cookie.x.toFixed(2));
    cookie.y = Number(cookie.y.toFixed(2));
    htmlObjects.cookie.style.left = `${cookie.x}px`;
    htmlObjects.cookie.style.top = `${cookie.y}px`;
    intervalObj.intervalCounter = 0;
  }
  if (effects.isWind) {
    changeWindOrCrawl(effects.windSpeed, effects.windDirection);
  }
  moveCookie();
  clearSquare();
  edgeCollision();
  reduceAcceleration();
  changeAcceleration();
  moveSquare();
  drawSquare();
  if (intervalObj.intervalCounter === 25) {
    incrementScore();
    intervalObj.intervalCounter = 0;
  } else {
    intervalObj.intervalCounter += 1;
  }

  updateDisplay();
}

function toggleGravity() {
  effects.isGravity = !effects.isGravity;
  if (effects.gravity === 0) {
    effects.gravity = 0.5;
    clickFactor = Math.floor(clickFactor * 2);
    upgradesAndBuildings.upgrade1.innerText = "toggleGravity: on";
  } else {
    effects.gravity = 0;
    clickFactor = Math.floor(clickFactor / 2);
    upgradesAndBuildings.upgrade1.innerText = "toggleGravity: off";
  }
}

function toggleWind() {
  if (!effects.isWind) {
    upgradesAndBuildings.upgrade2.innerText = "toggleWind: on";
  } else {
    upgradesAndBuildings.upgrade2.innerText = "toggleWind: off";
  }
  effects.isWind = !effects.isWind;
}

function changeWindOrCrawl(speed, direction) {
  let randomNumber = Math.random();
  if (randomNumber > 0.8) {
    speed[0] += 0.1;
  } else if (randomNumber < 0.2) {
    speed[0] -= 0.1;
  }
  if (speed[0] >= 1) {
    speed[0] = 1;
  }
  if (speed[0] <= -1) {
    speed[0] = -1;
  }
  if (randomNumber < 0.2) {
    if (direction[0] < 3) {
      direction[0] += 1;
    }
  } else if (randomNumber < 0.4) {
    if (direction[0] > -3) {
      direction[0] -= 1;
    }
  } else if (randomNumber < 0.6) {
    if (direction[1] < 3) {
      direction[1] += 1;
    }
  } else if (randomNumber < 0.8) {
    if (direction[1] > -3) {
      direction[1] -= 1;
    }
  }
  speed[0] = Number(speed[0].toFixed(2));
}

function toggleCookieCrawl() {
  if (!cookie.isCrawling) {
    upgradesAndBuildings.upgrade3.innerHTML = "toggleCookieCrawl: on";
  } else {
    upgradesAndBuildings.upgrade3.innerHTML = "toggleCookieCrawl: off";
  }
  cookie.isCrawling = !cookie.isCrawling;
}

function toggleSmallCookie() {
  htmlObjects.cookie.style.width = htmlObjects.cookie.offsetWidth / 2 + "px";
  htmlObjects.cookie.style.height = htmlObjects.cookie.offsetHeight / 2 + "px";
  cookie.sizeFactor -= 1;
  clickFactor += 1;
  cookie.cookieCoords = defineItemCoords(htmlObjects.cookie);
}

function toggleBigCookie() {
  htmlObjects.cookie.style.width = htmlObjects.cookie.offsetWidth * 2 + "px";
  htmlObjects.cookie.style.height = htmlObjects.cookie.offsetHeight * 2 + "px";
  cookie.sizeFactor += 1;
  clickFactor -= 1;
  cookie.cookieCoords = defineItemCoords(htmlObjects.cookie);
}

function toggleVertScoring() {
  if (!effects.isVertScoring) {
    upgradesAndBuildings.building1.style.backgroundColor = "green";
  } else {
    upgradesAndBuildings.building1.style.backgroundColor = "";
  }
  effects.isVertScoring = !effects.isVertScoring;
}

function toggleHorScoring() {
  if (!effects.isHorScoring) {
    upgradesAndBuildings.building2.style.backgroundColor = "green";
  } else {
    upgradesAndBuildings.building2.style.backgroundColor = "";
  }
  effects.isHorScoring = !effects.isHorScoring;
}

function toggleIncreasedClickFactor() {
  if (!effects.isClickEnhanced) {
    clickFactor *= 1.5;
    effects.isClickEnhanced = true;
    upgradesAndBuildings.building3.style.backgroundColor = "green";
  } else {
    clickFactor /= 1.5;
    effects.isClickEnhanced = false;
    upgradesAndBuildings.building3.style.backgroundColor = "";
  }
}

function toggleBounceScoring() {
  if (!effects.isScoringBounces) {
    upgradesAndBuildings.building4.style.backgroundColor = "green";
  } else {
    upgradesAndBuildings.building4.style.backgroundColor = "";
  }
  effects.isScoringBounces = !effects.isScoringBounces;
}

function toggleScoreOverTime() {}

function placeholderFunction() {
  console.log("placeholder function");
}

/* Global Variables */

const htmlObjects = {
  // vertAccelerationDisplay: document.querySelector("#vertAcceleration"),
  // horAccelerationDisplay: document.querySelector("#horAcceleration"),
  controlDropdown: document.querySelector("controlsDropdown"),
  scoreDisplay: document.querySelector("#score"),
  clickFactorDisplay: document.querySelector("#clickFactor"),
  scoreMultiplierDisplay: document.querySelector("#scoreMultiplier"),
  // cookieSizeFactorDisplay: document.querySelector("#cookieSizeFactor"),
  // windSpeedDisplay: document.querySelector("#windSpeed"),
  // windDirectionDisplay: document.querySelector("#windDirection"),
  // crawlSpeedDisplay: document.querySelector("#crawlSpeed"),
  // crawlDirectionDisplay: document.querySelector("#crawlDirection"),
  cookie: document.querySelector("#cookie"),
  cursor: document.querySelector("#cursor"),
  topStatsBar: document.querySelector("#topStatsBar"),
  sidePanel: document.querySelector("#sidePanel"),
  openingTitle: document.querySelector("#openingTitle"),
  opener1: document.querySelector("#openingTutorial1"),
  opener2: document.querySelector("#openingTutorial2"),
  opener3: document.querySelector("#openingTutorial3"),
};

const upgradesAndBuildings = {
  upgrade1: document.querySelector("#upgrade1"),
  upgrade2: document.querySelector("#upgrade2"),
  upgrade3: document.querySelector("#upgrade3"),
  upgrade4: document.querySelector("#upgrade4"),
  upgrade5: document.querySelector("#upgrade5"),
  building1: document.querySelector("#building1"),
  building2: document.querySelector("#building2"),
  building3: document.querySelector("#building3"),
  building4: document.querySelector("#building4"),
  building5: document.querySelector("#building5"),
  engine1: document.querySelector("#engine1"),
  engine2: document.querySelector("#engine2"),
  engine3: document.querySelector("#engine3"),
  engine4: document.querySelector("#engine4"),
  engine5: document.querySelector("#engine5"),
};

const clickableButtons = {
  upgrade1: defineItemCoords(upgradesAndBuildings.upgrade1),
  upgrade2: defineItemCoords(upgradesAndBuildings.upgrade2),
  upgrade3: defineItemCoords(upgradesAndBuildings.upgrade3),
  upgrade4: defineItemCoords(upgradesAndBuildings.upgrade4),
  upgrade5: defineItemCoords(upgradesAndBuildings.upgrade5),
  building1: defineItemCoords(upgradesAndBuildings.building1),
  building2: defineItemCoords(upgradesAndBuildings.building2),
  building3: defineItemCoords(upgradesAndBuildings.building3),
  building4: defineItemCoords(upgradesAndBuildings.building4),
  building5: defineItemCoords(upgradesAndBuildings.building5),
  engine1: defineItemCoords(upgradesAndBuildings.engine1),
  engine2: defineItemCoords(upgradesAndBuildings.engine2),
  engine3: defineItemCoords(upgradesAndBuildings.engine3),
  engine4: defineItemCoords(upgradesAndBuildings.engine4),
  engine5: defineItemCoords(upgradesAndBuildings.engine5),
  reset: function () {
    this.upgrade1 = defineItemCoords(upgradesAndBuildings.upgrade1);
    this.upgrade2 = defineItemCoords(upgradesAndBuildings.upgrade2);
    this.upgrade3 = defineItemCoords(upgradesAndBuildings.upgrade3);
    this.upgrade4 = defineItemCoords(upgradesAndBuildings.upgrade4);
    this.upgrade5 = defineItemCoords(upgradesAndBuildings.upgrade5);
    this.building1 = defineItemCoords(upgradesAndBuildings.building1);
    this.building2 = defineItemCoords(upgradesAndBuildings.building2);
    this.building3 = defineItemCoords(upgradesAndBuildings.building3);
    this.building4 = defineItemCoords(upgradesAndBuildings.building4);
    this.building5 = defineItemCoords(upgradesAndBuildings.building5);
    this.engine1 = defineItemCoords(upgradesAndBuildings.engine1);
    this.engine2 = defineItemCoords(upgradesAndBuildings.engine2);
    this.engine3 = defineItemCoords(upgradesAndBuildings.engine3);
    this.engine4 = defineItemCoords(upgradesAndBuildings.engine4);
    this.engine5 = defineItemCoords(upgradesAndBuildings.engine5);
  },
};

const clickableArea = {
  left: clickableButtons.upgrade1.left,
  right: clickableButtons.upgrade1.right,
  top: clickableButtons.upgrade1.top,
  bottom: clickableButtons.engine5.bottom,
  reset: function () {
    this.left = clickableButtons.upgrade1.left;
    this.right = clickableButtons.upgrade1.right;
    this.top = clickableButtons.upgrade1.top;
    this.bottom = clickableButtons.engine5.bottom;
  },
};

const userCursor = {
  x: 100,
  y: 200,
  size: 22,
  /* [down/up, right/left] */
  acceleration: [0, 0],
  /* [down, up, right, left] */
  currentDirection: [0, 0, 0, 0],
};

const windowStats = {
  canvasHeight: 1080,
  canvasWidth: 1920,
  boxAdjustedHeight: 1080 - userCursor.size,
  boxAdjustedWidth: 1920 - userCursor.size,
  borderSize: 0,
  sidebarSize: 200,
};

const effects = {
  gravity: 0,
  isGravity: false,
  windSpeed: [0],
  windDirection: [0, 0],
  isWind: false,
  isVertScoring: false,
  isHorScoring: false,
  isClickEnhanced: false,
  isScoringBounces: false,
};

const cookie = {
  x: 110,
  y: 110,
  isCookie: false,
  isCrawling: false,
  crawlSpeed: [0],
  crawlDirection: [0, 0],
  sizeFactor: 0,
  cookieStyle: getComputedStyle(htmlObjects.cookie),
  cookieWidth: function () {
    this.cookieWidth = parseInt(this.cookieStyle.width);
    return this;
  },
  cookieHeight: function () {
    this.cookieHeight = parseInt(this.cookieStyle.height);
    return this;
  },
}
  .cookieWidth() //self initializing cookieWidth
  .cookieHeight(); //self initializing cookieHeight

const c = document.getElementById("scrubCanvas");
const ctx = c.getContext("2d");
ctx.canvas.width = windowStats.canvasWidth;
ctx.canvas.height = windowStats.canvasHeight;

let score = 0;
let clickFactor = 1;

const intervalObj = {
  intervalSpeed: 30,
  intervalCounter: 0,
  interval: function () {
    this.interval = setInterval(iterate, this.intervalSpeed);
    return this;
  },
}.interval();

/* Event Listeners */

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyQ") {
    userCursor.currentDirection[0] = 1;
  } else if (e.code === "KeyW") {
    userCursor.currentDirection[1] = 1;
  } else if (e.code === "KeyO") {
    userCursor.currentDirection[2] = 1;
  } else if (e.code === "KeyP") {
    userCursor.currentDirection[3] = 1;
  } else if (e.code === "Space") {
    let cursorPercentX = (userCursor.x / windowStats.canvasWidth) * 100;
    let cursorPercentY = (userCursor.y / windowStats.canvasHeight) * 100;

    if (checkForClickableArea(cursorPercentX, cursorPercentY)) {
      checkAndClickButton(cursorPercentY);
    } else if (
      cursorPercentX >= cookie.cookieCoords.left &&
      cursorPercentX <= cookie.cookieCoords.right &&
      cursorPercentY >= cookie.cookieCoords.top &&
      cursorPercentY <= cookie.cookieCoords.bottom
    ) {
      if (!gameStartProperties.isSpacebarClicked) {
        gameStartProperties.isSpacebarClicked = true;
      }
      cookie.isCookie = false;
      score += clickFactor;
    }
  } else if (e.code === "Escape") {
    if (effects.isGravity) {
      toggleGravity();
    }
    if (effects.isWind) {
      toggleWind();
    }
    if (cookie.isCrawling) {
      toggleCookieCrawl();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "KeyQ") {
    userCursor.currentDirection[0] = 0;
  } else if (e.code === "KeyW") {
    userCursor.currentDirection[1] = 0;
  } else if (e.code === "KeyO") {
    userCursor.currentDirection[2] = 0;
  } else if (e.code === "KeyP") {
    userCursor.currentDirection[3] = 0;
  }
});

function clickButton(event) {
  event.srcElement.classList.add("clicked");
  setTimeout(() => {
    event.srcElement.classList.remove("clicked");
  }, 100);
}

upgradesAndBuildings.upgrade1.addEventListener("click", toggleGravity);
upgradesAndBuildings.upgrade2.addEventListener("click", toggleWind);
upgradesAndBuildings.upgrade3.addEventListener("click", toggleCookieCrawl);
upgradesAndBuildings.upgrade4.addEventListener("click", toggleSmallCookie); // needs tweaking to account for decimal values
upgradesAndBuildings.upgrade5.addEventListener("click", toggleBigCookie); // needs tweaking to account for decimal values

upgradesAndBuildings.building1.addEventListener("click", toggleVertScoring);
upgradesAndBuildings.building2.addEventListener("click", toggleHorScoring);
upgradesAndBuildings.building3.addEventListener("click", toggleIncreasedClickFactor);
upgradesAndBuildings.building4.addEventListener("click", toggleBounceScoring);
upgradesAndBuildings.building5.addEventListener("click", toggleScoreOverTime); //

upgradesAndBuildings.engine1.addEventListener("click", placeholderFunction); //
upgradesAndBuildings.engine2.addEventListener("click", placeholderFunction); //
upgradesAndBuildings.engine3.addEventListener("click", placeholderFunction); //
upgradesAndBuildings.engine4.addEventListener("click", placeholderFunction); //
upgradesAndBuildings.engine5.addEventListener("click", placeholderFunction); //

let upgradesAndBuildingsArray = Object.entries(upgradesAndBuildings);

for (button of upgradesAndBuildingsArray) {
  button[1].addEventListener("click", clickButton);
}

gameStart();

function cheatForTesting() {
  htmlObjects.sidePanel.style.left = 0;
  htmlObjects.topStatsBar.style.top = 0;
  setTimeout(() => {
    redefineButtonCoords();
  }, 4000);
}

//cheatForTesting();
