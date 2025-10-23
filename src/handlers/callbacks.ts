import { queryByCode, queryByProfessor, queryByTitle } from "./queries";
import { BotResponse } from "./helpers";

export async function handleCallback(callback: any, apiUrl: string, db: D1Database) {
    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;
    const data = callback.data; // e.g. "courseCode|HIST101|1405"

    const [type, term, lastIdStr] = data.split("|");
    const lastId = parseInt(lastIdStr, 10) || null; // cursor for next page

    let reply: BotResponse = { text: "Unknown action." };

    if (type === "course") {
        reply = await queryByCode(db, term, lastId);
    } else if (type === "title") {
        reply = await queryByTitle(db, term, lastId);
    } else if (type === "prof") {
        reply = await queryByProfessor(db, term, lastId);
    }

    await fetch(`${apiUrl}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: reply.text,
            parse_mode: "Markdown",
            reply_markup: reply.keyboard,
        }),
    });
}
