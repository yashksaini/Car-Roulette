let ball = document.getElementsByClassName("circle");
let current_car = document.getElementById("current_car");
let game_coins = document.getElementById("game_coins");
let timeShow = document.getElementById("time");
let car_coins_on = document.getElementsByClassName("car_coins_on");
let profit = document.getElementById("profit");
let totalCoins = document.getElementById("totalCoins");
let player_name = document.getElementById("player_name");
var audio_id = document.getElementById("current_audio");
var audio_id1 = document.getElementById("current_audio1");
let max = 196;
let min = 96;
let t;
let fullViewValue = false;
let secondsLeft = 5;
var bidTimer;
var gamePlay;
var staringTimer;
let ballValue = 0;
let ball_no = 0;
let valid = false;
let arr = [
  "b1",
  "a1",
  "a2",
  "a3",
  "b2",
  "a2",
  "a3",
  "a4",
  "b4",
  "a3",
  "a4",
  "a1",
  "b3",
  "a4",
  "a2",
  "a1",
  "b1",
  "a1",
  "a2",
  "a3",
  "b2",
  "a2",
  "a3",
  "a4",
  "b4",
  "a3",
  "a4",
  "a1",
  "b3",
  "a4",
  "a2",
  "a1",
];
let coinsOnCars = [0, 0, 0, 0, 0, 0, 0, 0];
let multipyArr = [20, 20, 20, 20, 5, 5, 5, 5];
let carNames = ["b1", "b2", "b3", "b4", "a1", "a2", "a3", "a4"];
let gameCars = [];
let bidTimeValue = 13;
let PlayerCoins;
const run = () => {
  // Both values min and max are included
  ballValue = Math.floor(Math.random() * (max - min + 1)) + min - 1;
  t = setInterval(move, 50);
};
let PlayerName;
const updatePrevCars = () => {
  let prev_cars = document.getElementById("prev_cars");
  prev_cars.innerHTML = "";
  gameCars = JSON.parse(localStorage.getItem("Cars"));

  for (let i = gameCars.length - 1; i > 0; i--) {
    prev_cars.innerHTML +=
      "<div><img src='images/" + arr[gameCars[i]] + ".png' /></div>";
  }
  current_car.innerHTML =
    "<img src='images/" + arr[gameCars[gameCars.length - 1]] + ".png' />";
};
if (JSON.parse(localStorage.getItem("Cars"))) {
  gameCars = JSON.parse(localStorage.getItem("Cars"));
  updatePrevCars();
}
if (JSON.parse(localStorage.getItem("Coins"))) {
  PlayerCoins = JSON.parse(localStorage.getItem("Coins"));
  game_coins.innerHTML = PlayerCoins;
  PlayerName = JSON.parse(localStorage.getItem("Name"));
  player_name.innerHTML = PlayerName;
} else {
  PlayerCoins = 251;
  PlayerName = "Guest" + Math.floor(Math.random() * 9000);
  localStorage.setItem("Name", JSON.stringify(PlayerName));
  localStorage.setItem("Coins", JSON.stringify(PlayerCoins));
  game_coins.innerHTML = PlayerCoins;
  player_name.innerHTML = PlayerName;
}

const Beginningtimer = () => {
  if (secondsLeft > 0) {
    secondsLeft--;
  }
  timeShow.innerHTML = "Starting in " + secondsLeft + " s";
  if (secondsLeft === 0) {
    timeShow.innerHTML = "Ready";
    bidTimer = setInterval(bidding, 1000);
    valid = true;
    clearInterval(staringTimer);
  }
};
const bidding = () => {
  if (bidTimeValue > 0) {
    bidTimeValue--;
    timeShow.innerHTML = bidTimeValue + " s";
  } else {
    run();
    valid = false;
    timeShow.innerHTML = "Running. . ";
    clearInterval(bidTimer);
  }
};
const move = () => {
  ball[ball_no % 32].classList.remove("active");
  if (ball_no < ballValue) {
    if (ballValue - ball_no > 1) {
      audio_id.currentTime = 0;
      audio_id.play();
    } else {
      audio_id1.play();
    }

    ball_no++;
    if (ballValue - ball_no === 7) {
      clearInterval(t);
      t = setInterval(move, 300);
    } else if (ballValue - ball_no === 6) {
      clearInterval(t);
      t = setInterval(move, 400);
    } else if (ballValue - ball_no === 4) {
      clearInterval(t);
      t = setInterval(move, 500);
    }
  } else {
    clearInterval(t);
    staringTimer = setInterval(Beginningtimer, 1000);
    bidTimeValue = 13;
    secondsLeft = 6;
    ball_no = ball_no % 32;
    updgradeCoins();
    updateCarCoins();
    if (gameCars.length > 9) {
      gameCars.splice(0, 1);
    }
    gameCars.push(ball_no);
    localStorage.setItem("Cars", JSON.stringify(gameCars));
    updatePrevCars();
  }
  ball[ball_no % 32].classList.add("active");
};
let currentCoinValue = 10;
const coinValue = (value) => {
  if (value <= PlayerCoins) {
    let x = "coin" + value;
    let y = "coin" + currentCoinValue;
    document.getElementById(y).className = "";
    document.getElementById(x).className = "selectedCoin";
    currentCoinValue = value;
  }
};
const updateCarCoins = () => {
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += coinsOnCars[i];
    if (coinsOnCars[i] > 0) {
      car_coins_on[i].innerHTML = coinsOnCars[i] + " Coins";
    } else {
      car_coins_on[i].innerHTML = "";
    }
  }
  totalCoins.innerHTML = sum + " Coins";
};
const putCoins = (value) => {
  if (valid) {
    if (PlayerCoins - currentCoinValue >= 0) {
      coinsOnCars[value] += currentCoinValue;
      PlayerCoins -= currentCoinValue;
      let temp = PlayerCoins;
      localStorage.setItem("Coins", JSON.stringify(temp));
      game_coins.innerHTML = PlayerCoins;
      updateCarCoins();
    }
  }
};
const updgradeCoins = () => {
  let index = carNames.indexOf(arr[ball_no]);
  let earn = 0;
  earn = parseInt(coinsOnCars[index] * multipyArr[index]);
  let lost = 0;
  for (let i = 0; i < 8; i++) {
    lost += coinsOnCars[i];
  }
  let totalEarning = earn - lost;

  if (totalEarning >= 0) {
    profit.innerHTML =
      "<span class='profit'>" + " <b>+</b> " + totalEarning + " Coins</span>";
  } else {
    profit.innerHTML =
      "<span class='loss'>" +
      " <b>-</b> " +
      -1 * totalEarning +
      " Coins</span>";
  }
  PlayerCoins = parseInt(PlayerCoins + earn);
  let temp = PlayerCoins;
  localStorage.setItem("Coins", JSON.stringify(temp));
  game_coins.innerHTML = PlayerCoins;

  coinsOnCars = [0, 0, 0, 0, 0, 0, 0, 0];
};
const getCoins = () => {
  if (PlayerCoins === 1) {
    if (!valid) {
      PlayerCoins = 31;
      localStorage.setItem("Coins", JSON.stringify(PlayerCoins));
      game_coins.innerHTML = PlayerCoins;
    } else {
      alert("Get Coins after this round");
    }
  } else {
    alert("Free coins only when one coin left");
  }
};
const fullView = () => {
  if (!fullViewValue) {
    document.body.requestFullscreen();
    fullViewValue = true;
  } else {
    document.exitFullscreen();
    fullViewValue = false;
  }
};
const start = () => {
  staringTimer = setInterval(Beginningtimer, 1000);
};
