import { Obstacle } from "./Obstacle.js";
export class Cactus extends Obstacle {
    constructor(decalage) {
        super(1200 + (decalage * 30), 260, 30, 100);
    }
    display() {
        super.display(450, 0, 30, 100);
    }
    ;
}
;
