import { Obstacle } from "./Obstacle.js";

export class Bird extends Obstacle {
    protected listSprite: number[][];
    //pour itérer sur la liste de sprite
    protected index: number = 0;
    interval: any;

    constructor() {
        let height = Math.floor(Math.random() * 100) + 150;
        super(1200, height, 70, 70);
        this.listSprite = [
            [270, 0, 80, 80],
            [360, 0, 80, 80],
        ];
        setInterval(() => {
            this.updateAnimation();
        }, 100);
    }

    updateAnimation() {
        this.index = (this.index + 1) % this.listSprite.length;
    }

    display(): void {
        const [spriteX, spriteY, spriteWidth, spriteHeight] = this.listSprite[this.index];
        super.display(spriteX, spriteY, spriteWidth, spriteHeight);
    }


}