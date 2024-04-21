import "dotenv/config";
import * as sdk from "matrix-js-sdk";
import {
  getConversation,
  putConversation,
  type ConversationItem,
} from "../database/conversationItems";
import {
  MessageSender,
  appendMessage,
} from "../database/messageItems";
import { answerMessage } from "../ai/aiMessaging";
import { logger } from "matrix-js-sdk/lib/logger";

logger.disableAll();

const client = sdk.createClient({
  baseUrl: process.env.MATRIX_HOST!,
  userId: process.env.MATRIX_USER_ID,
  accessToken: process.env.MATRIX_ACCESS_TOKEN,
});

let started = false;

async function startClient() {
  if (started) return;

  await client.startClient();
  await backfillMessages();
  receiveMessages();
  console.log("Matrix client started");
  started = true;
}

function closeClient() {
  client.stopClient();
  console.log("Matrix client stopped");
}

async function handleReceivedMessage(
  event: sdk.MatrixEvent,
  room: sdk.Room | undefined,
  doNotAnswer = false
) {
  const eventType = event.getType();
  if (eventType !== "m.room.message") return;

  const roomId = room?.roomId;
  if (!roomId) return;

  const message = event.getContent().body;

  const parsedMsg = parseMessage(message);

  const sender: MessageSender =
    event.getSender() === process.env.MATRIX_USER_ID ? "bot" : "user";

  // TODO: this is a hack as we have no way of mapping different rooms to the same underlying user
  const conversation_id = "customer";

  let convo: ConversationItem | null = getConversation(conversation_id);

  if (!convo) {
    convo = {
      active: true,
      id: conversation_id,
      level: "bot",
      name: "Customer Chat",
    };

    putConversation(convo);
  }

  // Check if we send this to GPT or support I guess?

  appendMessage({
    conversation_id,
    sender,
    text: parsedMsg,
    time: event.getTs(),
  });

  if (doNotAnswer || sender === "bot") return;

  console.log(parsedMsg)

  console.log("-------------\n\nAnswering message\n\n-------------");

  const answer = await answerMessage(convo);

  await sendMessage(roomId, answer.text);
}

/**
 * Mail messages are formatted like from@example.com => to@example.com\n\n# Subject\n\nMessage
 * We want to extract just the message here
 * @param message
 */
function parseMessage(message: string) {
  const parsed = message.split("\n\n");
  if (parsed.length < 3) return message;

  const [senders, subject, ...msg] = parsed;
  if (!senders.includes("@")) return message;
  if (!subject.includes("#")) return message;

  return msg.join("\n");
}

function receiveMessages() {
  client.on(sdk.RoomEvent.Timeline, (event, room, toStartOfTimeline) =>
    handleReceivedMessage(event, room)
  );
}

async function backfillMessages() {
  const noop = () => { }
  client.on(sdk.RoomEvent.Timeline, noop);

  await new Promise<void>((resolve) =>
    setTimeout(() => {
      client.removeAllListeners(sdk.RoomEvent.Timeline)
      console.log("backfilling done")
      resolve()
    }, 5000)
  );

}

async function sendMessage(roomId: string, message: string) {
  const response = await client.sendTextMessage(roomId, message);
  return response.event_id;
}

export { startClient, closeClient, sendMessage };
