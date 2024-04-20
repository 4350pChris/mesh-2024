import "dotenv/config"
import * as sdk from "matrix-js-sdk"
import { getConversation, putConversation } from "../database/conversationItems"
import { appendMessage } from "../database/messageItems"

const client = sdk.createClient({
  baseUrl: process.env.MATRIX_HOST!,
  userId: process.env.MATRIX_USER_ID,
  accessToken: process.env.MATRIX_ACCESS_TOKEN,
})

async function startClient() {
  await client.startClient({ initialSyncLimit: 10 })
  receiveMessages()
  console.log("Matrix client started")
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
  if (parsed.length < 3) return

  console.log(parsed)

  const [senders, subject, ...msg] = parsed
  if (!senders.includes("@")) return message
  if (!subject.includes("#")) return message

  return msg.join("\n")
}

function receiveMessages() {
  client.on(sdk.RoomEvent.Timeline, (event, room, toStartOfTimeline) => {
    const eventType = event.getType()
    if (eventType !== "m.room.message") return

    const sender = event.getSender()
    const message = event.getContent().body
    const roomId = room?.roomId

    const parsedMsg = parseMessage(message)

    console.log(`Received message from ${sender} in room ${roomId}: ${parsedMsg}`)
  })
}

async function sendMessage(roomId: string, message: string) {
  const response = await client.sendTextMessage(roomId, message)
  return response.event_id
}

export { startClient, closeClient, sendMessage }
