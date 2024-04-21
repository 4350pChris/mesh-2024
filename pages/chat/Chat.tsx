import React, {useState, useRef, useEffect} from "react";
import type {MessageItem} from "../../database/messageItems";
import {getConversationMessages, getConversationSummary, getConversationForUser, appendConversationMessage} from "./Chat.telefunc.js";
import { usePollingEffect } from "../../utils/usePollingEffect";
import { type ConversationItem } from '../../database/conversationItems';

async function loadMessages(conversation_id: string, callback: React.Dispatch<React.SetStateAction<MessageItem[]>>) {
    const messages = await getConversationMessages(conversation_id);
    callback(messages);
}

async function loadSummary(conversation_id: string, callback: React.Dispatch<React.SetStateAction<string>>) {
    const summary = await getConversationSummary(conversation_id);
    callback(summary);
}

export function Chat(props: { conversationId: string }) {
    const {conversationId} = props;
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [summary, setSummary ] = useState('');
    const [draft, setDraft] = useState('');
    const chatRef = useRef<HTMLDivElement>(null);
    const [conversation, setConversation] = useState<ConversationItem | null>(null);

    usePollingEffect(() => {
        getConversationForUser(conversationId).then(setConversation);
        loadSummary(conversationId, setSummary);
        loadMessages(conversationId, setMessages);
    }, [], { interval: 1000 })

    useEffect(() => {
        chatRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
    }, [messages.length])

    return (
        <div className="flex flex-col gap-4" ref={chatRef}>
            {messages.map((message, index) => (
                <div key={index} className={`chat ${message.sender === 'user' ? 'chat-start' : 'chat-end'}`}>
                    <div className="chat-header">
                        {conversation?.id}
                        <time className="ml-2 text-xs opacity-50">{new Date(message.time).toLocaleString()}</time>
                    </div>
                    <div className="chat-bubble">
                        {message.text}
                    </div>
                </div>
            ))}
            <form className="flex gap-2" onSubmit={async (e) => {
                e.preventDefault();
                if (draft === '') return;
                await appendConversationMessage(conversation!, draft, messages);
                setDraft('');
            }}>
                <input type="text" className="flex-1 input input-bordered" value={draft} onChange={(e) => setDraft(e.target.value)} />
                <button type="submit" className="btn">Send</button>
            </form>
        </div>
    );
}
