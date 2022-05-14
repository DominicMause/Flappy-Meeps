import Population from "../NeuralNetwork/Population.js";
import Meep from "./Meep.js"

export default class MeepPopulation extends Population {
    constructor(popSize, layer) {
        super(popSize, layer, Meep);
    }

    update(deltaTime, input) {
        let stillAlive = this.population.filter((meep) => meep.alive);
        if (stillAlive.length > 0) {
            for (let i = 0; i < stillAlive.length; i++) {
                stillAlive[i].update(deltaTime, input);
            }
        }
    }

    nextGeneration() {
        super.nextGeneration();

        for (let i = 0; i < this.population.length; i++) {
            this.population[i].alive = true;
            this.population[i].y = 400;
            this.population[i].velocityY = -70;
            if(i > 5 && this.population[i].brain){
                this.population[i].brain.mutate(.1);
            }
        }
    }
}