var crashCounter = 0;
var crashCounterDiv = document.createElement("div");
var crashCounterTitle = document.createElement("p");
var blocked = false;

crashCounterDiv.style.position = "absolute";
crashCounterDiv.style.transform = "translateY(90%)";
crashCounterDiv.style.left = "46%";
crashCounterDiv.style.textAlign = "center";
crashCounterDiv.style.width = "100px";
crashCounterDiv.style.outline = "2px solid black";
crashCounterDiv.style.fontSize = "30px";
crashCounterTitle.style.position = "absolute";
crashCounterTitle.style.transform = "translateY(-100%)";
crashCounterTitle.style.left = "44%";
crashCounterTitle.style.fontSize = "30px";
crashCounterDiv.innerHTML = crashCounter;
crashCounterTitle.innerHTML = "Crashcounter";
document.getElementById("container").appendChild(crashCounterDiv);
document.getElementById("container").appendChild(crashCounterTitle);
let mineId = 0;
let crashSound = new Audio("assets/audio/explosion.wav");

for (let index = 0; index < 5; index++) {
  var img = document.createElement("img");
  img.src = "assets/img/mine.png";
  img.className = "mine";
  img.style.left = Math.random(80) * 80 + "%";
  img.style.top = Math.random(80) * 80 + "%";
  document.getElementById("container").appendChild(img);
  mineId++;
  img.id = "mine" + mineId;
}
//maakt 5 keer een mine op een random plek met een eigen id

var submarine = document.getElementById("submarine");
submarine.style.left = 0;
submarine.style.top = 0;
//de start positie van de submarine

var gameoverDiv = document.createElement("div");
gameoverDiv.id = "gameoverDiv";
gameoverDiv.innerHTML = "Game Over";
document.getElementById("container").appendChild(gameoverDiv);

document.body.onkeydown = function () {
  var e = event.keyCode;
  console.log(e); //welke knop er is ingedrukt
  if (!blocked) {
    switch (e) {
      case 37: //pijltje naar links
        submarine.style.transform = "rotate(180deg)";
        submarine.style.transform = "scaleX(-1)";
        submarine.style.left = parseInt(submarine.style.left) - 10 + "px";
        if (crash() == true) {
          submarine.style.left = parseInt(submarine.style.left) + 10 + "px";
        }
        break;
      case 38: //pijltje naar boven
        submarine.style.transform = "rotate(-90deg)";
        submarine.style.top = parseInt(submarine.style.top) - 10 + "px";
        if (crash() == true) {
          submarine.style.top = parseInt(submarine.style.top) + 10 + "px";
        }
        break;
      case 39: //pijltje naar rechts
        submarine.style.transform = "rotate(0deg)";
        submarine.style.left = parseInt(submarine.style.left) + 10 + "px";
        if (crash() == true) {
          submarine.style.left = parseInt(submarine.style.left) - 10 + "px";
        }
        break;
      case 40: //pijltje naar beneden
        submarine.style.transform = "rotate(90deg)";
        submarine.style.top = parseInt(submarine.style.top) + 10 + "px";
        if (crash() == true) {
          submarine.style.top = parseInt(submarine.style.top) - 10 + "px";
        }
        break;
      default:
        console.log("een andere toets is ingedrukt:" + e);
    }
  }
};

function crash() {
  var mines = document.getElementsByClassName("mine");
  var overlap = false;
  for (let index = 0; index < mines.length; index++) {
    overlap = !(
      submarine.getBoundingClientRect().right <
        mines[index].getBoundingClientRect().left ||
      submarine.getBoundingClientRect().left >
        mines[index].getBoundingClientRect().right ||
      submarine.getBoundingClientRect().bottom <
        mines[index].getBoundingClientRect().top ||
      submarine.getBoundingClientRect().top >
        mines[index].getBoundingClientRect().bottom
    ); //overlap is true als de submarine een mine raakt

    if (overlap) {
      blocked = true; //als er overlap is stopt de mogelijkheid om te bewegen
      crashSound.play();
      crashCounter += 1;
      crashCounterDiv.innerHTML = crashCounter;
      setTimeout(function () {
        submarine.style.left = 0;
        submarine.style.top = 0;
        submarine.style.transform = "rotate(0deg)";
        blocked = false; //na 1,5 seconde kan de speler de submarine weer bewegen
      }, 1500);

      var explosion = document.createElement("img");
      explosion.src = "assets/img/explosion.gif";
      explosion.src =
        explosion.src.replace(/\?.*$/, "") + "?x=" + Math.random();
      explosion.style.width = "70px";
      explosion.style.height = "70px";
      explosion.style.left = mines[index].style.left;
      explosion.style.top = mines[index].style.top;
      explosion.className = "explosion";
      document.getElementById("container").appendChild(explosion);
      setTimeout(function () {
        document.getElementById("container").removeChild(explosion);
      }, 1500); //verwijdert de gif na 1,5 seconden weer
      console.log("huidige mine: " + mines[index].style.left);
      var el = mines[index];
      el.parentNode.removeChild(el);

      if (crashCounter === 1) {
        submarine.src = "assets/img/submarine_damaged1.png";
      } else if (crashCounter === 2) {
        submarine.src = "assets/img/submarine_damaged2.png";
      } else if (crashCounter === 3) {
        // alert("The submarine is destroyed");
        gameoverDiv.style.display = "block";
        submarine.src = "assets/img/submarine.png";
        crashCounter = 0;
        crashCounterDiv.innerHTML = crashCounter;

        setTimeout(function () {
          gameoverDiv.style.display = "none";
          for (index = 0; index < 3; index++) {
            var img = document.createElement("img");
            img.src = "assets/img/mine.png";
            img.className = "mine";
            img.style.left = Math.random(80) * 80 + "%";
            img.style.top = Math.random(80) * 80 + "%";
            document.getElementById("container").appendChild(img);
            mineId++;
            img.id = "mine" + mineId;
          } //maakt 3 nieuwe mines als er 3 mines zijn geraakt
        }, 3000);
      }

      return true;
    }
  }
  return overlap;
}
