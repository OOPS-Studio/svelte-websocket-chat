import type { FromClient, FromServer, SafeWebSocketConnectionEventListenerCallbackTable } from "common";

import { WebSocket, RawData } from "ws";

import * as Joi from "joi";

export class SafeWebSocketConnection{
	connection: WebSocket;
	registeredEventListeners: SafeWebSocketConnectionEventListenerCallbackTable;

	constructor(connection: WebSocket) {
		this.connection = connection;
		this.registeredEventListeners = {};

		this.connection.on("message", message => {
			this.handleMessage(message);
		});
	}

	handleMessage(message: RawData) {
		type ArbitraryMessageFromClient<T> = {
			[K in keyof T]: {
				messageType: K,
				content: T[K]
			}
		}[keyof T];

		let data: ArbitraryMessageFromClient<FromClient>;

		try {
			data = JSON.parse(message.toString());
		} catch (err) {
			console.log("Invalid JSON recieved from client. Message not processed.");
			return;
		}

		// DANGER D A N G E R !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// NEED to validate data here.

		const eventListeners = this.registeredEventListeners[data.messageType];

		if (!eventListeners) return;

		for (let i = 0; i < eventListeners.length; ++i){
			eventListeners[i](data.content);
		}
	}

	on<K extends keyof FromClient>(messageType: K, callback: (data: FromClient[K]) => void): void {
		if (typeof this.registeredEventListeners[messageType] === "undefined") this.registeredEventListeners[messageType] = [];
		this.registeredEventListeners[messageType]!.push(callback);
	}
	
	send<K extends keyof FromServer>(messageType: K, content: FromServer[K]) {
		this.connection.send(JSON.stringify({
			messageType: messageType,
			content: content
		}));
	}
}
