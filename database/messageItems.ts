import {ConversationItem, ConversationLevel, getConversation, getConversations} from "./conversationItems";

type MessageSender = 'user' | 'bot' | 'human' | 'system';
type MessageItem = { conversation_id: string, text: string, sender: MessageSender, time: number };
// sender: 'user' | 'bot' | 'human' | 'system'
// time: utc time

// Message listeners storage
type MessageListenerCallback = (conversation: ConversationItem) => void;
type MessageListener = {level: ConversationLevel, callback: MessageListenerCallback};

// Message item storge
const messageItems: MessageItem[] = [];
const messageListener: MessageListener[] = [];

// Append a message to the conversation
function appendMessage(message: MessageItem) {
  messageItems.push(message);
  if(message.sender != 'bot') {
    return;
  }
  const conversation: ConversationItem | null = getConversation(message.conversation_id);
  if(conversation == null) {
    return;
  }
  messageListener.forEach(listener => {
    if(listener.level != conversation.level) {
      return;
    }
    listener.callback(conversation);
  });
}

// Retrieve messages from a conversation
function getMessages(conversation_id: string, limit: number=50) {
  let messages: MessageItem[] = messageItems.filter(m => m.conversation_id == conversation_id);
  messages = messages.sort((a, b) => a.time - b.time);
  messages = messages.slice(0, limit);
  return messages;
}

// Register a message listener
function registerListener(level: ConversationLevel, callback: MessageListenerCallback) {
  messageListener.push({
    level,
    callback,
  });
}

export { appendMessage, getMessages };
export type { MessageItem };
