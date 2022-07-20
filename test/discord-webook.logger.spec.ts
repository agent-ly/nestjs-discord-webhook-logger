import { beforeEach, describe, it } from "vitest";
import { DiscordWebhookLogger } from "../lib/discord-webhook.logger";

describe("DiscordWebhookLogger", () => {
  let logger: DiscordWebhookLogger;

  beforeEach(() => {
    logger = new DiscordWebhookLogger(
      process.env.WEBHOOK_URL,
      process.env.WEBHOOK_USERNAME,
      process.env.WEBHOOK_AVATAR_URL
    );
  });

  it("should log a message", async () => {
    await logger.log("Hello World!");
    await logger.error("Goodbye World!");
    await logger.warn("Goodmorning, World!");
    await logger.debug("Goodafternoon, World!");
  });

  it("Should log a fully featued message", async () => {
    await logger.log("You have two new pending tasks", {
      title: "Pending Tasks",
      fields: [
        { name: "Task 1", value: "This is a task", inline: true },
        { name: "Task 2", value: "This is another task", inline: true },
      ],
      author: {
        name: "John Doe",
      },
      footer: {
        text: "This is a footer",
      },
      timestamp: true,
    });
  });
});
