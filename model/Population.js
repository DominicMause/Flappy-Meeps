import NeuralNetwork from "../NeuralNetwork/NeuralNetwork.js";
import Socket from "../server/socket.js";
import Meep from "./Meep.js"

export default class Population {
    constructor(popSize, layer) {
        this.popSize = popSize;
        this.layer = layer;
        this.meeps = [];

        for (var i = 0; i < this.popSize; i++) {
            this.meeps.push(new Meep(layer));
        }

        this.fittest = 0;
    }

    getFittest() {
        this.orderPopulation();
        return this.meeps[0];
    }

    getSecondFittest() {
        this.orderPopulation();
        return this.meeps[1];
    }

    orderPopulation() {
        this.meeps.sort((a, b) => b.points - a.points);
    }

    update(deltaTime, input) {
        let stillAlive = this.meeps.filter((meep) => meep.alive);
        if (stillAlive.length > 0) {
            for (let i = 0; i < stillAlive.length; i++) {
                stillAlive[i].update(deltaTime, input);
            }
        }
    }

    nextGeneration() {
        let fittest = this.getFittest();
        let secondFittest = this.getSecondFittest();

        for (let i = 0; i < this.meeps.length; i++) {
            this.meeps[i].fitness = this.meeps[i].points;
            this.meeps[i].points = 0;
            this.meeps[i].alive = true;
            this.meeps[i].y = 400;
            this.meeps[i].velocityY = -70;
            if(i > 5 && i < this.popSize * .75){
                this.meeps[i].brain = fittest.brain.clone();
            }else if (i > 5 && i >= this.popSize * .75) {
                this.meeps[i].brain = secondFittest.brain.clone();
            }
            if(i > 5 && this.meeps[i].brain){
                this.meeps[i].brain.mutate(.1);
            }
        }
    }
}