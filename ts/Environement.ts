import { LevelState } from "./LevelState.js";
import { Cactus } from "./Cactus.js";
import { Obstacle } from "./Obstacle.js";
import { Bird } from "./Bird.js";
import { Cloud } from "./Cloud.js";

export class Environement{
    private positionSol:number = 0; // Position initiale du sol
    private canvas: HTMLCanvasElement = document.querySelector('#monCanvas') as HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    private spriteSheet: HTMLImageElement = new Image();
    private lvlState:LevelState;
    private groundSprite = {
        x: 0,
        y: 110,
        width: 2000,
        height: 24,
    };
    listObstacle: Obstacle[] = [];
    listCloud: Cloud[] = [];
    protected speed: number = 7;
    private borneMinSpawn: number = 3000; //miliseconde
    private borneMaxSpawn: number = 5000;
    private borneMinRange: number = 500;
    private birdRate: number = 0.0;
    private modeNuit: boolean = false;

    constructor(level: LevelState) {
        this.spriteSheet.src = './ressource/sprite.webp';
        this.lvlState = level
    }

    get lvl(): LevelState { 
        return this.lvlState;
    }

    set lvl(value: LevelState) {
        this.lvlState = value;
    } 
    
    get speedEnv(): number {
        return this.speed;
    }

    set speedEnv(value: number) {
        this.speed = value;
    }

    get borneMin(): number {
        return this.borneMinSpawn;
    }

    set borneMin(value: number) {
        this.borneMinSpawn = value;
    }

    get borneMax(): number {
        return this.borneMaxSpawn;
    }

    set borneMax(value: number) {
        this.borneMaxSpawn = value;
    }

    get borneMinR(): number {
        return this.borneMinRange;
    }

    set borneMinR(value: number) {
        this.borneMinRange = value;
    }

    get gbirdRate(): number {
        return this.birdRate;
    }

    set gbirdRate(value: number) {
        this.birdRate = value;
    }

    setModeNuit(active: boolean) {
        this.modeNuit = active;
        if (active) {
            this.canvas.style.filter = 'invert(100%)';
        } else {
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
           this. ctx.drawImage(
                this.spriteSheet,
                this.groundSprite.x,
                this.groundSprite.y,
                this.groundSprite.width,
                this.groundSprite.height,
                x,
                this.canvas.height - this.groundSprite.height,
                this.groundSprite.width,
                this.groundSprite.height
            );
        }
        this.listObstacle.forEach(obstacle => {
            obstacle.moveObstacle(this.speed);
            obstacle.display(0,0,0,0); 
        });

        this.listCloud.forEach(cloud => {
            cloud.moveObstacle(this.speed / 4); // on déplace les nuage moins vite pour donner l'impression de relief
            cloud.display();
        });

        this.removeObstacle();
    }

    private CreateCactus(decalage: number) {
        const newCactus = new Cactus(decalage);
        this.listObstacle.push(newCactus);
    }

    private removeObstacle() {
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
        if(this.birdRate > random) {
            setTimeout(() => {
                const newBird = new Bird();
                this.listObstacle.push(newBird);
                this.spawnObstacleLoop();
            }, spawnInterval);
        }else{
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
        if (Math.random() > 0.25){
            this.listCloud.push(new Cloud());
        }
        setTimeout(() => {
            this.spawnCloudLoop();
        }, 5000);
    }
    
};
