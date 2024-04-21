import { elevateLevel } from "../../ai/aiMessaging"
import { startClient, sendMessage } from "../../matrix/client"
import { MessageItem, getMessages } from "../../database/messageItems";
import { ConversationItem, getConversation } from "../../database/conversationItems";

export async function startChat() {
  await startClient();
}

export async function getConversationMessages(conversation_id: string) {
  return getMessages(conversation_id);
}

export async function getConversationForUser(conversation_id: string) {
  return getConversation(conversation_id)
}

export async function appendConversationMessage(conversation: ConversationItem, text: string, messages: MessageItem[]) {
  await elevateLevel(messages, conversation)
  return sendMessage(conversation!.roomId, text)
}

export async function getConversationSummary(conversation_id: string) {
  // TODO: ADD THIS SHIT
  return 'This is a test summary of what a customer chat might be summarized as';
}
