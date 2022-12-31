import { Message } from "discord.js";
import { CommandHandler } from "./CommandHandler";

export class InputHandler {
  private prefix = ".";
  private cmd = new CommandHandler();

  handleMessage = async (message: Message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(this.prefix)) return;

    const command = message.content.slice(this.prefix.length).split(" ")[0];
    switch (command) {
      case "debug":
        await this.cmd.debugCommand(message);
        break;
      case "p":
      case "play":
        if (message.content.length <= 6) return;
        this.cmd.playCommand(message);
        break;
      case "forceplay":
        this.cmd.forcePlayCommand(message);
        break;
      case "playlist":
        this.cmd.playlistCommand(message);
        break;
      case "q":
      case "queue":
      case "inqueue":
      case "warteschlange":
      case "next":
        this.cmd.queueCommand(message);
        break;
      case "skip":
      case "next":
      case "s":
        this.cmd.skipCommand(message);
        break;
      case "stop":
      case "leave":
      case "quit":
      case "disconnect":
        this.cmd.clearQueueCommand(message);
        break;
      case "say":
        this.cmd.sayCommand(message);
        break;
      case "repo":
        let link = "https://www.github.com/gregorsp/DJ-Frank-Bot";
        message.reply(link);
        break;
      case "random":
      case "r":
        await this.cmd.randomCommand(message);
        break;
      case "i":
        await this.cmd.interpretCommand(message);
        break;
      case "spotify":
        await this.cmd.spotifyCommand(message);
        break;
      default:
        break;
    }
  };
}
