/* Utilisation du pattern 'state' pour pouvoir mettre à jour
l'affichatge du dinausaure en fonction de l'état du jeux */

import { Dinosaure } from "./Dinosaure.js";

const enum enumState  {
    jump= 0,
    run,
    down,
    dead
}

export abstract class State {
    protected state: enumState;
    protected dino: Dinosaure;
    protected updateInterval: number;
    private canvas: HTMLCanvasElement = document.querySelector('#monCanvas') as HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    private spriteSheet: HTMLImageElement = new Image();
    
    constructor(state: number, dino: Dinosaure, updateInterval: number) {
        this.state = state;
        this.dino = dino;
        this.updateInterval = updateInterval;
        this.spriteSheet.src = './ressource/sprite.webp';
    }

    get State(): number {
        return this.state;
    }

    display(spriteX: number, spriteY: number, spriteWidth:number ,spriteHeight:number) {
        this.ctx.drawImage(
            this.spriteSheet,
            spriteX,
            spriteY,
            spriteWidth,
            spriteHeight,
            this.dino.positionX,
            this.dino.positionY,
            90,
            100,
        );
        //décommenter pour afficher les hitbox du personnage
        //this.ctx.strokeStyle = 'green';
        //this.dino.hitbox.forEach(hitbox => {
        //    this.ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        //});    
    };
    abstract switchState() : void;

    get stateUpdateInterval(): number {
        return this.updateInterval;
    }

    updateSpriteDisplayed() {};
}

export class StateJump extends State {
    private initialY: number;
    private velocityY: number;
    private ceilingHeight: number = 100;
    private isGoingDown: boolean = false;

    constructor(dino: Dinosaure) {
        super(enumState.jump, dino, 6);
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
        } else {
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
        this.dino.etatCourant = enumState.run;
    }
}


abstract class StateMultipleSprite extends State {
        //position de toute les sprite de run dans le spriteSheet
        protected listSprite: number[][];
        //pour itérer sur la liste de sprite
        protected index: number = 0;
        protected listSpriteLength: number;

        constructor(state:number, dino: Dinosaure, updateInterval:number, listSprite: number[][]) {
            super(enumState.run, dino, updateInterval);
            this.dino = dino;
            this.listSprite = listSprite;
            this.listSpriteLength = this.listSprite.length;
        }

        display() {
            const [spriteX, spriteY, spriteWidth, spriteHeight] = this.listSprite[this.index];
            super.display(spriteX, spriteY, spriteWidth, spriteHeight);           
        };

        updateSpriteDisplayed(){
            this.index = (this.index + 1) % this.listSpriteLength;
        }

        switchState() {};
};

export class StateRun extends StateMultipleSprite {

    constructor(dino: Dinosaure) {
        let listeSprite: number[][] = [
            [1676, 0, 90, 100],
            [1764, 0, 90, 100],
            [1852, 0, 90, 100],
            [1940, 0, 90, 100],
        ];
        super(enumState.run, dino, 35, listeSprite);
        this.dino = dino;
    }
    
    switchState() {
        this.dino.etatCourant = enumState.jump;
    };

    switchStateDown() {
        this.dino.etatCourant = enumState.down;
    }
}

export class StateDown extends StateMultipleSprite {
    constructor(dino: Dinosaure) {
        let listeSprite: number[][] = [
            [2202, 0, 123, 100],
            [2320, 0, 123, 100]
        ];
        super(enumState.down, dino, 100, listeSprite);
        this.dino = dino;
    }

    display(): void {
        super.display();
        this.dino.accroupir();
    }
    
    switchState() {
        this.dino.etatCourant = enumState.run;
        this.dino.seRedresser();
    }
}

export class StateDead extends State {
    constructor(dino: Dinosaure) {
        super(enumState.down, dino, 35);
        this.dino = dino;
    }
    
    display() {
        super.display(2027, 0, 90, 100);
    };

    switchState() {
        this.dino.etatCourant = 0;
    };
}
