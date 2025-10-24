import { queryByCode, queryByProfessor, queryByTitle } from "./queries";
import { BotResponse } from "./helpers";

export async function handleCallback(callback: any, apiUrl: string, db: D1Database) {
    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;
    const data = callback.data; // e.g. "code|23432|84235"

    const [type, term, lastIdStr] = data.split("|");
    const lastId = parseInt(lastIdStr, 10) || null; 

    let reply: BotResponse = { text: "دستور نامشخص." };

    if (type === "code") {
        reply = await queryByCode(db, term, lastId);
    } else if (type === "title") {
        reply = await queryByTitle(db, term, lastId);
    } else if (type === "prof") {
        reply = await queryByProfessor(db, term, lastId);
    }

    await fetch(`${apiUrl}/editMessageReplyMarkup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            reply_markup:  {},
        }),
    });

    await fetch(`${apiUrl}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: reply.text,
            parse_mode: "Markdown",
            reply_markup: reply.keyboard,
        }),
    });
}
