export default class Obstacle{
    constructor(x){
        this.gap = 200 + Math.random() * 70;
        this.width = 80;
        this.x = x;
        this.y = Math.random() * (500 - 200) + 200;
        this.upperTop = this.y - this.gap/2;
        this.lowerTop = this.y + this.gap/2;
        this.speedX = 50;
    }

    update(deltaTime){
        this.x -= this.speedX * deltaTime/100;
    }
}