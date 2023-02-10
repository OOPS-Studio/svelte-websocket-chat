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

export type SafeWebSocketEventListenerCallback = <K>(data: FromServer[K]) => void;

export type SafeWebSocketEventListenerCallbackTable = {
	[K in keyof FromServer]?: SafeWebSocketEventListenerCallback<K>[]
}

export type SafeWebSocketConnectionEventListenerCallback = <K>(data: FromClient[K]) => void;

export type SafeWebSocketConnectionEventListenerCallbackTable = {
	[K in keyof FromClient]?: SafeWebSocketConnectionEventListenerCallback<K>[]
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