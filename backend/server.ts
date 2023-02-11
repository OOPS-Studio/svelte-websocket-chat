import * as http from "http";
import { WebSocketServer } from "ws";
import { SafeWebSocketConnection } from "./SafeWebSocketConnection";

const httpServer = http.createServer();
const webSocketServer = new WebSocketServer({
	noServer: true,
	clientTracking: false
});
const safeWebSocketConnections: SafeWebSocketConnection[] = [];

webSocketServer.on("connection", connection => {
	const safeWebSocketConnection = new SafeWebSocketConnection(connection);
	safeWebSocketConnections.push(safeWebSocketConnection);

	safeWebSocketConnection.send("textMessage", {
		textContent: "just a test"
	});

	safeWebSocketConnection.on("textMessage", data => {
		safeWebSocketConnections.forEach(connection => {
			connection.send("textMessage", data);
		});
	});
});

httpServer.on("upgrade", (request, socket, head) => {
	// DANGER D A N G E R !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// Need to validate the connection before accepting it
	webSocketServer.handleUpgrade(request, socket, head, client => {
		webSocketServer.emit("connection", client);
	});
});

httpServer.listen(8080);
