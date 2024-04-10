let Snake = (function () {
  let sizeInitialSnake = 1 // Tamanho inicial da cobra
  let isPaused // Indica se o jogo está pausado
  let fixedTail = true // Indica se a cauda da cobra é fixa
  let gameInterval // Intervalo do jogo
  let tileCount = 10 // Número de "tiles" no campo de jogo
  let sizeCanvas = 350 / tileCount // Tamanho do canvas baseado no número de "tiles"

  const INITIAL_PLAYER = { // Posição inicial da cobra
    x: Math.floor(tileCount / 2), 
    y: Math.floor(tileCount / 2) 
  }
  
  let velocity = { x: 0, y: 0 } // Velocidade inicial da cobra
  let player = { x: INITIAL_PLAYER.x, y: INITIAL_PLAYER.y } // Posição atual da cobra

  let walls = false // Indica se há paredes nas bordas do jogo
  let wallsInside = [ // Define as posições das paredes dentro do jogo
    { x: 5, y: 9 },
    { x: 4, y: 9 },
    { x: 10, y: 4 },
    { x: 10, y: 5 }
  ]

  let fruit = { x: 1, y: 1 } // Posição inicial da maça
  let trail = [] // Rastro da cobra
  let tail = sizeInitialSnake // Tamanho inicial da cauda

  let reward = 0 // Recompensa
  let points = 0 // Pontos
  let pointsMax = 0 // Pontuação máxima
  
  const setup = () => { // Função de configuração do jogo
    canv = document.getElementById('gc') // Obtem o canvas
    ctx = canv.getContext('2d') // Obtem o contexto 2D do canvas
    isPaused = false // Inicializa como não pausado
    document.addEventListener('keydown', keyPush) // Adiciona ouvinte de evento para teclas pressionadas
    game.reset() // Reseta o estado do jogo
  }

  let game = { // Objeto com métodos relacionados ao jogo
    reset: function () { // Método para resetar o jogo
      ctx.fillStyle = 'black' // Preenche o canvas com preto
      ctx.fillRect(0, 0, canv.width, canv.height) // Preenche o retângulo do canvas

      tail = sizeInitialSnake // Reseta o tamanho da cauda
      points = 0 // Reseta os pontos
      velocity.x = 0 // Reseta a velocidade em x
      velocity.y = 0 // Reseta a velocidade em y
      player.x = INITIAL_PLAYER.x // Define a posição x da cobra
      player.y = INITIAL_PLAYER.y // Define a posição y da cobra
      reward = -1 // Define a recompensa como -1

      trail = [] // Limpa o rastro da cobra
      trail.push({ x: player.x, y: player.y }) // Adiciona a posição inicial da cobra ao rastro
      isPaused = false // Define como não pausado
    },

    action: { // Métodos para as ações da cobra
      up: function () { // Mover para cima
        velocity.x = 0
        velocity.y = -1
      },
      down: function () { // Mover para baixo
        velocity.x = 0
        velocity.y = 1
      },
      left: function () { // Mover para esquerda
        velocity.x = -1
        velocity.y = 0
      },
      right: function () { // Mover para direita
        velocity.x = 1
        velocity.y = 0
      }
    },

    // [APAGAR] DEVE CONSIDERAR AS POSIÇÕES DAS PAREDES.
    RandomFruit: function () { // Método para gerar uma nova posição para a maça
      if(walls){ // Se houver paredes
        // Gera posição aleatória dentro dos limites, mas não nas bordas
        fruit.x = 1+Math.floor(Math.random() * (tileCount-2))
        fruit.y = 1+Math.floor(Math.random() * (tileCount-2))
      }
      else {
        // Gera posição aleatória dentro dos limites
        fruit.x = Math.floor(Math.random() * tileCount)
        fruit.y = Math.floor(Math.random() * tileCount)
      }
    },

    loop: function () { // Loop principal do jogo
      if (isPaused) {
        return // Se estiver pausado, não executa o jogo
      }

      reward = -0.1 // Define recompensa padrão

      function DontHitWall () { // Função para verificar se a cobra não atingiu a parede das bordas
        if(player.x < 0) player.x = tileCount-1
        if(player.x >= tileCount) player.x = 0
        if(player.y < 0) player.y = tileCount-1
        if(player.y >= tileCount) player.y = 0
      }

      function HitWall () { // Função para verificar se a cobra atingiu a parede
        // Se a cobra atingiu uma parede, resetar o jogo
        if (wallsFour.some(wall => wall.x === player.x && wall.y === player.y)) {
          game.reset()
        }

        // Desenha as paredes
        ctx.fillStyle = 'blue'
        wallsFour.forEach(wall => {
          ctx.fillRect(wall.x * sizeCanvas, wall.y * sizeCanvas, sizeCanvas, sizeCanvas)
        })
      }

      let stopped = velocity.x == 0 && velocity.y == 0 // Verifica se a cobra está parada
      
      player.x += velocity.x // Atualizar a posição x da cobra
      player.y += velocity.y // Atualizar a posição y da cobra
      
      // Desenha o fundo do canvas
      ctx.fillStyle = 'black'
      ctx.fillRect(0,0,canv.width,canv.height)
      
      // Verifica colisão com as paredes
      if(walls) HitWall()
      else DontHitWall()

      // Desenha as paredes dentro do jogo
      // ctx.fillStyle = "gray"
      const wallImg = new Image()
      wallImg.src = 'icons8-brick-wall-50.svg'
      for (let element of wallsInside) {
        ctx.drawImage(wallImg, element.x * sizeCanvas+1, element.y * sizeCanvas+1, sizeCanvas-2, sizeCanvas-2)
      }
      
      if (!stopped){
        // Adiciona um novo segmento ao rastro da cobra, correspondente à sua posição atual
        trail.push({x:player.x, y:player.y})
        // Enquanto o comprimento do rastro for maior que o tamanho da cauda da cobra, remove segmentos do rastro
        while(trail.length > tail) trail.shift()
      }
      
      // Desenha o rastro da cobra
      ctx.fillStyle = 'green'
      for(let i=0; i<trail.length-1; i++) {
        ctx.fillRect(trail[i].x * sizeCanvas+1, trail[i].y * sizeCanvas+1, sizeCanvas-2, sizeCanvas-2)

        // Verifica se a cobra colidiu com seu próprio rastro
        if (!stopped && trail[i].x == player.x && trail[i].y == player.y){
          game.reset()
        }
        ctx.fillStyle = 'lime'
      }
      ctx.fillRect(trail[trail.length-1].x * sizeCanvas+1, trail[trail.length-1].y * sizeCanvas+1, sizeCanvas-2, sizeCanvas-2)
      
      if (player.x == fruit.x && player.y == fruit.y) { // Verifica se a cobra comeu a maça
        if(!fixedTail) tail++ // Aumenta o tamanho da cauda se a cauda não for fixa
        points++ // Aumenta os pontos
        if(points > pointsMax) pointsMax = points // Atualiza a pontuação máxima
        reward = 1 // Defini a recompensa como 1
        game.RandomFruit() // Gera uma nova posição para a maça
        // Certificar-se de que a nova fruta não apareceu na cauda da cobra
        while (trail.some(seg => seg.x == fruit.x && seg.y == fruit.y)) {
          game.RandomFruit(); // Gera uma nova posição para a fruta
        }
      }
      
      // Desenha a maçã
      const appleImg = new Image()
      appleImg.src = 'apple-whole-solid.svg'
      ctx.drawImage(appleImg, fruit.x * sizeCanvas+1, fruit.y * sizeCanvas+1, sizeCanvas-2, sizeCanvas-2)

      // Exibe informações na tela
      ctx.fillStyle = 'yellow'
      ctx.font = "bold small-caps 16px Helvetica"
      ctx.fillText("points: " + points, 400, 20) // Exibe os pontos
      ctx.fillText("top: " + pointsMax, 425, 40) // Exibe a pontuação máxima

      return reward // Retorna a recompensa
    }
  }

  function keyPush (evt) { // Função para controlar as teclas pressionadas
    switch(evt.keyCode) {
      case 37: // Seta para a esquerda
        game.action.left()
        evt.preventDefault()
        break
      case 38: // Seta para cima
        game.action.up()
        evt.preventDefault()
        break
      case 39: // Seta para a direita
        game.action.right()
        evt.preventDefault()
        break
      case 40: // Seta para baixo
        game.action.down()
        evt.preventDefault()
        break
      case 32: // Barra de espaço
        if (isPaused) {
          Snake.restart()
          evt.preventDefault()
        } else {
          Snake.pause()
          evt.preventDefault()
        }
        break
      case 27: // Tecla Esc
        game.reset()
        evt.preventDefault()
        break
    }
  }

  // Retornar um objeto com métodos e propriedades para interagir com o jogo
  return {
    init: function () { // Método para inicializar o jogo
      window.onload = setup // Quando a janela é carregada, executar a função de configuração do jogo
    },

    start: function (fps = 15) { // Método para iniciar o jogo com uma determinada frequência (fps) de atualização
      window.onload = setup // Quando a janela é carregada, executar a função de configuração do jogo
      gameInterval = setInterval(game.loop, 1000 / fps) // Inicia o loop do jogo com a frequência especificada
    },

    pause: function () { // Método para pausar o jogo
      clearInterval(gameInterval) // Limpa o intervalo do jogo
      isPaused = true // Definir como pausado
    },

    restart: function () { // Método para reiniciar o jogo
      clearInterval(gameInterval) // Limpa o intervalo do jogo
      isPaused = false // Define como não pausado
    },

    loop: game.loop, // Define a função de loop do jogo

    reset: game.reset, // Define a função de reset do jogo

    setup: { // Método para definir configurações do jogo
      wall: function (state) { // Método para ativar/desativar paredes das bordas
        walls = state
      },
      tileCount: function (size) { // Método para definir o número de "tiles" no campo de jogo
        tileCount = size // Define o tamanho do campo de jogo
        sizeCanvas = 350 / tileCount // Atualiza o tamanho do canvas
      },
      fixedTail: function (state) { // Método para definir se a cauda da cobra é fixa
        fixedTail = state
      }
    },

    action: function (act) { // Método para ativar ações da cobra
      switch(act) {
        case 'left':
          game.action.left()
          break

        case 'up':
          game.action.up()
          break

        case 'right':
          game.action.right()
          break

        case 'down':
          game.action.down()
          break
      }
    },

    clearTopScore: function () { // Método para limpar a pontuação máxima
      pointsMax = 0
    },

    data: { // Método para retornar dados do jogo
      player: player, // Retorna a posição da maça
      fruit: fruit,
      trail: function () {
        return trail // Retorna o rastro da cobra
      }
    },

    info: { // Método para retornar informações sobre o jogo
      tileCount: tileCount // Retorna o número de "tiles" no campo de jogo
    }
  }
})();