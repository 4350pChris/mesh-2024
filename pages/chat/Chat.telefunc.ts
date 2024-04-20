import {appendMessage, getMessages} from "../../database/messageItems";

export async function getConversationMessages(conversation_id: string) {
  return getMessages(conversation_id);
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
