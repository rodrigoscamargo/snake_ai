namespace UserInterface {
    Snake.init();
    Snake.setup.keyboard(false);
    Snake.setup.wall(false);
    Snake.setup.fixedTail(false);
    const defaultFPS: number = 8;
    QLearning.run();
    QLearning.changeSpeed(4);
    QLearning.changeFPS(defaultFPS);
    /// EASTER EGG ///
    document.addEventListener('keyup', KonamiCode);
    const konamiOrder: number[] = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex: number = 0;
    function KonamiCode(evt: KeyboardEvent): void {
        if (konamiOrder[konamiIndex] == evt.keyCode) {
            konamiIndex++
        }
        else {
            konamiIndex = 0;
        }
        if (konamiIndex == konamiOrder.length) {
            document.removeEventListener('keyup', KonamiCode);
            QLearning.stop();
            Snake.setup.keyboard(true);
            Snake.setup.tileCount(20);
            Snake.setup.fixedTail(false);
            Snake.reset();
            Snake.start();
        }
    }
    ///
    const btnTrain: HTMLElement = document.getElementById('btnTrain')!;
    const btnReset: HTMLElement = document.getElementById('btnReset')!;
    btnTrain.addEventListener('click', speedFaster);
    btnReset.addEventListener('click', resetSnake);
    const infoScore: HTMLElement = document.getElementById('score')!;
    const infoMissed: HTMLElement = document.getElementById('missed')!;
    const rangerLR: HTMLInputElement = <HTMLInputElement>document.getElementById('rangeLR');
    const rangerDF: HTMLInputElement = <HTMLInputElement>document.getElementById('rangeDF');
    const rangerRandom: HTMLInputElement = <HTMLInputElement>document.getElementById('rangeRandom');
    const checkboxFullSet: HTMLInputElement = <HTMLInputElement>document.getElementById('fullSet');
    setInterval(loop, 100);
    function loop(): void {
        infoScore.innerHTML = 'scored: <b>' + QLearning.info.score() + (QLearning.info.score() == 1 ? ' point' : ' points') + '</b>';
        infoMissed.innerHTML = 'died: <b>' + Math.abs(QLearning.info.missed()) + (Math.abs(QLearning.info.missed()) == 1 ? ' time' : ' times') + '</b>';
        QLearning.changeConst.LearningRate(0.01 * Number(rangerLR.value));
        QLearning.changeConst.DiscountFactor(0.01 * Number(rangerDF.value));
        QLearning.changeConst.Randomization(0.01 * Number(rangerRandom.value));
        QLearning.changeConst.FullSetOfStates(checkboxFullSet.checked);
    }
    async function resetSnake(): Promise<void> {
        // await speedSlower();
        // Snake.reset();
        QLearning.stop();
        QLearning.reset();
        Snake.reset();
        Snake.clearTopScore();
        await speedSlower();
    }
    async function speedFaster(): Promise<void> {
        let modifyingThreads: boolean = true;
        rangerLR.disabled = true;
        rangerDF.disabled = true;
        rangerRandom.disabled = true;
        checkboxFullSet.disabled = true;
        QLearning.stop();
        QLearning.startTrain();
        btnTrain.innerHTML = '&vert; &vert; TRAIN';
        btnTrain.removeEventListener('click', speedFaster);
        btnTrain.addEventListener('click', speedSlower);
        modifyingThreads = false;
    }
    async function speedSlower(): Promise<void> {
        let modifyingThreads: boolean = true;
        QLearning.stopTrain();
        QLearning.changeFPS(defaultFPS);
        rangerLR.disabled = false;
        rangerDF.disabled = false;
        rangerRandom.disabled = false;
        checkboxFullSet.disabled = false;
        btnTrain.innerHTML = '&#9654; TRAIN';
        btnTrain.removeEventListener('click', speedSlower);
        btnTrain.addEventListener('click', speedFaster);
        modifyingThreads = false;
    }
}


