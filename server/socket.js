import { Server } from "socket.io";

export default class Socket{
    constructor(server){
        this.io = new Server(server);
        this.io.on('connection', (socket) => {
            socket.on("getData", () => {
                io.emit("data", model)
            })
        })
    }

    emit(type, e){
        this.io.emit(type,e);
    }
}