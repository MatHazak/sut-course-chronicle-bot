import { queryByCode, queryByProfessor, queryByTitle } from "./queries";
import { sanitizeInput, isTooGeneric, BotResponse } from "./helpers";

const HELP_STRING = `روش‌های جستجو:
🔢 /code \\[شمارهٔ درس\]  
📘 /title \\[اسم درس\]  
👨‍🏫 /prof \\[اسم استاد\]`;

export async function handleCommand(message: any, apiUrl: string, db: D1Database) {
  const chatId = message.chat.id;
  const text = message.text.trim();
  const [command, ...args] = text.split(" ");
  const argText = sanitizeInput(args.join(" ").trim());

  let response: BotResponse = { text: "❓ دستور نامشخص." };

  switch (command.toLowerCase()) {
    case "/start":
      response = { text: HELP_STRING };
      break;

    case "/help":
      response = { text: HELP_STRING };
      break;

    case "/code":
      if (isTooGeneric(argText))
        response = { text: "⚠️ شمارهٔ درس معتبر نیست." };
      else
        response = await queryByCode(db, argText, 1);
      break;

    case "/title":
      if (isTooGeneric(argText))
        response = { text: "⚠️ اسم درس باید حداقل ۳ حرف داشته باشد." };
      else
        response = await queryByTitle(db, argText, 1);
      break;

    case "/prof":
      if (isTooGeneric(argText))
        response = { text: "⚠️ اسم استاد باید حداقل ۳ حرف داشته باشد." };
      else
        response = await queryByProfessor(db, argText, 1);
      break;
  }

  await fetch(`${apiUrl}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: response.text,
      parse_mode: "Markdown",
      reply_markup: response.keyboard,
    }),
  });
}
