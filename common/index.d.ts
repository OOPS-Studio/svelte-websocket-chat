export interface FromServer{
	"textMessage": {
		textContent: string
	}
}

export interface FromClient{
	"textMessage": {
		textContent: string
	}
}

export type ArbitraryMessage<T> = {
	[K in keyof T]: {
		messageType: K,
		content: T[K]
	}
}[keyof T]

export type SafeWebSocketEventListenerCallback = (data: FromServer[keyof FromServer]) => void;

export type SafeWebSocketEventListenerCallbackTable = {
	[K in keyof FromServer]?: SafeWebSocketEventListenerCallback[]
}

export type SafeWebSocketConnectionEventListenerCallback = (data: FromClient[keyof FromClient]) => void;

export type SafeWebSocketConnectionEventListenerCallbackTable = {
	[K in keyof FromClient]?: SafeWebSocketConnectionEventListenerCallback[]
}

/*
export namespace FromServer{
	export interface TextMessage{
		textContent: string
	}

	export type EventName = "textMessage";
}

export namespace FromClient{
	export interface TextMessage{
		textContent: string
	}

	export type EventName = "textMessage";
}

export type SafeWebSocketEventListenerCallback = (data: { [k: string]: any }) => void;

export type SafeWebSocketEventListenerCallbackTable = {
	[key in FromServer.EventName]?: SafeWebSocketEventListenerCallback[]
}

*/