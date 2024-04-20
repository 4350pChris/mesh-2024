import "dotenv/config"
import * as sdk from "matrix-js-sdk"
import { getConversation, putConversation, type ConversationItem } from "../database/conversationItems"
import { appendMessage } from "../database/messageItems"
import { answerMessage } from '../ai/aiMessaging'

const client = sdk.createClient({
  baseUrl: process.env.MATRIX_HOST!,
  userId: process.env.MATRIX_USER_ID,
  accessToken: process.env.MATRIX_ACCESS_TOKEN,
})

let started = false

async function startClient() {
  if (started) return
  await client.startClient()
  receiveMessages()
  console.log("Matrix client started")
  started = true
}

function closeClient() {
  client.stopClient()
  console.log("Matrix client stopped")
}

/**
 * Mail messages are formatted like from@example.com => to@example.com\n\n# Subject\n\nMessage
 * We want to extract just the message here
 * @param message 
 */
function parseMessage(message: string) {
  const parsed = message.split("\n\n");
  if (parsed.length < 3) return message

  const [senders, subject, ...msg] = parsed
  if (!senders.includes("@")) return message
  if (!subject.includes("#")) return message

  return msg.join("\n")
}

function receiveMessages() {
  client.on(sdk.RoomEvent.Timeline, async (event, room, toStartOfTimeline) => {
    const eventType = event.getType()
    const roomId = room?.roomId
    if (eventType !== "m.room.message") return
    if (!roomId) return

    const sender = event.getSender()
    const message = event.getContent().body

    const parsedMsg = parseMessage(message)
    const userId = "customer"

    console.log(`Received message from ${sender} in room ${roomId}: ${parsedMsg}`)

    let convo: ConversationItem | null = getConversation(userId)

    if (!convo) {
      convo = {
        active: true,
        id: userId,
        level: "bot",
        name: sender!,
      }

      putConversation(convo)
    }

    // Check if we send this to GPT or support I guess?

    appendMessage({
      conversation_id: convo.id,
      sender: "user",
      text: parsedMsg,
      time: Date.now(),
    })

    const answer = await answerMessage(convo)

    await sendMessage(roomId, answer.text)

    // appendMessage(answer)
  })
}

async function sendMessage(roomId: string, message: string) {
  const response = await client.sendTextMessage(roomId, message)
  return response.event_id
}

export { startClient, closeClient, sendMessage }
