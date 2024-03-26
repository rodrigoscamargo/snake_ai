interface Player {
    x: number;
    y: number;
}

interface Fruit {
    x: number;
    y: number;
}

interface Trail {
    x: number;
    y: number;
}

enum ActionEnum {
    none = 0,
    up = 1,
    down = 2,
    left = 3,
    right = 4,
}

const Snake = (() => {
    const INITIAL_TAIL = 4;
    let fixedTail = true;
    let intervalID: number;
    let tileCount = 10;
    let gridSize = 400 / tileCount;
    const INITIAL_PLAYER: Player = {
        x: Math.floor(tileCount / 2),
        y: Math.floor(tileCount / 2),
    };
    let velocity = { x: 0, y: 0 };
    let player: Player = { x: INITIAL_PLAYER.x, y: INITIAL_PLAYER.y };
    let walls = false;
    let fruit: Fruit = { x: 1, y: 1 };
    let trail: Trail[] = [];
    let tail = INITIAL_TAIL;
    let reward = 0;
    let points = 0;
    let pointsMax = 0;

    const setup = () => {
        const canv = document.getElementById("gc") as HTMLCanvasElement;
        const ctx = canv.getContext("2d");
        game.reset();
    };

    const game = {
        reset: () => {
            const canv = document.getElementById("gc") as HTMLCanvasElement;
            const ctx = canv.getContext("2d");
            ctx.fillStyle = "grey";
            ctx.fillRect(0, 0, canv.width, canv.height);
            tail = INITIAL_TAIL;
            points = 0;
            velocity.x = 0;
            velocity.y = 0;
            player.x = INITIAL_PLAYER.x;
            player.y = INITIAL_PLAYER.y;
            reward = -1;
            trail = [];
            trail.push({ x: player.x, y: player.y });
        },
        action: {
            up: () => {
                if (lastAction != ActionEnum.down) {
                    velocity.x = 0;
                    velocity.y = -1;
                }
            },
            down: () => {
                if (lastAction != ActionEnum.up) {
                    velocity.x = 0;
                    velocity.y = 1;
                }
            },
            left: () => {
                if (lastAction != ActionEnum.right) {
                    velocity.x = -1;
                    velocity.y = 0;
                }
            },
            right: () => {
                if (lastAction != ActionEnum.left) {
                    velocity.x = 1;
                    velocity.y = 0;
                }
            },
        },
        RandomFruit: () => {
            if (walls) {
                fruit.x = 1 + Math.floor(Math.random() * (tileCount - 2));
                fruit.y = 1 + Math.floor(Math.random() * (tileCount - 2));
            } else {
                fruit.x = Math.floor(Math.random() * tileCount);
                fruit.y = Math.floor(Math.random() * tileCount);
            }
        },
        log: () => {
            console.log("====================");
            console.log("x:" + player.x + ", y:" + player.y);
            console.log("tail:" + tail + ", trail.length:" + trail.length);
        },
        loop: () => {
            reward = -0.1;

            const DontHitWall = () => {
                if (player.x < 0) player.x = tileCount - 1;
                if (player.x >= tileCount) player.x = 0;
                if (player.y < 0) player.y = tileCount - 1;
                if (player.y >= tileCount) player.y = 0;
            };

            const HitWall = () => {
                const canv = document.getElementById("gc") as HTMLCanvasElement;
                const ctx = canv.getContext("2d");
                if (player.x < 1) game.reset();
                if (player.x > tileCount - 2) game.reset();
                if (player.y < 1) game.reset();
                if (player.y > tileCount - 2) game.reset();
                ctx.fillStyle = "grey";
                ctx.fillRect(0, 0, gridSize - 1, canv.height);
                ctx.fillRect(0, 0, canv.width, gridSize - 1);
                ctx.fillRect(canv.width - gridSize + 1, 0, gridSize, canv.height);
                ctx.fillRect(0, canv.height - gridSize + 1, canv.width, gridSize);
            };

            const stopped = velocity.x == 0 && velocity.y == 0;
            player.x += velocity.x;
            player.y += velocity.y;
            if (velocity.x == 0 && velocity.y == -1) lastAction = ActionEnum.up;
            if (velocity.x == 0 && velocity.y == 1) lastAction = ActionEnum.down;
            if (velocity.x == -1 && velocity.y == 0) lastAction = ActionEnum.left;
            if (velocity.x == 1 && velocity.y == 0) lastAction = ActionEnum.right;
            const canv = document.getElementById("gc") as HTMLCanvasElement;
            const ctx = canv.getContext("2d");
            ctx.fillStyle = "rgba(40,40,40,0.8)";
            ctx.fillRect(0, 0, canv.width, canv.height);
            if (walls) HitWall();
            else DontHitWall();
            if (!stopped) {
                trail.push({ x: player.x, y: player.y });
                while (trail.length > tail) trail.shift();
            }
            if (!stopped) {
                ctx.fillStyle = "rgba(200,200,200,0.2)";
                ctx.font = "small-caps 14px Helvetica";
                ctx.fillText("(esc) reset", 24, 356);
                ctx.fillText("(space) pause", 24, 374);
            }
            ctx.fillStyle = "green";
            for (let i = 0; i < trail.length - 1; i++) {
                ctx.fillRect(
                    trail[i].x * gridSize + 1,
                    trail[i].y * gridSize + 1,
                    gridSize - 2,
                    gridSize - 2
                );
                if (!stopped && trail[i].x == player.x && trail[i].y == player.y) {
                    game.reset();
                }
                ctx.fillStyle = "lime";
            }
            ctx.fillRect(
                trail[trail.length - 1].x * gridSize + 1,
                trail[trail.length - 1].y * gridSize + 1,
                gridSize - 2,
                gridSize - 2
            );
            if (player.x == fruit.x && player.y == fruit.y) {
                if (!fixedTail) tail++;
                points++;
                if (points > pointsMax) pointsMax = points;
                reward = 1;
                game.RandomFruit();
                while (
                    (() => {
                        for (let i = 0; i < trail.length; i++) {
                            if (trail[i].x == fruit.x && trail[i].y == fruit.y) {
                                game.RandomFruit();
                                return true;
                            }
                        }
                        return false;
                    })()
                );
            }
            ctx.fillStyle = "red";
            ctx.fillRect(
                fruit.x * gridSize + 1,
                fruit.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2
            );
            if (stopped) {
                ctx.fillStyle = "rgba(250,250,250,0.8)";
                ctx.font = "small-caps bold 14px Helvetica";
                ctx.fillText("press ARROW KEYS to START...", 24, 374);
            }
            ctx.fillStyle = "white";
            ctx.font = "bold small-caps 16px Helvetica";
            ctx.fillText("points: " + points, 288, 40);
            ctx.fillText("top: " + pointsMax, 292, 60);
            return reward;
        },
    };

    const keyPush = (evt: KeyboardEvent) => {
        switch (evt.keyCode) {
            case 37: //left
                game.action.left();
                evt.preventDefault();
                break;
            case 38: //up
                game.action.up();
                evt.preventDefault();
                break;
            case 39: //right
                game.action.right();
                evt.preventDefault();
                break;
            case 40: //down
                game.action.down();
                evt.preventDefault();
                break;
            case 32: //space
                Snake.pause();
                evt.preventDefault();
                break;
            case 27: //esc
                game.reset();
                evt.preventDefault();
                break;
        }
    };

    let lastAction = ActionEnum.none;

    return {
        init: () => {
            window.onload = setup;
        },
        start: (fps: number = 15) => {
            window.onload = setup;
            intervalID = setInterval(game.loop, 1000 / fps);
        },
        loop: game.loop,
        reset: game.reset,
        stop: () => {
            clearInterval(intervalID);
        },
        setup: {
            keyboard: (state: boolean) => {
                if (state) {
                    document.addEventListener("keydown", keyPush);
                } else {
                    document.removeEventListener("keydown", keyPush);
                }
            },
            wall: (state: boolean) => {
                walls = state;
            },
            tileCount: (size: number) => {
                tileCount = size;
                gridSize = 400 / tileCount;
            },
            fixedTail: (state: boolean) => {
                fixedTail = state;
            },
        },
        action: (act: string) => {
            switch (act) {
                case "left":
                    game.action.left();
                    break;
                case "up":
                    game.action.up();
                    break;
                case "right":
                    game.action.right();
                    break;
                case "down":
                    game.action.down();
                    break;
            }
        },
        pause: () => {
            velocity.x = 0;
            velocity.y = 0;
        },
        clearTopScore: () => {
            pointsMax = 0;
        },
        data: {
            player: player,
            fruit: fruit,
            trail: () => {
                return trail;
            },
        },
        info: {
            tileCount: tileCount,
        },
    };
})();
