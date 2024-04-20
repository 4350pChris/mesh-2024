type MessageItem = { conversation_id: string, text: string, sender: string, time: number };
// sender: 'user' | 'bot' | 'human'
// time: utc time

const messageItems: MessageItem[] = [];

// Append a message to the conversation
function appendMessage(message: MessageItem) {
  messageItems.push(message);
}

// Retrieve messages from a conversation
function getMessages(conversation_id: string, limit: number=50) {
  let messages: MessageItem[] = messageItems.filter(m => m.conversation_id == conversation_id);
  messages = messages.sort((a, b) => a.time - b.time);
  messages = messages.slice(0, limit);
  return messages;
}

export { appendMessage, getMessages };
export type { MessageItem };
