var Snake = (function () {

  // Definir variáveis globais e configurar o jogo
  let sizeInitialSnake = 1
  let isPaused

  var fixedTail = true;

  let gameInterval
  
  var tileCount = 10;

  let sizeCanvas = 350 / tileCount

  const INITIAL_PLAYER = { x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) };
  
  var velocity = { x:0, y:0 };
  var player = { x: INITIAL_PLAYER.x, y: INITIAL_PLAYER.y };

  var walls = false;

  var fruit = { x:1, y:1 };

  var trail = [];
  var tail = sizeInitialSnake;

  var reward = 0;
  var points = 0;
  var pointsMax = 0;
  
  const setup = () => {
    canv = document.getElementById('gc')
    ctx = canv.getContext('2d')
    isPaused = false
    document.addEventListener('keydown', keyPush);
    game.reset()
  }

  var game = {
    reset: function () {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canv.width, canv.height);

      tail = sizeInitialSnake;
      points = 0;
      velocity.x = 0;
      velocity.y = 0;
      player.x = INITIAL_PLAYER.x;
      player.y = INITIAL_PLAYER.y;
      reward = -1;

      trail = [];
      trail.push({ x: player.x, y: player.y });
      isPaused = false
    },

    action: {
      up: function () {
        velocity.x = 0
        velocity.y = -1
      },
      down: function () {
        velocity.x = 0
        velocity.y = 1
      },
      left: function () {
        velocity.x = -1
        velocity.y = 0
      },
      right: function () {
        velocity.x = 1
        velocity.y = 0
      }
    },

    RandomFruit: function () {
      if(walls){
        fruit.x = 1+Math.floor(Math.random() * (tileCount-2));
        fruit.y = 1+Math.floor(Math.random() * (tileCount-2));
      }
      else {
        fruit.x = Math.floor(Math.random() * tileCount);
        fruit.y = Math.floor(Math.random() * tileCount);
      }
    },

    loop: function () {
      if (isPaused) {
        return // Se estiver pausado, não executa o jogo
      }

      reward = -0.1;

      function DontHitWall () {
        if(player.x < 0) player.x = tileCount-1;
        if(player.x >= tileCount) player.x = 0;
        if(player.y < 0) player.y = tileCount-1;
        if(player.y >= tileCount) player.y = 0;
      }
      function HitWall () {
        if(player.x < 1) game.reset();
        if(player.x > tileCount-2) game.reset();
        if(player.y < 1) game.reset();
        if(player.y > tileCount-2) game.reset();

        ctx.fillStyle = 'grey';
        ctx.fillRect(0,0,sizeCanvas-1,canv.height);
        ctx.fillRect(0,0,canv.width,sizeCanvas-1);
        ctx.fillRect(canv.width-sizeCanvas+1,0,sizeCanvas,canv.height);
        ctx.fillRect(0, canv.height-sizeCanvas+1,canv.width,sizeCanvas);
      }

      var stopped = velocity.x == 0 && velocity.y == 0;
      
      player.x += velocity.x;
      player.y += velocity.y;
      
      // Desenhar o fundo do canvas
      ctx.fillStyle = 'black'
      ctx.fillRect(0,0,canv.width,canv.height)
      
      if(walls) HitWall();
      else DontHitWall();
      
      if (!stopped){
        trail.push({x:player.x, y:player.y});
        while(trail.length > tail) trail.shift();
      }
      
      ctx.fillStyle = 'green';
      for(var i=0; i<trail.length-1; i++) {
        ctx.fillRect(trail[i].x * sizeCanvas+1, trail[i].y * sizeCanvas+1, sizeCanvas-2, sizeCanvas-2);

        if (!stopped && trail[i].x == player.x && trail[i].y == player.y){
          game.reset();
        }
        ctx.fillStyle = 'lime';
      }
      ctx.fillRect(trail[trail.length-1].x * sizeCanvas+1, trail[trail.length-1].y * sizeCanvas+1, sizeCanvas-2, sizeCanvas-2);
      
      if (player.x == fruit.x && player.y == fruit.y) {
        if(!fixedTail) tail++;
        points++;
        if(points > pointsMax) pointsMax = points;
        reward = 1;
        game.RandomFruit();
        // make sure new fruit didn't spawn in snake tail 
        while((function () {
          for(var i=0; i<trail.length; i++) {
            if (trail[i].x == fruit.x && trail[i].y == fruit.y) {
              game.RandomFruit();
              return true;
            }
          }
          return false;
        })());
      }
      
      // Desenha a maçã
      const appleImg = new Image()
      appleImg.src = 'apple-whole-solid.svg'
      ctx.drawImage(appleImg, fruit.x * sizeCanvas+1, fruit.y * sizeCanvas+1, sizeCanvas-2, sizeCanvas-2)

      // LEMBRAR DE REMOVER ESSAS LINHAS
      ctx.fillStyle = 'yellow';
      ctx.font = "bold small-caps 16px Helvetica";
      ctx.fillText("points: " + points, 288, 40);
      ctx.fillText("top: " + pointsMax, 292, 60);
      //
      return reward;
    }
  }

  function keyPush (evt) {
    switch(evt.keyCode) {
      case 37: // left
        game.action.left()
        evt.preventDefault()
        break
      
      case 38: // up
        game.action.up()
        evt.preventDefault()
        break
      
      case 39: // right
        game.action.right()
        evt.preventDefault()
        break
      
      case 40: // down
        game.action.down()
        evt.preventDefault()
        break

      case 32: // SPACE
        if (isPaused) {
          Snake.restart()
          evt.preventDefault()
        } else {
          Snake.pause()
          evt.preventDefault()
        }
        break
      
      case 27: //esc
        game.reset()
        evt.preventDefault()
        break
    }
  }

  return {
    init: function () {
      window.onload = setup;
    },

    start: function (fps = 15) {
      window.onload = setup
      gameInterval = setInterval(game.loop, 1000 / fps)
    },

    pause: function () {
      clearInterval(gameInterval)
      isPaused = true
    },

    restart: function () {
      clearInterval(gameInterval)
      isPaused = false
    },

    loop: game.loop,

    reset: game.reset,

    setup: {
      wall: function (state) {
        walls = state;
      },
      tileCount: function (size) {
        tileCount = size;
        sizeCanvas = 350 / tileCount
      },
      fixedTail: function (state) {
        fixedTail = state;
      }
    },

    action: function (act) {
      switch(act) {
        case 'left':
          game.action.left();
          break;

        case 'up':
          game.action.up();
          break;

        case 'right':
          game.action.right();
          break;

        case 'down':
          game.action.down();
          break;
      }
    },

    clearTopScore: function () {
      pointsMax = 0;
    },

    data:  {
      player: player,
      fruit: fruit,
      trail: function () {
        return trail;
      }
    },

    info: {
      tileCount: tileCount
    }
  };

})();