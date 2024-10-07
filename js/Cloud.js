import { Obstacle } from "./Obstacle.js";
export class Cloud extends Obstacle {
    constructor() {
        let height = Math.random() * 100;
        super(1200, height, 104, 45);
    }
    display() {
        super.display(160, 0, 104, 45);
    }
    ;
}
