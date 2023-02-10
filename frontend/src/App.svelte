<script lang="ts">
	import Message from "./lib/Message.svelte";
	import { watchForEnterPressed } from "./lib/onenter";

	import { safeWebSocket } from "./communicate";

	let messages: string[] = [];

	function addMessage(content: string){
		messages.push(content);
		messages = messages;
	}

	safeWebSocket.on("textMessage", data => {
		addMessage(data.textContent);
	});

	let messageContent = "";

	function submitMessage(): void{
		safeWebSocket.send("textMessage", {
			textContent: messageContent
		});
		messageContent = "";
	}
</script>

<div id="chat-window">
	{#each messages as message}
		<Message content={message} />
	{/each}
</div>

<input type="text" placeholder="Typeee" bind:value={messageContent} use:watchForEnterPressed on:enterpressed={submitMessage}>

<style>
	#chat-window{
		width: 600px;
		height: 400px;
		border: 1px solid black;
		box-sizing: border-box;
	}

	input{
		width: 600px;
		box-sizing: border-box;
	}
</style>