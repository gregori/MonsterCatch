// cria um canvas programaticamente e o configura
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// carrega a imagem de fundo
let bgReady = false;
let bgImage = new Image();
bgImage.onload = function () {
  // mostra a imagem de fundo
  bgReady = true;
};
bgImage.src = "images/background.png";

// carrega a imagem do herói
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function () {
  // mostra a imagem
  heroReady = true;
};
heroImage.src = "images/hero.png";

// carrega a imagem do monstro
let monsterReady = false;
let monsterImage = new Image();
monsterImage.onload = function () {
  // mostra a imagem
  monsterReady = true;
};
monsterImage.src = "images/monster.png";

// cria os objetos do jogo
let hero = {
  speed: 256 // velocidade do herói em px/s
};
let monster = {};
let monstersCaught = 0; // quantos monstros foram pegos?

// lida com os controles do teclado
let keysDown = {};

// armazena as teclas que foram pressionadas
addEventListener("keydown", function (e) {
  keysDown[e.key] = true; 
});

addEventListener("keyup", function (e) {
  delete keysDown[e.key];
});

// reseta a posição do jogador e do monstro quando um monstro for pego
function reset() {
  // leva o jogador pro meio do canvas
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
  
  // posiciona o monstro aleatoreamente no canvas
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
}

function checkMonsterColision() {
  return (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y +32)
  );
}

// atualiza os objetos do jogo - move o jogador conforme as teclas pressionadas
function update(modifier) {
  let movement = hero.speed * modifier;
  if ("Up" in keysDown || "ArrowUp" in keysDown) {
    hero.y -= movement;
  }
  if ("Down" in keysDown || "ArrowDown" in keysDown) {
    hero.y += movement;
  }
  if ("Left" in keysDown || "ArrowLeft" in keysDown) {
    hero.x -= movement;
  }
  if ("Right" in keysDown || "ArrowRight" in keysDown) {
    hero.x += movement;
  }

  if (checkMonsterColision()) {
    monstersCaught++;
    reset();
  }
}

function drawScoreTimeAndGameOver() {
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Monstros pegos: " + monstersCaught, 20, 20);
  ctx.fillText("Time: " + count, 20, 50);

  // se acabou o tempo, mostra Fim de Jogo
  if (finished) {
    ctx.fillText("Fim de jogo!", 200, 200);
  }
}

// desenha tudo no canvas
function draw() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0); // desenha o fundo
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y); // desenha o herói
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y); // desenha o monstro
  }

  drawScoreTimeAndGameOver();
}

let count = 30; // quanto tempo dura o jogo - padráo 30s
let finished = false;

function counter() {
  count--; // reduz um segundo

  // quando o contador chega a zero limpa o timer, esconde monstro e herói
  if (count <= 0) {
    // para o timer
    clearInterval(counter);
    // marca o jogo como terminado
    finished = true;
    count = 0;
    // esconde monstro e herói
    monsterReady = false;
    heroReady = false;
  }
}

// temporizador é a cada segundo (1000ms)
setInterval(counter, 1000);

// o loop principal do jogo
function main() {
  // atualiza o estado do jogo
  update(0.02);

  // desenha
  draw();

  // requisita o redesenho
  requestAnimationFrame(main);
}

// suporte Cross-browser para o requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Vamos jogar!
reset();
main();

