import type {TodoItem} from "../../database/todoItems";
import React, {useEffect, useState} from "react";
import {MessageItem} from "../../database/messageItems";
import {getConversationMessages, getConversationSummary} from "./Chat.telefunc";

async function loadMessages(conversation_id: string, callback: React.Dispatch<React.SetStateAction<MessageItem[]>>) {
    const messages = await getConversationMessages(conversation_id);
    callback(messages);
}

async function loadSummary(conversation_id: string, callback: React.Dispatch<React.SetStateAction<string>>) {
    const summary = await getConversationSummary(conversation_id);
    callback(summary);
}

export function Chat(props: { [K in string]: string }) {
    const {conversation_id} = props;
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [summary, setSummary ] = useState('');
    const [draft, setDraft] = useState('');

    useEffect(() => {
        const callLoadMessages = () => {
            loadMessages(conversation_id, setMessages);
            setTimeout(callLoadMessages, 1000);
        };
        loadSummary(conversation_id, setSummary);
        callLoadMessages();
    }, []);

    return (
        <div className={'chat'}>

        </div>
    );
}
