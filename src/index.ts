import { handleCommand } from "./handlers/commands";
import { handleCallback } from "./handlers/callbacks";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const botToken = env.BOT_TOKEN;
      const apiUrl = `https://api.telegram.org/bot${botToken}`;

      if (request.method === "POST") {
        const update = await request.json();

        if (update.message?.text?.startsWith("/")) {
          await handleCommand(update.message, apiUrl, env.DB);
        } else if (update.callback_query) {
          await handleCallback(update.callback_query, apiUrl, env.DB);
        }

        return new Response("OK");
      }

      return new Response("CourseChronicleBot is running!");
    } catch (err: any) {
      console.error("💥 Uncaught Worker Error:", err?.stack || err);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
