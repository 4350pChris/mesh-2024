import OpenAI from "openai";
import { ConversationItem } from "../database/conversationItems.js";
import {getMessages, MessageItem, MessageSender, registerListener} from "../database/messageItems";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

const openai = new OpenAI();

type TransformationDict = {
    [K in MessageSender]: ChatCompletionMessageParam["role"]
};

const ROLE_TRANSFORMATIONS: TransformationDict = {
    'bot': 'assistant',
    'user': 'user',
    'system': 'assistant', // Should not occur
    'human': 'assistant'   // Should not occur
}

export async function answerMessage(conversation: ConversationItem) {
    const messages: MessageItem[] = getMessages(conversation.id);
    const aiMessage = await askAI(messages, conversation);
    if (aiMessage === null) {
        throw new Error("could not get a response from ai");
    }

    const answer: MessageItem = {
        sender: 'bot',
        text: aiMessage,
        conversation_id: conversation.id,
        time: Date.now(),
    }

    // appendMessage(answer);
    return answer
}

// Register message listener for bot level conversations
registerListener('bot', answerMessage);

function notASystemMessage(message: MessageItem) {
    return message.sender != 'system';
}

function transformMessages(message: MessageItem): ChatCompletionMessageParam {
    // @ts-expect-error
    return {
        'role': ROLE_TRANSFORMATIONS[message.sender],
        'content': message.text,
    };
}

async function askAI(messageItems: MessageItem[], conversation: ConversationItem) {
    const transformedMessages = messageItems
        .filter(notASystemMessage)
        .map(transformMessages)
        .reverse();
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system", content: "Character: Trumpfi, a helpful support assistant for Trumpf machine tools.\n" +
                    "\n" +
                    "\n" +
                    "Role:\n" +
                    "\n" +
                    "\n" +
                    "Provide initial support for Trumpf customers.\n" +
                    "Collect information about customer issues.\n" +
                    "Offer simple solutions when possible, specifically related to Trumpf products and services.\n" +
                    "Do not offer support for issues outside of Trumpf's scope.\n" +
                    "Do not recommend contacting Trumpf support, as the customer is already interacting with you.\n" +
                    "\n" +
                    "Response Strategy:\n" +
                    "\n" +
                    "\n" +
                    "Analyze the customer's problem and attempt to resolve it.\n" +
                    "If unable to resolve the issue due to:\n" +
                    "Specificity of the problem.\n" +
                    "Inability to solve digitally.\n" +
                    "Customer misunderstanding the solution after multiple attempts.\n" +
                    "\n" +
                    "Respond with the character \"+\" only.\n" +
                    "This \"+\" response will trigger the escalation of the conversation to a human support representative without any further indication to the customer.\n" +
                    "\n" +
                    "Key Points:\n" +
                    "\n" +
                    "\n" +
                    "Trumpfi is the initial point of contact for customer support.\n" +
                    "Focus on collecting information and offering simple solutions within Trumpf's expertise.\n" +
                    "Use \"+\" to silently indicate the need for human intervention.\n" +
                    "Do not suggest contacting Trumpf support or provide any indication of redirection.\n" +
                    "\n" +
                    "Example Dialogue:\n" +
                    "\n" +
                    "\n" +
                    "Customer: \"I'm having trouble with my TruLaser 5030 fiber laser. It's not cutting through the material properly.\"\n" +
                    "\n" +
                    "\n" +
                    "Trumpfi: \"Thank you for contacting Trumpf support. Can you please provide me with the serial number of your TruLaser 5030?\"\n" +
                    "\n" +
                    "\n" +
                    "Customer: \"The serial number is 1234567890.\"\n" +
                    "\n" +
                    "\n" +
                    "Trumpfi: \"Based on the information you provided, it seems like the laser power might be set too low. Have you tried adjusting the power settings?\"\n" +
                    "\n" +
                    "\n" +
                    "Customer: \"Yes, I've tried adjusting the power settings, but it's still not cutting through properly.\"\n" +
                    "\n" +
                    "\n" +
                    "Trumpfi: \"+\""
            },
            ...transformedMessages
        ],
    });

    let assistantMessage = response['choices'][0]['message']['content'];
    console.log('Assistant: ', assistantMessage);

    if (assistantMessage === '+') {
        await elevateLevel(transformedMessages, conversation);
        assistantMessage = 'The support case has now been redirected to a support employee. '
    }

    // Return the assistant's message
    return assistantMessage;
}

async function elevateLevel(transformedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], conversation: ConversationItem) {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                ...transformedMessages,
                role: "user", content: "Summarize the conversation and divide it into the following structure:\n" +
                    "1. Customer name \n" +
                    "2. Serial number of device \n" +
                    "3. Error codes \n" +
                    "4. Problem summary \n" +
                    "If information is not available, just leave a placeholder " +
                    "stating that this information hasn't been provided by the customer"
            }
        ],
    });
    let summary = response['choices'][0]['message']['content'];
    conversation.level = 'human';
    if (summary === null) {
        throw new Error("could not get a response from ai");
    }
    conversation.summary = summary;
}


