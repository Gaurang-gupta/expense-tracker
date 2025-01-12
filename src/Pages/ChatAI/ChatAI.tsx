import { useState } from "react";
function ChatAI() {
    const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
    const API_TOKEN = import.meta.env.VITE_API_TOKEN;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    async function chatWithBot(input: string) {
        console.log(input)
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                "content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: input }),
        });

        const result = await response.json();
        return result[0].generated_text;
    }

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message to the chat
        const userMessage: ChatMessage = {
            id: messages.length + 1,
            text: input,
            sender: "user",
        };
        setMessages((prev) => [...prev, userMessage]);
        const updatedInput = input

        // Mocking bot response (replace with API call if needed)
        const responseFromBot = await chatWithBot(updatedInput)
        const botResponse: ChatMessage = {
            id: messages.length + 2,
            text: `${responseFromBot}`, // Replace with actual response from API
            sender: "bot",
        };

        setTimeout(() => {
            setMessages((prev) => [...prev, botResponse]);
        }, 500);

        setInput(""); // Clear input field
    };

    return (
        <main className="max-w-6xl mx-auto p-5 pt-10">
        <h1 className="text-3xl font-semibold">Chat</h1>
        <h2 className="text-blue-600 italic font-serif my-1">Please only ask finance related questions. This model will not access the asset information stored by us.</h2>
        <div className="flex flex-col h-[400px] bg-white rounded-xl mt-2 border border-black">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-scroll scrollbar-none p-4">
            {messages.map((msg) => (
                <div
                key={msg.id}
                className={`mb-2 p-3 rounded-lg ${
                    msg.sender === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
                style={{
                    maxWidth: "75%",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
                >
                {msg.text}
                </div>
            ))}
            </div>

            {/* Input Box */}
            <div className="bg-white p-4 flex items-center xs:flex-col md:flex-row rounded-xl">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 xs:w-full"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="md:ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 xs:mt-2 xs:w-full md:w-1/4 md:mt-0"
                >
                    Send
                </button>
            </div>
        </div>
        </main>
    )
}

export default ChatAI

interface ChatMessage {
    id: number;
    text: string;
    sender: "user" | "bot";
  }