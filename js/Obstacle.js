export class Obstacle {
    x = 0;
    y = 0;
    obstacleWidth;
    obstacleHeight;
    canvas = document.querySelector('#monCanvas');
    ctx = this.canvas.getContext('2d');
    spriteSheet = new Image();
    constructor(posX, posY, width, height) {
        this.spriteSheet.src = './ressource/sprite.webp';
        this.x = posX;
        this.y = posY;
        this.obstacleWidth = width;
        this.obstacleHeight = height;
    }
    get width() {
        return this.obstacleWidth;
    }
    set width(value) {
        this.obstacleWidth = value;
    }
    get height() {
        return this.obstacleHeight;
    }
    set height(value) {
        this.obstacleHeight = value;
    }
    get PosX() {
        return this.x;
    }
    set PosX(value) {
        this.x = value;
    }
    get PosY() {
        return this.y;
    }
    set PosY(value) {
        this.y = value;
    }
    isOffScreen() {
        return this.x < 0;
    }
    moveObstacle(amount) {
        this.x -= amount;
    }
    display(spriteX, spriteY, spriteWidth, spriteHeight) {
        this.ctx.drawImage(this.spriteSheet, spriteX, spriteY, this.obstacleWidth, this.obstacleHeight, this.x, this.y, spriteWidth, spriteHeight);
        //décommenter pour afficher les hitbox des obstacles
        //this.ctx.strokeStyle = 'red';
        //this.ctx.strokeRect(this.x, this.y, this.obstacleWidth, this.obstacleHeight);
    }
}
