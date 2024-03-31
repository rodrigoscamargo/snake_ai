Snake.init();
Snake.setup.wall(false);
Snake.setup.fixedTail();

const defaultFPS = 8;
QLearning.run();
QLearning.changeSpeed(4);
QLearning.changeFPS(defaultFPS);

var btnTrain = document.getElementById('btnTrain');
btnTrain.addEventListener('click', speedFaster);

document.addEventListener("keydown", isKeyEsc);
function isKeyEsc(event) {
    if(event.keyCode == 27) resetSnake()
}

var infoScore = document.getElementById('score');
var infoMissed = document.getElementById('missed');

var rangerLR = document.getElementById('lr');
var rangerDF = document.getElementById('df');
var rangerRandom = document.getElementById('ar');
var checkboxFullSet = document.getElementById('fullSet');

setInterval(loop, 100);

function loop () {
    infoScore.innerHTML = 'scored: <b>' + QLearning.info.score() + (QLearning.info.score() == 1 ? ' point' : ' points') + '</b>';
    infoMissed.innerHTML = 'died: <b>' + Math.abs(QLearning.info.missed()) + (Math.abs(QLearning.info.missed()) == 1 ? ' time' : ' times') + '</b>';

    QLearning.changeConst.LearningRate(0.01*rangerLR.value);
    QLearning.changeConst.DiscountFactor(0.01*rangerDF.value);
    QLearning.changeConst.Randomization(0.01*rangerRandom.value);
    QLearning.changeConst.FullSetOfStates(checkboxFullSet.checked);
}

async function resetSnake () {
    QLearning.stop();
    QLearning.reset();
    Snake.reset();
    Snake.clearTopScore();
    await speedSlower();
}

async function speedFaster () {
    modifyingThreads = true;

    rangerLR.disabled = true;
    rangerDF.disabled = true;
    rangerRandom.disabled = true;
    checkboxFullSet.disabled = true;

    QLearning.stop();
    QLearning.startTrain();
    btnTrain.innerHTML = 'TREINANDO...';
    btnTrain.removeEventListener('click', speedFaster);
    btnTrain.addEventListener('click', speedSlower);
    modifyingThreads = false;
}

async function speedSlower () {
    modifyingThreads = true;
    QLearning.stopTrain();
    QLearning.changeFPS(defaultFPS);

    rangerLR.disabled = false;
    rangerDF.disabled = false;
    rangerRandom.disabled = false;
    checkboxFullSet.disabled = false;
    btnTrain.innerHTML = 'TREINAR';

    btnTrain.removeEventListener('click', speedSlower);
    btnTrain.addEventListener('click', speedFaster);
    modifyingThreads = false;
}