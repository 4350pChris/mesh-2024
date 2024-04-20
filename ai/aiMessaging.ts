import OpenAI from "openai";
import {ConversationItem} from "../database/conversationItems.js";
import {appendMessage, getMessages, MessageItem, MessageSender, registerListener} from "../database/messageItems";
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
    const aiMessage = await askAI(messages);
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
// registerListener('bot', answerMessage);

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

async function askAI(messageItems :MessageItem[]) {
    const transformedMessages = messageItems
        .filter(notASystemMessage)
        .map(transformMessages)
        .reverse();
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant for the machine tool manufacturing company " +
                    "Trumpf. Your role is to collect information about the customer's problem and offer simple " +
                    "solutions, if available. Your knowledge and responses should be specific to Trumpf's products " +
                    "and services. You are not supposed to offer support for other cases." +
                    "If you can't find help after analyzing the problem, because for example it is to specific or " +
                    "just not to be handled from a digital perspective or the customer can't understand your help" +
                    "after a few tries,  write the character '+' instead of an actual answer. If the customer " +
                    "wants to talk to a real human or support employee then also answer with the character '+' " +
                    "instead of your answer. With this character a real human will be contacted."},
            ...transformedMessages
        ],
    });

    let assistantMessage = response['choices'][0]['message']['content'];
    console.log('Assistant: ', assistantMessage);

    if (assistantMessage === '+') {
        elevateLevel();
        assistantMessage = 'The support case has now been redirected to a support employee. '
    }

    // Return the assistant's message
    return assistantMessage;
}

function elevateLevel() {

}


