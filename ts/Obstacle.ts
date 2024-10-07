export abstract class Obstacle {
    protected x:number = 0;
    protected y:number = 0;
    protected obstacleWidth: number
    protected obstacleHeight: number
    protected canvas: HTMLCanvasElement = document.querySelector('#monCanvas') as HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    protected spriteSheet: HTMLImageElement = new Image();

    constructor(posX: number, posY: number, width: number, height: number) {
        this.spriteSheet.src = './ressource/sprite.webp';
        this.x = posX;
        this.y = posY;
        this.obstacleWidth = width;
        this.obstacleHeight = height;
    }

    get width(): number {
        return this.obstacleWidth;
    }

    set width(value: number) {
        this.obstacleWidth = value;
    }

    get height(): number {
        return this.obstacleHeight;
    }

    set height(value: number) {
        this.obstacleHeight = value;
    }

    get PosX():number { 
        return this.x;
    }

    set PosX(value: number) {
        this.x = value;
    }

    get PosY():number { 
        return this.y;
    }

    set PosY(value: number) {
        this.y = value;
    }



    isOffScreen() {
        return this.x < 0;
    }

    moveObstacle(amount: number) {
        this.x -= amount;
    }

    display(spriteX: number, spriteY: number, spriteWidth: number, spriteHeight: number): void {
        this.ctx.drawImage(
            this.spriteSheet,
            spriteX,
            spriteY,
            this.obstacleWidth,
            this.obstacleHeight,
            this.x,
            this.y,
            spriteWidth,
            spriteHeight,
        );
        this.ctx.strokeStyle = 'red';
        this.ctx.strokeRect(this.x, this.y, this.obstacleWidth, this.obstacleHeight);
    }
}