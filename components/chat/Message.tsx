import type { MessageItem } from "../../database/messageItems";

export default function Message({ message }: { message: MessageItem }) {
  return (
    <div
      className={`chat ${
        message.sender === "user" ? "chat-start" : "chat-end"
      }`}
    >
      <div className="chat-header">
        {message.sender === "user"
          ? "User"
          : message.sender === "bot"
          ? "Bot"
          : "Person"}
        <time className="ml-2 text-xs opacity-50">
          {new Date(message.time).toLocaleString()}
        </time>
      </div>
      <div className="chat-bubble">{message.text}</div>
    </div>
  );
}
