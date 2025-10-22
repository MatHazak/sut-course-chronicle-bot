import { handleCommand } from "./handlers/commands";

export default {
  async fetch(request: Request, env: Env) {
    const botToken = env.BOT_TOKEN;
    const apiUrl = `https://api.telegram.org/bot${botToken}`;

    if (request.method === "POST") {
      const update = await request.json();
      const message = update.message;

      // Only handle messages starting with "/"
      if (message?.text?.startsWith("/")) {
        await handleCommand(message, apiUrl, env.DB);
      }

      return new Response("OK");
    }

    return new Response("CourseChronicleBot is running!");
  },
};
