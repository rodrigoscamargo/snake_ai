interface FruitPose {
  x: number;
  y: number;
}

interface TrailPose {
  x: number;
  y: number;
}

interface QTable {
  up: number;
  down: number;
  left: number;
  right: number;
}

interface QLearning {
  run(): void;
  stop(): void;
  startTrain(loopsPerInterval?: number): void;
  stopTrain(): void;
  reset(): void;
  changeConst: {
    LearningRate(lr: number): void;
    DiscountFactor(df: number): void;
    Randomization(rand: number): void;
    FullSetOfStates(fullSet: boolean): void;
  };
  changeFPS(fps: number): void;
  changeSpeed(ms: number): void;
  info: {
    score(): number;
    missed(): number;
  };
  qTable: {
    show(): void;
    export(): QTable;
    import(newQ: QTable): void;
  };
}

const QLearning: QLearning = (function () {
  const qTable: { [state: string]: QTable } = {};
  let learningRate: number = 0.85;
  let discountFactor: number = 0.9;
  let randomize: number = 0.05;
  const availableActions: string[] = ["up", "down", "left", "right"];
  let score: number = 0;
  let missed: number = 0;
  let intervalID: number;
  const defaultLoopsPerInterval: number = 1200;
  let fullSetOfStates: boolean = false;

  const whichStateNow = function (): string {
    const tileCount: number = Snake.info.tileCount;
    const player: any = Snake.data.player;
    const fruit: FruitPose = Snake.data.fruit;
    const fruitRelativePose: FruitPose = { x: 0, y: 0 };
    const trail: TrailPose[] = Snake.data.trail();
    const trailRelativePose: TrailPose[] = [];
    fruitRelativePose.x = fruit.x - player.x;
    while (fruitRelativePose.x < 0) fruitRelativePose.x += tileCount;
    while (fruitRelativePose.x > tileCount) fruitRelativePose.x -= tileCount;
    fruitRelativePose.y = fruit.y - player.y;
    while (fruitRelativePose.y < 0) fruitRelativePose.y += tileCount;
    while (fruitRelativePose.y > tileCount) fruitRelativePose.y -= tileCount;
    let stateName: string = fruitRelativePose.x + "," + fruitRelativePose.y;
    const maxLength: number = fullSetOfStates ? trail.length : 1;
    for (let index = 0; index < maxLength; index++) {
      if (!trailRelativePose[index]) trailRelativePose.push({ x: 0, y: 0 });
      trailRelativePose[index].x = trail[index].x - player.x;
      while (trailRelativePose[index].x < 0)
        trailRelativePose[index].x += tileCount;
      while (trailRelativePose[index].x > tileCount)
        trailRelativePose[index].x -= tileCount;
      trailRelativePose[index].y = trail[index].y - player.y;
      while (trailRelativePose[index].y < 0)
        trailRelativePose[index].y += tileCount;
      while (trailRelativePose[index].y > tileCount)
        trailRelativePose[index].y -= tileCount;
      stateName +=
        "," + trailRelativePose[index].x + "," + trailRelativePose[index].y;
    }
    return stateName;
  };

  const whichTable = function (s: string): QTable {
    if (!qTable[s]) {
      qTable[s] = { up: 0, down: 0, left: 0, right: 0 };
    }
    return qTable[s];
  };

  const bestAction = function (s: string): string {
    const q: QTable = whichTable(s);
    if (Math.random() < randomize) {
      const random: number = Math.floor(
        Math.random() * availableActions.length
      );
      return availableActions[random];
    }
    let maxValue: number = q[availableActions[0]];
    let choseAction: string = availableActions[0];
    const actionsZero: string[] = [];
    for (let i = 0; i < availableActions.length; i++) {
      if (q[availableActions[i]] === 0) actionsZero.push(availableActions[i]);
      if (q[availableActions[i]] > maxValue) {
        maxValue = q[availableActions[i]];
        choseAction = availableActions[i];
      }
    }
    if (maxValue === 0) {
      const random: number = Math.floor(Math.random() * actionsZero.length);
      choseAction = actionsZero[random];
    }
    return choseAction;
  };

  const updateQTable = function (
    state0: string,
    state1: string,
    reward: number,
    act: string
  ): void {
    const q0: QTable = whichTable(state0);
    const q1: QTable = whichTable(state1);
    const newValue: number =
      reward +
      discountFactor * Math.max(q1.up, q1.down, q1.left, q1.right) -
      q0[act];
    qTable[state0][act] = q0[act] + learningRate * newValue;
  };

  function Algorithm(): void {
    const currentState: string = whichStateNow();
    const action: string = bestAction(currentState);
    Snake.action(action);
    const instantReward: number = Snake.loop();
    const nextState: string = whichStateNow();
    updateQTable(currentState, nextState, instantReward, action);
    if (instantReward > 0) score += Math.trunc(instantReward);
    if (instantReward < 0) missed += Math.trunc(instantReward);
  }

  return {
    run: function (): void {
      clearInterval(intervalID);
      intervalID = setInterval(Algorithm, 1000 / 15);
    },
    stop: function (): void {
      clearInterval(intervalID);
    },
    startTrain: function (loopsPerInterval?: number): void {
      clearInterval(intervalID);
      const loops: number = loopsPerInterval
        ? loopsPerInterval
        : defaultLoopsPerInterval;
      intervalID = setInterval(() => {
        for (let index = 0; index < loops; index++) {
          Algorithm();
        }
      }, 1000 / 15);
    },
    stopTrain: function (): void {
      clearInterval(intervalID);
    },
    reset: function (): void {
      qTable = {};
      score = 0;
      missed = 0;
    },
    changeConst: {
      LearningRate: function (lr: number): void {
        learningRate = lr;
      },
      DiscountFactor: function (df: number): void {
        discountFactor = df;
      },
      Randomization: function (rand: number): void {
        randomize = rand;
      },
      FullSetOfStates: function (fullSet: boolean): void {
        fullSetOfStates = fullSet;
      },
    },
    changeFPS: function (fps: number): void {
      clearInterval(intervalID);
      intervalID = setInterval(Algorithm, 1000 / fps);
    },
    changeSpeed: function (ms: number): void {
      clearInterval(intervalID);
      intervalID = setInterval(Algorithm, ms);
    },
    info: {
      score: function (): number {
        return score;
      },
      missed: function (): number {
        return missed;
      },
    },
    qTable: {
      show: function (): void {
        console.table(qTable);
      },
      export: function (): QTable {
        return qTable;
      },
      import: function (newQ: QTable): void {
        qTable = newQ;
      },
    },
  };
})();
