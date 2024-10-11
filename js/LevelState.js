export class LevelState {
    environement = null;
    player = null;
    constructor() { }
}
export class Level1 extends LevelState {
    constructor() {
        super();
    }
    //permet d'avoir un constructeur vide pour les level
    //mais on doit quand même initialiser les attributs
    init(environment, player) {
        this.environement = environment;
        this.player = player;
    }
    changeLevel() {
        if (this.player.scoreDino > 100) {
            this.player.levelDino = 2;
            this.environement.speedEnv = 8;
            this.environement.borneMin = 2000;
            this.environement.borneMax = 4000;
            this.environement.borneMinR = 300;
            let state = new Level2(this.environement, this.player);
            this.environement.lvl = state;
            this.player.levelStateDino = state;
            this.player.levelDino = 2;
        }
    }
    addPoint() {
        this.player.scoreDino += 1;
        this.changeLevel();
    }
}
export class Level2 extends LevelState {
    constructor(env, dino) {
        super();
        this.player = dino;
        this.environement = env;
    }
    changeLevel() {
        if (this.player.scoreDino > 500) {
            this.player.levelDino += 3;
            this.environement.speedEnv = 11;
            this.environement.borneMin = 1000;
            this.environement.borneMax = 3000;
            this.environement.borneMinR = 150;
            this.environement.gbirdRate = 0.7;
            let state = new Level3(this.environement, this.player);
            this.environement.lvl = state;
            this.player.levelStateDino = state;
            this.player.levelDino = 3;
        }
    }
    addPoint() {
        this.player.scoreDino += 2;
        this.changeLevel();
    }
}
export class Level3 extends LevelState {
    constructor(env, dino) {
        super();
        this.player = dino;
        this.environement = env;
    }
    changeLevel() {
        if (this.player.scoreDino > 1000) {
            this.player.levelDino += 6;
            this.environement.speedEnv = 13;
            this.environement.borneMin = 600;
            this.environement.borneMax = 1500;
            this.environement.borneMinR = 100;
            this.environement.gbirdRate = 0.6;
            let state = new Level4(this.environement, this.player);
            this.environement.lvl = state;
            this.player.levelStateDino = state;
            this.player.levelDino = 4;
        }
    }
    addPoint() {
        this.player.scoreDino += 3;
        this.changeLevel();
    }
}
export class Level4 extends LevelState {
    constructor(env, dino) {
        super();
        this.player = dino;
        this.environement = env;
    }
    changeLevel() { }
    addPoint() {
        this.player.scoreDino += 5;
        if (this.player.scoreDino % 1000 < 350)
            this.environement.setModeNuit(true);
        else {
            this.environement.setModeNuit(false);
        }
    }
}
