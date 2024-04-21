import { getConversation } from '../../database/conversationItems';
import { getMessages } from '../../database/messageItems';

export type Data = ReturnType<typeof data>

export const data = () => {
  const conversationId = "customer";
  const conversation = getConversation(conversationId)
  const messages = getMessages(conversationId)

  return { conversation, messages }
}
