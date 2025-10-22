import { queryByCode, queryByProfessor, queryByTitle } from "./queries";
import { sanitizeInput, isTooGeneric, BotResponse } from "./helpers";

export async function handleCommand(message: any, apiUrl: string, db: D1Database) {
  const chatId = message.chat.id;
  const text = message.text.trim();
  const [command, ...args] = text.split(" ");
  const argText = sanitizeInput(args.join(" ").trim());

  let response: BotResponse = { text: "❓ Unknown command. Try /help."};

  switch (command.toLowerCase()) {
    case "/start":
      response = {
        text: `👋 *Welcome to SUT Course Chronicle Bot!*\n\nYou can:\n
📘 /course [code] – Search by course code  
📗 /title [keywords] – Search by title  
👨‍🏫 /prof [name] – Search by professor  
ℹ️ /help`
      };
      break;

    case "/help":
      response = {
        text: `Available commands:
📘 /course [code]  
📗 /title [keywords]  
👨‍🏫 /prof [name]  
ℹ️ /start`
      };
      break;

    case "/course":
      if (isTooGeneric(argText))
        response = { text: "⚠️ Please enter a valid course code (e.g. `/course HIST101`)."};
      else
        response = await queryByCode(db, argText, 1);
      break;

    case "/title":
      if (isTooGeneric(argText))
        response = { text: "⚠️ Please enter at least 3 letters of the title."};
      else
        response = await queryByTitle(db, argText, 1);
      break;

    case "/prof":
      if (isTooGeneric(argText))
        response = { text: "⚠️ Please enter at least 3 letters of a professor's name."};
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
