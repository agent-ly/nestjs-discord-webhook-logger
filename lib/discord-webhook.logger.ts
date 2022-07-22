import { Logger, LoggerService } from "@nestjs/common";
import { EmbedBuilder } from "@discordjs/builders";
import type {
  EmbedAuthorOptions,
  EmbedFooterOptions,
  RGBTuple,
} from "@discordjs/builders";
import axios from "axios";

type APIEmbed = ReturnType<EmbedBuilder["toJSON"]>;

export type EmbedColor = number | RGBTuple;

export type WebhookEmbedOptions = {
  fields?: APIEmbed["fields"];
  author?: EmbedAuthorOptions;
  color?: EmbedColor;
  description?: string;
  footer?: EmbedFooterOptions;
  image?: string;
  thumbnail?: string;
  timestamp?: boolean | number | Date;
  title?: string;
  url?: string;
};

export type DefaultColorOptions = {
  log?: EmbedColor;
  warn?: EmbedColor;
  error?: EmbedColor;
  debug?: EmbedColor;
};

const DEFAULT_COLORS = {
  log: 0x00ff00,
  warn: 0xffff00,
  error: 0xff0000,
  debug: 0xff00ff,
};

/**
 * DiscordWebhookLogger
 * @class DiscordWebhookLogger
 * @implements {LoggerService}
 */
export class DiscordWebhookLogger implements LoggerService {
  private readonly logger = new Logger("DiscordWebhookLogger");

  /**
   *
   * @param webhookUrl The webhook url
   * @param webhookUsername The webhook username
   * @param webhookAvatarUrl The webhook avatar url
   * @param defaultColors The default colors to use for each log level
   */
  constructor(
    private readonly webhookUrl: string,
    private readonly webhookUsername?: string,
    private readonly webhookAvatarUrl?: string,
    private readonly defaultColors: DefaultColorOptions = {}
  ) {
    if (!webhookUrl) throw new Error("Webhook URL is required");
    this.defaultColors = { ...DEFAULT_COLORS, ...defaultColors };
  }

  private async post(webhookUrl: string, embed: APIEmbed) {
    try {
      await axios.post(webhookUrl, {
        username: this.webhookUsername,
        avatar_url: this.webhookAvatarUrl,
        embeds: [embed],
      });
      console.log("Successfully sent message to Discord");
      this.logger.debug(`Successfully sent message to ${webhookUrl}`);
    } catch (e) {
      console.error(`Error sending message to Discord: ${e}`);
      this.logger.log(`Error posting to webhook: ${e}`);
    }
  }

  private build(message: string, options: WebhookEmbedOptions) {
    const embed = new EmbedBuilder();
    embed.setDescription(message);
    if (options.fields) embed.setFields(options.fields);
    if (options.author) embed.setAuthor(options.author);
    if (options.color) embed.setColor(options.color);
    if (options.description) embed.setDescription(options.description);
    if (options.footer) embed.setFooter(options.footer);
    if (options.image) embed.setImage(options.image);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.timestamp) {
      if (options.timestamp === true) embed.setTimestamp();
      else embed.setTimestamp(options.timestamp);
    }
    if (options.title) embed.setTitle(options.title);
    if (options.url) embed.setURL(options.url);
    return embed.toJSON();
  }

  log(message: string, options: WebhookEmbedOptions = {}) {
    return this.post(
      this.webhookUrl,
      this.build(message, {
        color: this.defaultColors.log,
        timestamp: true,
        ...options,
      })
    );
  }

  error(message: string, options: WebhookEmbedOptions = {}) {
    return this.post(
      this.webhookUrl,
      this.build(message, {
        color: this.defaultColors.error,
        timestamp: true,
        ...options,
      })
    );
  }

  warn(message: string, options: WebhookEmbedOptions = {}) {
    return this.post(
      this.webhookUrl,
      this.build(message, {
        color: this.defaultColors.warn,
        timestamp: true,
        ...options,
      })
    );
  }

  debug(message: string, options: WebhookEmbedOptions = {}) {
    return this.post(
      this.webhookUrl,
      this.build(message, {
        color: this.defaultColors.debug,
        timestamp: true,
        ...options,
      })
    );
  }
}
