import { useState, useRef, useEffect } from "react";
import type { MessageItem } from "../../database/messageItems";
import {
  getConversationMessages,
  getConversationForUser,
  appendConversationMessage,
} from "./Chat.telefunc.js";
import { usePollingEffect } from "../../utils/usePollingEffect";
import { type ConversationItem } from "../../database/conversationItems";
import Summary from "../../components/chat/Summary";
import ChatInput from "../../components/chat/ChatInput";
import Message from "../../components/chat/Message";

export function Chat(props: {
  conversation: ConversationItem | null;
  messages: MessageItem[];
}) {
  const [messages, setMessages] = useState(props.messages);
  const [conversation, setConversation] = useState(props.conversation);

  const chatRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (text: string) => {
    if (!conversation) return;

    return await appendConversationMessage(conversation, text, messages);
  };

  usePollingEffect(
    async () => {
      const convoId = conversation?.id ?? "customer";
      const [convo, msgs] = await Promise.all([
        getConversationForUser(convoId),
        getConversationMessages(convoId),
      ]);

      setConversation(convo);
      setMessages(msgs);
    },
    [],
    { interval: 1000 }
  );

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="flex flex-col gap-4" ref={chatRef}>
      {messages.map((message, index) => (
        <Message message={message} key={index} />
      ))}
      {conversation && conversation.summary && (
        <Summary summary={conversation.summary} />
      )}
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
}
