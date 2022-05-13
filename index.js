import Game from "./game/Game.js";
import Server from "./server/server.js";
import Socket from "./server/socket.js";

let server = new Server();
server.start();

let socket = new Socket(server.server);

let game = new Game();
game.setSocket(socket);
game.start();