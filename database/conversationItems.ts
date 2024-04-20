type ConversationLevel = 'bot' | 'human';
type ConversationItem = { id: string, name: string, level: ConversationLevel, active: boolean, summary?: string};
// level: 'bot' | 'human'
// name: customer name

let messageItems: ConversationItem[] = [];

// Adds a conversation and replaces a previous one, if the id is identical
function putConversation(message: ConversationItem) {
  messageItems = messageItems.filter(m => m.id != message.id);
  messageItems.push(message);
}

// Retrieves all conversations
function getConversations(only_active: boolean=true, limit: number=50) {
  let messages = !only_active ? messageItems : messageItems.filter(m => m.active);
  messages = messages.slice(0, limit);
  return messages;
}

// Gets specific conversations
function getConversation(id: string) {
  const messages = messageItems.filter(m => m.id == id);
  if(messages.length < 1) {
    return null;
  }
  return messages[0];
}

export { putConversation, getConversations, getConversation };
export type { ConversationItem, ConversationLevel };
