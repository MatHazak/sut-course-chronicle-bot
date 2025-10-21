export default {
  async fetch(request: Request, env: Env) {
    const botToken = env.BOT_TOKEN;
    const apiUrl = `https://api.telegram.org/bot${botToken}`;

    if (request.method === "POST") {
      const update = await request.json();

      const message = update.message;
      if (message?.text) {
        const chatId = message.chat.id;
        const text = message.text;

        await fetch(`${apiUrl}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
          }),
        });
      }

      return new Response("OK");
    }

    return new Response("Bot is running!");
  },
};