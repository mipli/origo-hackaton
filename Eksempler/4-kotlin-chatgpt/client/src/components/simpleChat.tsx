import React from 'react';
import CodeEditor from "@uiw/react-textarea-code-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";

import "./simpleChat.css"

enum ChatRole {
    SYSTEM = 'system',
    ASSISTANT = 'assistant',
    USER = 'user',
}

interface ChatMessage {
    role: ChatRole,
    content: string,
}

function SimpleChat() {
    const [chatHistory] = React.useState<Array<ChatMessage>>([]);
    const [systemPrompt, setSystemPrompt] = React.useState<string>('');
    const [currentMessage, setCurrentMessage] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleSubmit = () => {
        if (isLoading) {
            return;
        }

        chatHistory.push({
            role: ChatRole.USER,
            content: currentMessage
        });

        setCurrentMessage("");
        setIsLoading(true);

        //Prepend the system prompt to the chat history if it's not blank
        const payload = systemPrompt ? [{
            role: ChatRole.SYSTEM,
            content: systemPrompt
        }].concat(chatHistory) : chatHistory

        fetch('http://localhost:9000/simple-chat', {
            method: "POST",
            headers: {
                "Accept": "text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        .then(async res => {
            chatHistory.push({
                role: ChatRole.ASSISTANT,
                content: await res.text()
            })

            setIsLoading(false);
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    }

    const parseChatHistory = (): string => {
        return chatHistory.map(message => {
            const name = message.role === ChatRole.USER ? "**You**" : "**Bot**";
            return `${name}: ${message.content}`;
        }).join("<br>");
    }

    return (
        <>
            <div className="simple-chat-container">
                <CodeEditor
                    className={"chat-prompt"}
                    value={systemPrompt}
                    language=""
                    placeholder="Enter system prompt here (optional)"
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    padding={15}
                />
                <MarkdownPreview
                    className={"chat-history"}
                    source={parseChatHistory()}
                />
                <CodeEditor
                    className={"chat-input"}
                    value={currentMessage}
                    language=""
                    placeholder="Type here"
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    padding={15}
                    onKeyUp={handleKeyPress}
                />
            </div>
        </>
    );
}

export default SimpleChat;
