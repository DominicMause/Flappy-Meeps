import Game from "../game/Game.js";
import Agent from "../NeuralNetwork/Agent.js";

export default class Meep extends Agent{
    constructor(){
        super();
        this.x = 50;
        this.y = 500;
        this.size = 40;
        this.velocityY = -10;
        this.alive = true;
    }

    jump(){
        this.velocityY = -70;
    }

    update(deltaTime, obstacle){
        let input = [];

        input.push(this.y);
        input.push(this.velocityY);
        input.push(obstacle[0].upperTop);
        input.push(obstacle[0].lowerTop);
        input.push(obstacle[0].x - this.x)

        let output = this.brain.predict(input);

        if(output[0] > output[1]){
            this.jump();
        }

        this.velocityY += Game.GRAVITY * deltaTime/100;
        this.y += this.velocityY * deltaTime/100;

        if(this.y < 0 || this.y + this.size > 800)
            this.alive = false;

        if(this.alive){
            this.reward();
        }
    }
}