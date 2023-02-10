import type { FromServer, FromClient, SafeWebSocketEventListenerCallbackTable } from "common";

export class SafeWebSocket{
	webSocket: WebSocket;
	registeredEventListeners: SafeWebSocketEventListenerCallbackTable;

	constructor(url: string) {
		this.webSocket = new WebSocket(url);
		this.registeredEventListeners = {};

		this.webSocket.addEventListener("open", () => {
			this.webSocket.addEventListener("message", message => {
				this.handleMessage(message);
			});
		});
	}

	handleMessage(message: MessageEvent<any>) {
		type ArbitraryMessageFromServer<T> = {
			[K in keyof T]: {
				messageType: K,
				content: T[K]
			}
		}[keyof T];

		const data: ArbitraryMessageFromServer<FromServer> = JSON.parse(message.data);

		const eventListeners = this.registeredEventListeners[data.messageType];

		if (!eventListeners) return;

		for (let i = 0; i < eventListeners.length; ++i){
			eventListeners[i](data.content);
		}
	}

	on<K extends keyof FromServer>(messageType: K, callback: (data: FromServer[K]) => void): void {
		if (typeof this.registeredEventListeners[messageType] === "undefined") this.registeredEventListeners[messageType] = [];
		this.registeredEventListeners[messageType]!.push(callback);
	}
	
	send<K extends keyof FromClient>(messageType: K, content: FromClient[K]) {
		this.webSocket.send(JSON.stringify({
			messageType: messageType,
			content: content
		}));
	}
}
