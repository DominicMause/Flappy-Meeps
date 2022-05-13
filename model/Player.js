import Game from "../game/Game.js";

export default class Player{
    static PLAYER_COUNT = 0;
    static CHECKPOINT_TIME = 100;
    #current_distance;

    constructor(){
        this.x = 50;
        this.y = 500;
        this.size = 40;
        this.velocityY = -10;
        this.ID = this.getID();
        this.alive = true;
        this.points = 0;
        this.#current_distance = 0;
    }

    getID(){
        return this.PLAYER_COUNT++;
    }

    jump(){
        this.velocityY = -70;
    }

    update(deltaTime){
        this.velocityY += Game.GRAVITY * deltaTime/100;
        this.y += this.velocityY * deltaTime/100;

        if(this.y < 0 || this.y + this.size > 800)
            this.alive = false;

        if(this.alive){
            this.points++;
        }
    }
}