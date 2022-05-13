import Population from "../model/Population.js";
import Obstacle from "./Obstacle.js";

export default class Game {

    static isRunning = false;
    static GRAVITY = 19.62;

    constructor() {
        this.obstacle = [];
        this.population = new Population(100, { input: 5, hidden: 8, output: 2 });
        this.lastTick = 0;
        this.generation = 1;
        this.points = 0;
        this.runningPoints = 0;
        this.socket = null;

        this.score = [];
    }

    update(deltaTime) {
        if (!this.isRunning)
            return;

        this.runningPoints++;
        
        this.population.update(deltaTime, this.obstacle);
        for (let i = 0; i < this.population.meeps.length; i++) {
            for (let j = 0; j < this.obstacle.length; j++) {
                let meep = this.population.meeps[i];
                if (meep.alive &&
                    meep.x + meep.size >= this.obstacle[j].x &&
                    meep.x <= this.obstacle[j].x + this.obstacle[j].width &&
                    (meep.y < this.obstacle[j].upperTop ||
                        meep.y + meep.size >= this.obstacle[j].lowerTop)) {
                    meep.alive = false;
                    this.socket.emit("dead");
                }
            }
        }

        let stillAlive = this.population.meeps.filter((meep) => meep.alive);
        if (stillAlive.length <= 0) {
            this.score.push({gen: this.generation, points: this.points});
            this.score.sort((a,b) => b.points - a.points);
            this.population.nextGeneration();
            this.generation++;
            this.isRunning = false;
            this.socket.emit("msg", "Next Generation:");
            this.socket.emit("reset", this.score);
            this.reset();
        }

        for (let i = 0; i < this.obstacle.length; i++) {
            let obstacle = this.obstacle[i];
            obstacle.update(deltaTime)

            if (obstacle.x + obstacle.width < 0) {
                this.points++;
                this.socket.emit("reset", this.score);
                this.obstacle.shift();
                this.obstacle.push(new Obstacle(1000, Math.random() * 800))
            }
        }

        if (this.socket) {
            this.socket.emit("game", {
                obstacle: this.obstacle,
                population: this.population,
                generation: this.generation,
                points: this.points,
                runningPoints: this.runningPoints
            });
        }
    }

    gameLoop() {
        var now = Date.now();
        var deltaTime = now - this.lastTick;

        this.lastTick = now;
        this.update(deltaTime);
    }

    setSocket(socket) {
        this.socket = socket;
    }

    reset() {
        this.obstacle = [];
        this.points = 0;
        this.runningPoints = 0;
        this.obstacle.push(new Obstacle(800))
        this.obstacle.push(new Obstacle(1340))
        this.isRunning = true;
    }

    start() {
        this.isRunning = true;
        setInterval(() => this.gameLoop(), 1);
        this.reset();
    }
}