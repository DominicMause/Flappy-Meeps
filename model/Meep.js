import Layer from "../NeuralNetwork/Layer.js";
import NeuralNetwork from "../NeuralNetwork/NeuralNetwork.js";
import Player from "./Player.js";

export default class Meep extends Player{

    constructor(layer){
        super();
        this.brain = new NeuralNetwork();
        this.fitness = 0;

        let inputLayer = new Layer(layer.input);
        let hiddenLayer = new Layer(layer.hidden, {activation: "sigmoid"});
        let outputLayer = new Layer(layer.output, {activation: "softmax"});

        this.brain.add(inputLayer);
        this.brain.add(hiddenLayer);
        this.brain.add(outputLayer);
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

        super.update(deltaTime);
    }
}