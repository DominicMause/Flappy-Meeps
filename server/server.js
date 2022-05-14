import http from "http";
import express from "express";

export default class Server{
    constructor(){
        this.hostname = "127.0.0.1";
        this.port = 3000;
        this.app = null;
        this.server = null;

        this.createServer();
    }

    createServer(){
        this.app = express();

        this.app.use(express.static("./public"));
        
        this.app.get("/", (req, res) => {
            res.sendFile("index.html", {root: "./public"});
        });

        this.server = http.createServer(this.app);
    }

    start(){
        this.server.listen(this.port, () => {
            console.log(`Server is running at http://${this.hostname}:${this.port}/`);
        });
    }
}