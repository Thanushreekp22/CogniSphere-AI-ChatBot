import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import QuickActions from "./QuickActions.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat({ onQuickActionSubmit }) {
    const {newChat, prevChats, reply, setPrompt} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    const handleQuickAction = (promptText) => {
        // Set the prompt for display
        setPrompt(promptText);
        // Trigger submission with the prompt text directly
        if (onQuickActionSubmit) {
            onQuickActionSubmit(promptText);
        }
    };

    return (
        <>
            {newChat && (
                <>
                    <h1>Start a New Chat!</h1>
                    <QuickActions onSelectAction={handleQuickAction} />
                </>
            )}
            <div className="chats">
                {
                    prevChats?.map((chat, idx) => {
                        // Check if this is the last assistant message (needs typing effect)
                        const isLastAssistant = idx === prevChats.length - 1 && 
                                               chat.role === "assistant" && 
                                               latestReply !== null;
                        
                        return (
                            <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                                {
                                    chat.role === "user"? 
                                    <div className="userMessage">
                                        {chat.image && (
                                            <img src={chat.image} alt="Uploaded" className="chat-image" />
                                        )}
                                        <p>{chat.content}</p>
                                    </div> : 
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                        {isLastAssistant ? latestReply : chat.content}
                                    </ReactMarkdown>
                                }
                            </div>
                        );
                    })
                }
            </div>
        </>
    )
}

export default Chat;