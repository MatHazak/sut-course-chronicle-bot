import { queryCourse, queryProfessor } from "./queries";

export async function handleCommand(message: any, apiUrl: string, db: D1Database) {
  const chatId = message.chat.id;
  const text = message.text.trim();
  const [command, ...args] = text.split(" ");
  const argText = args.join(" ").trim();

  let reply = "❓ Unknown command. Try /help.";

  switch (command.toLowerCase()) {
    case "/start":
      reply = `👋 *Welcome to SUT Course Chronicle Bot!*\n\nYou can:\n📘 /course [name or code]\n👨‍🏫 /prof [name]\nℹ️ /help`;
      break;

    case "/help":
      reply = `Available commands:\n/course [code or title]\n/prof [professor name]\n/start`;
      break;

    case "/course":
      reply = await queryCourse(db, argText);
      break;

    case "/prof":
      reply = await queryProfessor(db, argText);
      break;
  }

  await fetch(`${apiUrl}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: "Markdown" }),
  });
}
