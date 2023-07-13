import React from 'react';
import CodeEditor from "@uiw/react-textarea-code-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";

import "./simpleChat.css"

enum ChatRole {
    ASSISTANT = 'assistant',
    USER = 'user',
}

interface ChatMessage {
    role: ChatRole,
    content: string,
}

function SimpleChat() {
    const [chatHistory, setChatHistory] = React.useState<Array<ChatMessage>>([]);
    const [currentMessage, setCurrentMessage] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const chatStyle = {
        width: '100%',
        height: '100%',
        fontSize: 18,
    };

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

        fetch('http://localhost:9000/simple-chat', {
            method: "POST",
            headers: {
                "Accept": "text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chatHistory),
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
        <div className="simple-chat-container">
            <MarkdownPreview
                className={"chat-history"}
                source={parseChatHistory()}
                style={chatStyle}
            />
            <CodeEditor
                value={currentMessage}
                language=""
                placeholder="Type here"
                onChange={(e) => setCurrentMessage(e.target.value)}
                padding={15}
                style={chatStyle}
                onKeyUp={handleKeyPress}
            />
        </div>
    );
}

export default SimpleChat;
