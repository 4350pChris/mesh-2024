import { startClient } from "../../matrix/client"
import {appendMessage, getMessages} from "../../database/messageItems";
import { getConversation } from "../../database/conversationItems";

export async function startChat() {
  await startClient();
}

export async function getConversationMessages(conversation_id: string) {
  return getMessages(conversation_id);
}

export async function getConversationForUser(conversation_id: string) {
  return getConversation(conversation_id)
}

export async function appendConversationMessage(conversation_id: string, text: string) {
  appendMessage({
    'sender': 'human',
    'time': Date.now(),
    'text': text,
    'conversation_id': conversation_id,
  });
}

export async function getConversationSummary(conversation_id: string) {
  // TODO: ADD THIS SHIT
  return 'This is a test summary of what a customer chat might be summarized as';
}
