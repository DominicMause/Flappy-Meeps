var socket = io();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startButton = document.querySelector("[data-start-button]");
var infoBox = document.querySelector(".info");

const pipeTop = document.getElementById("pipe-top");
const pipeBody = document.getElementById("pipe-body");
const bird = document.getElementById("bird");
const firstBird = document.getElementById("first-bird");
const cloud = document.getElementById("cloud");
const cloudWide = document.getElementById("cloud-wide");
const brain = document.getElementById("brain");

var score = [];
var game = null;
var detail = 0;
let selected = 0;
var c = 0;

canvas.addEventListener("click", () => {detail = ++detail % 3});
document.addEventListener("keydown", (e) => {
    if(e.code == "ArrowUp"){
        selected++;
    }else if(e.code == "ArrowDown"){
        selected--;
    }
});

socket.on('game', (data) => {
    c++;
    game = data;
    draw();
})

socket.on("reset", (data) => {
    infoBox.innerHTML = "";
    let list = document.createElement("div");
    list.classList.add("highscore");
    for(var i = 0; i < data.length; i++){
        let item = document.createElement("div");
        item.innerText = "Generation " + data[i].gen + ": " + data[i].points + " Points";
        list.appendChild(item);
    }
    infoBox.appendChild(list)
})

let died = 0;

socket.on("dead", () => {
    died = .5;
})

let nodes = [
    [
        {x: 30, y: 52},
        {x: 30, y: 76},
        {x: 30, y: 100},
        {x: 30, y: 124},
        {x: 30, y: 148},
    ],[
        {x: 100, y: 16},
        {x: 100, y: 40},
        {x: 100, y: 64},
        {x: 100, y: 88},
        {x: 100, y: 112},
        {x: 100, y: 136},
        {x: 100, y: 160},
        {x: 100, y: 184},
    ],[
        {x: 170, y: 88},
        {x: 170, y: 112}
    ]
]
let pos = [];

for(let i = 0; i < 25; i++){
        pos.push({
            x: Math.random() * 800,
            y: Math.random() * 500,
            v: Math.random() * 5,
            size: Math.round(Math.random() + 0.3)
        });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = game.population.population.filter((meep) => meep.alive);

    for(let i = 0; i < pos.length; i++){
        if(pos[i].size == 1){
            ctx.drawImage(cloud,canvas.width - (pos[i].x + (c/(5+pos[i].v))) % 855, pos[i].y);
        }else{
            ctx.drawImage(cloudWide,canvas.width - (pos[i].x + (c/(15+pos[i].v))) % 882, pos[i].y);
        }
    }
    ctx.globalAlpha = Math.max(1 / alive.length, 0.75);
    for (let i = 0; i < game.population.population.length; i++) {
        let meep = game.population.population[i];
        if (meep.alive) {
            ctx.drawImage(bird,meep.x, meep.y, meep.size, meep.size);
            if(detail > 0){
                ctx.strokeStyle = "#44ff44";
                ctx.lineWidth = 1
                ctx.strokeRect(meep.x, meep.y, meep.size, meep.size);
            }
        }
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "#ff4444";
    ctx.lineWidth = 1
    for (let i = 0; i < game.obstacle.length; i++) {
        let obstacle = game.obstacle[i];
        // Upper Pipe
        ctx.drawImage(pipeBody,obstacle.x + 10,0,60,obstacle.upperTop-30);
        ctx.drawImage(pipeTop,obstacle.x,obstacle.upperTop-30);
        
        // Lower Pipe
        ctx.drawImage(pipeBody,obstacle.x + 10,obstacle.lowerTop+30,60,canvas.height-obstacle.upperTop);
        ctx.drawImage(pipeTop,obstacle.x,obstacle.lowerTop)
        if(detail > 0){
            ctx.strokeRect(obstacle.x,0,80,obstacle.upperTop);
            ctx.strokeRect(obstacle.x,obstacle.lowerTop,80,canvas.height-obstacle.upperTop);
        }
    }

    if (died > 0) {
        ctx.globalAlpha = died;
        ctx.fillStyle = "red"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        died -= .01;
    }
    ctx.globalAlpha = 1;

    ctx.font = "30px Arial"
    ctx.strokeStyle = "black"
    ctx.fillStyle = "#fff";
    ctx.textAlign = 'left';
    ctx.lineWidt = .25;
    ctx.fillText(alive.length + " / " + game.population.popSize, 20 , canvas.height - 20);
    ctx.strokeText(alive.length + " / " + game.population.popSize, 20 , canvas.height - 20);
    ctx.fillText("Generation: " + game.generation, 20 , 30);
    ctx.strokeText("Generation: " + game.generation, 20 , 30);
    ctx.fillText("Fitness: " + alive[0].fitness, 20 , 60);
    ctx.strokeText("Fitness: " + alive[0].fitness, 20 , 60);
    
    ctx.font = "50px Arial"
    ctx.textAlign = 'center';
    ctx.fillText(game.points, canvas.width/2 , 50);
    ctx.strokeText(game.points, canvas.width/2 , 50);

    if (detail > 0) {
        if (detail > 1) {
            ctx.strokeStyle = "#55ff55"
            ctx.lineWidth = 3;
            ctx.strokeRect(-2, game.obstacle[0].upperTop, canvas.width + 4, game.obstacle[0].gap);
            ctx.beginPath();
            ctx.moveTo(alive[selected % alive.length].x + alive[selected % alive.length].size / 2, alive[selected % alive.length].y + alive[selected % alive.length].size / 2);
            ctx.lineTo(game.obstacle[0].x, alive[selected % alive.length].y + alive[selected % alive.length].size / 2);
            ctx.stroke();
        }

        let best = alive[selected % alive.length].brain;
        for (var i = 1; i < 3; i++) {
            for (var j = 0; j < best.layers[i].neurons.length; j++) {
                for (let k = 0; k < best.layers[i].neurons[j].weights.length; k++) {
                    if (best.layers[i].neurons[j].weights[k] > 0) {
                        ctx.strokeStyle = "#22ff22"
                    } else {
                        ctx.strokeStyle = "#ff2222"
                    }
                    ctx.lineWidth = 2 * Math.abs(best.layers[i].neurons[j].weights[k]);
                    ctx.beginPath();
                    if (detail > 1) {
                        ctx.moveTo(400 + nodes[i - 1][k].x * 2, 400 + nodes[i - 1][k].y * 2);
                        ctx.lineTo(400 + nodes[i][j].x * 2, 400 + nodes[i][j].y * 2);
                    } else {
                        ctx.moveTo(600 + nodes[i - 1][k].x, 600 + nodes[i - 1][k].y);
                        ctx.lineTo(600 + nodes[i][j].x, 600 + nodes[i][j].y);
                    }
                    ctx.stroke();
                }
            }
        }
        
        if (detail > 1) {
            ctx.drawImage(brain,400, 400, 400,400);
        } else {
            ctx.drawImage(brain,600, 600, 200,200);
        }
    }
}
