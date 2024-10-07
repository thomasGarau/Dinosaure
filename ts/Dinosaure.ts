import { State, StateJump, StateDown, StateRun } from "./State.js";
import { LevelState } from "./LevelState.js";
import { Obstacle } from "./Obstacle.js";

export class Dinosaure {
    private scoreHtml = document.querySelector('#score') as HTMLElement;
    private x:number = 40;
    private y:number = 250;
    private hitboxes: {x: number, y: number, width: number, height: number}[] = [];
    private etats: State[] = [
        new StateJump(this),
        new StateRun(this),
        new StateDown(this)
    ];
    private etat: State = this.etats[1];
    private levelState: LevelState;
    private score: number = 0;
    private level: number = 1;
    private dernierPalierAffiche: number = 0;

    constructor(levelState: LevelState) { 
        this.levelState = levelState;  
        this.initialiseHitbox();
    }

    get positionX(): number {
        return this.x;
    }

    set positionX(value: number) {
        this.x = value;
    }
    
    set positionY(value: number) {
        this.y = value;
    }
    
    get positionY(): number {
        return this.y;
    }

    get hitbox(): {x: number, y: number, width: number, height: number}[] {
        return this.hitboxes;
    }

    get etatCourant(): number {
        return this.etat.State;
    }

    set etatCourant(value: number) {
        this.etat = this.etats[value];
        this.etat.display(0, 0, 0, 0);
    }

    get updateInterval(): number { 
        return this.etat.stateUpdateInterval;
    }

    get scoreDino(): number {
        return this.score;
    }

    set scoreDino(value: number) {
        this.score = value;
    }

    get levelDino(): number {
        return this.level;
    }

    set levelDino(value: number) {
        this.level = value;
    }   

    get levelStateDino(): LevelState {
        return this.levelState;
    }

    set levelStateDino(value: LevelState) {
        this.levelState = value;
    }

    // Appelée quand le dinosaure atterrit et à l'initialisation du dino 
    private initialiseHitbox() {
        this.hitboxes = [
            { x: this.x + 48, y: this.y + 10, width: 37, height: 20 }, // Tête ajustée
            { x: this.x + 20, y: this.y + 30, width: 40, height: 60 }, // Corps ajusté
            { x: this.x + 5, y: this.y + 40, width: 15, height: 20 } // Queue ajustée
        ];
    }
    

    // Appelée lors d'un saut
    //pour monté toute les hitbox en meme temps que le dino
    sauter(offsetY: number) {
        this.hitboxes.forEach(hitbox => {
            hitbox.y -= offsetY;
        });
    }

    // Appelée lors d'un accroupissement
    accroupir() {
        // Fusionner les hitboxes en une seule qui couvre la zone accroupie
        this.hitboxes = [
            { x: this.x, y: this.y + 40, width: 83, height: 40 }
        ];
    }

    // Appelée quand le dinosaure se redresse
    seRedresser() {
        this.initialiseHitbox(); // on rétabli les hitboxes originales
    }

    updateHitboxesForJump(velocityY: number, isGoingDown: boolean) {
        this.hitboxes.forEach(hitbox => {
            hitbox.y += isGoingDown ? -velocityY : velocityY;
        });
    }

    display() {
        this.etat.display(0, 0, 0, 0);
    }

    displayScore() {
        const scorePalierHtml = document.querySelector('#score-palier') as HTMLElement;
        this.scoreHtml.innerHTML = this.score.toString();
    
        // Vérifier si le score atteint un palier de 500
        //si c'est le cas on le fait clignoté 3 fois
        const prochainPalier = Math.floor(this.score / 500) * 500;
        if (prochainPalier > this.dernierPalierAffiche) {
            scorePalierHtml.innerHTML = prochainPalier.toString();
            scorePalierHtml.style.display = 'block';
            this.scoreHtml.style.visibility = 'hidden'
    
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                scorePalierHtml.style.visibility = scorePalierHtml.style.visibility === 'hidden' ? 'visible' : 'hidden';
                blinkCount++;
    
                // Arrêter de clignoter après 2 secondes
                if (blinkCount >= 3) {
                    clearInterval(blinkInterval);
                    scorePalierHtml.style.display = 'none'; // Cache complètement l'élément
                    this.scoreHtml.style.visibility = 'visible'; 
                    this.dernierPalierAffiche = prochainPalier;
                }
            },1000);
        }
    }       

    updateSpriteDisplayed(){
        this.etat.updateSpriteDisplayed();
    }

    gagnerPoint() {
        this.levelState.addPoint();
    }

    detecterCollision(obstacle: Obstacle): boolean {
        return this.hitboxes.some(hitbox => {
            const hitboxObstacle = {
                x: obstacle.PosX, y: obstacle.PosY, 
                width: obstacle.width, height: obstacle.height
            };
    
            return hitbox.x < hitboxObstacle.x + hitboxObstacle.width &&
                   hitbox.x + hitbox.width > hitboxObstacle.x &&
                   hitbox.y < hitboxObstacle.y + hitboxObstacle.height &&
                   hitbox.y + hitbox.height > hitboxObstacle.y;
        });
    }

}