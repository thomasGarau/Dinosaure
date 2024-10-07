import { StateJump, StateDown, StateRun } from "./State.js";
export class Dinosaure {
    scoreHtml = document.querySelector('#score');
    x = 40;
    y = 250;
    hitboxes = [];
    etats = [
        new StateJump(this),
        new StateRun(this),
        new StateDown(this)
    ];
    etat = this.etats[1];
    levelState;
    score = 0;
    level = 1;
    dernierPalierAffiche = 0;
    constructor(levelState) {
        this.levelState = levelState;
        this.initialiseHitbox();
    }
    get positionX() {
        return this.x;
    }
    set positionX(value) {
        this.x = value;
    }
    set positionY(value) {
        this.y = value;
    }
    get positionY() {
        return this.y;
    }
    get hitbox() {
        return this.hitboxes;
    }
    get etatCourant() {
        return this.etat.State;
    }
    set etatCourant(value) {
        this.etat = this.etats[value];
        this.etat.display(0, 0, 0, 0);
    }
    get updateInterval() {
        return this.etat.stateUpdateInterval;
    }
    get scoreDino() {
        return this.score;
    }
    set scoreDino(value) {
        this.score = value;
    }
    get levelDino() {
        return this.level;
    }
    set levelDino(value) {
        this.level = value;
    }
    get levelStateDino() {
        return this.levelState;
    }
    set levelStateDino(value) {
        this.levelState = value;
    }
    // Appelée quand le dinosaure atterrit et à l'initialisation du dino 
    initialiseHitbox() {
        this.hitboxes = [
            { x: this.x + 48, y: this.y + 10, width: 37, height: 20 }, // Tête ajustée
            { x: this.x + 20, y: this.y + 30, width: 40, height: 60 }, // Corps ajusté
            { x: this.x + 5, y: this.y + 40, width: 15, height: 20 } // Queue ajustée
        ];
    }
    // Appelée lors d'un saut
    //pour monté toute les hitbox en meme temps que le dino
    sauter(offsetY) {
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
    updateHitboxesForJump(velocityY, isGoingDown) {
        this.hitboxes.forEach(hitbox => {
            hitbox.y += isGoingDown ? -velocityY : velocityY;
        });
    }
    display() {
        this.etat.display(0, 0, 0, 0);
    }
    displayScore() {
        const scorePalierHtml = document.querySelector('#score-palier');
        this.scoreHtml.innerHTML = this.score.toString();
        // Vérifier si le score atteint un palier de 500
        //si c'est le cas on le fait clignoté 3 fois
        const prochainPalier = Math.floor(this.score / 500) * 500;
        if (prochainPalier > this.dernierPalierAffiche) {
            scorePalierHtml.innerHTML = prochainPalier.toString();
            scorePalierHtml.style.display = 'block';
            this.scoreHtml.style.visibility = 'hidden';
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
            }, 1000);
        }
    }
    updateSpriteDisplayed() {
        this.etat.updateSpriteDisplayed();
    }
    gagnerPoint() {
        this.levelState.addPoint();
    }
    detecterCollision(obstacle) {
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
