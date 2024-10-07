import { Cactus } from "./Cactus.js";
import { Bird } from "./Bird.js";
import { Cloud } from "./Cloud.js";
export class Environement {
    positionSol = 0; // Position initiale du sol
    canvas = document.querySelector('#monCanvas');
    ctx = this.canvas.getContext('2d');
    spriteSheet = new Image();
    lvlState;
    groundSprite = {
        x: 0,
        y: 110,
        width: 2000,
        height: 24,
    };
    listObstacle = [];
    listCloud = [];
    speed = 5;
    borneMinSpawn = 3000; //miliseconde
    borneMaxSpawn = 5000;
    borneMinRange = 500;
    birdRate = 0.0;
    modeNuit = false;
    constructor(level) {
        this.spriteSheet.src = './ressource/sprite.webp';
        this.lvlState = level;
    }
    get lvl() {
        return this.lvlState;
    }
    set lvl(value) {
        this.lvlState = value;
    }
    get speedEnv() {
        return this.speed;
    }
    set speedEnv(value) {
        this.speed = value;
    }
    get borneMin() {
        return this.borneMinSpawn;
    }
    set borneMin(value) {
        this.borneMinSpawn = value;
    }
    get borneMax() {
        return this.borneMaxSpawn;
    }
    set borneMax(value) {
        this.borneMaxSpawn = value;
    }
    get borneMinR() {
        return this.borneMinRange;
    }
    set borneMinR(value) {
        this.borneMinRange = value;
    }
    get gbirdRate() {
        return this.birdRate;
    }
    set gbirdRate(value) {
        this.birdRate = value;
    }
    setModeNuit(active) {
        this.modeNuit = active;
        if (active) {
            this.canvas.style.filter = 'invert(100%)';
        }
        else {
            this.canvas.style.filter = 'none';
        }
    }
    drawGround() {
        const totalWidth = this.canvas.width;
        //fait défiler le sol
        this.positionSol -= this.speed;
        if (this.positionSol <= -this.groundSprite.width) {
            // Réinitialise la position lorsque la tuile sort de l'écran
            this.positionSol += this.groundSprite.width;
        }
        for (let x = this.positionSol; x < totalWidth; x += this.groundSprite.width) {
            this.ctx.drawImage(this.spriteSheet, this.groundSprite.x, this.groundSprite.y, this.groundSprite.width, this.groundSprite.height, x, this.canvas.height - this.groundSprite.height, this.groundSprite.width, this.groundSprite.height);
        }
        this.listObstacle.forEach(obstacle => {
            obstacle.moveObstacle(this.speed);
            obstacle.display(0, 0, 0, 0);
        });
        this.listCloud.forEach(cloud => {
            cloud.moveObstacle(this.speed / 4); // on déplace les nuage moins vite pour donner l'impression de relief
            cloud.display();
        });
        this.removeObstacle();
    }
    CreateCactus(decalage) {
        const newCactus = new Cactus(decalage);
        this.listObstacle.push(newCactus);
    }
    removeObstacle() {
        this.listObstacle.forEach((obstacle, index) => {
            if (obstacle.isOffScreen()) {
                this.listObstacle.splice(index, 1);
            }
        });
    }
    spawnObstacleLoop() {
        let spawnInterval = Math.floor(Math.random() * (this.borneMaxSpawn - this.borneMinSpawn + 1) + this.borneMinSpawn);
        //on s'assure que deux obstacle soit pas trop proche
        if (spawnInterval * this.speed < this.borneMinRange) {
            spawnInterval = this.borneMinRange / this.speed;
        }
        let random = Math.random();
        if (this.birdRate > random) {
            setTimeout(() => {
                const newBird = new Bird();
                this.listObstacle.push(newBird);
                this.spawnObstacleLoop();
            }, spawnInterval);
        }
        else {
            setTimeout(() => {
                let nbCactusSpawn = Math.floor(Math.random() * 3 + 1);
                let decalage = 0;
                for (let i = 0; i < nbCactusSpawn; i++) {
                    this.CreateCactus(decalage);
                    decalage += 1;
                }
                this.spawnObstacleLoop();
            }, spawnInterval);
        }
    }
    spawnCloudLoop() {
        //une chance sur quatre de faire spawn les nuage
        if (Math.random() > 0.25) {
            this.listCloud.push(new Cloud());
        }
        setTimeout(() => {
            this.spawnCloudLoop();
        }, 5000);
    }
}
;
