/* Utilisation du pattern 'state' pour pouvoir mettre à jour
l'affichatge du dinausaure en fonction de l'état du jeux */
export class State {
    state;
    dino;
    updateInterval;
    canvas = document.querySelector('#monCanvas');
    ctx = this.canvas.getContext('2d');
    spriteSheet = new Image();
    constructor(state, dino, updateInterval) {
        this.state = state;
        this.dino = dino;
        this.updateInterval = updateInterval;
        this.spriteSheet.src = './ressource/sprite.webp';
    }
    get State() {
        return this.state;
    }
    display(spriteX, spriteY, spriteWidth, spriteHeight) {
        this.ctx.drawImage(this.spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, this.dino.positionX, this.dino.positionY, 90, 100);
        //décommenter pour afficher les hitbox du personnage
        //this.ctx.strokeStyle = 'green';
        //this.dino.hitbox.forEach(hitbox => {
        //    this.ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        //});    
    }
    ;
    get stateUpdateInterval() {
        return this.updateInterval;
    }
    updateSpriteDisplayed() { }
    ;
}
export class StateJump extends State {
    initialY;
    velocityY;
    ceilingHeight = 100;
    isGoingDown = false;
    constructor(dino) {
        super(0 /* enumState.jump */, dino, 6);
        this.initialY = dino.positionY;
        // Hauteur maximale du saut 
        this.ceilingHeight = 60;
        // Vitesse de déplacement vertical (négative pour monter)
        this.velocityY = -7;
    }
    display() {
        if (!this.isGoingDown) {
            this.dino.positionY += this.velocityY;
            if (this.dino.positionY <= this.ceilingHeight) {
                this.isGoingDown = true;
            }
        }
        else {
            this.dino.positionY -= this.velocityY;
            if (this.dino.positionY >= this.initialY) {
                this.dino.positionY = this.initialY;
                this.isGoingDown = false;
                this.switchState();
            }
        }
        this.dino.updateHitboxesForJump(this.velocityY, this.isGoingDown);
        super.display(1675, 0, 90, 100);
    }
    switchState() {
        this.dino.etatCourant = 1 /* enumState.run */;
    }
}
class StateMultipleSprite extends State {
    //position de toute les sprite de run dans le spriteSheet
    listSprite;
    //pour itérer sur la liste de sprite
    index = 0;
    listSpriteLength;
    constructor(state, dino, updateInterval, listSprite) {
        super(1 /* enumState.run */, dino, updateInterval);
        this.dino = dino;
        this.listSprite = listSprite;
        this.listSpriteLength = this.listSprite.length;
    }
    display() {
        const [spriteX, spriteY, spriteWidth, spriteHeight] = this.listSprite[this.index];
        super.display(spriteX, spriteY, spriteWidth, spriteHeight);
    }
    ;
    updateSpriteDisplayed() {
        this.index = (this.index + 1) % this.listSpriteLength;
    }
    switchState() { }
    ;
}
;
export class StateRun extends StateMultipleSprite {
    constructor(dino) {
        let listeSprite = [
            [1676, 0, 90, 100],
            [1764, 0, 90, 100],
            [1852, 0, 90, 100],
            [1940, 0, 90, 100],
        ];
        super(1 /* enumState.run */, dino, 35, listeSprite);
        this.dino = dino;
    }
    switchState() {
        this.dino.etatCourant = 0 /* enumState.jump */;
    }
    ;
    switchStateDown() {
        this.dino.etatCourant = 2 /* enumState.down */;
    }
}
export class StateDown extends StateMultipleSprite {
    constructor(dino) {
        let listeSprite = [
            [2202, 0, 123, 100],
            [2320, 0, 123, 100]
        ];
        super(2 /* enumState.down */, dino, 100, listeSprite);
        this.dino = dino;
    }
    display() {
        super.display();
        this.dino.accroupir();
    }
    switchState() {
        this.dino.etatCourant = 1 /* enumState.run */;
        this.dino.seRedresser();
    }
}
export class StateDead extends State {
    constructor(dino) {
        super(2 /* enumState.down */, dino, 35);
        this.dino = dino;
    }
    display() {
        super.display(2027, 0, 90, 100);
    }
    ;
    switchState() {
        this.dino.etatCourant = 0;
    }
    ;
}
