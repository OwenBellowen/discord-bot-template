import { Client, IntentsBitField, Collection } from "discord.js";
import { BaseCommand, BaseEvent } from "../interfaces";
import "dotenv/config";

import CommandHandler from "./CommandHandler";
import EventHandler from "./EventHandler";
import Logger from "./Logger";

export default class BotClient extends Client<true> {
    public commands: Collection<string, BaseCommand> = new Collection();
    public events: Collection<string, BaseEvent> = new Collection();

    public commandHandler: CommandHandler = new CommandHandler(this);
    public eventHandler: EventHandler = new EventHandler(this);

    public logger!: Logger;

    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.DirectMessages,
                IntentsBitField.Flags.DirectMessageReactions,
            ],
        });
    }

    public async start() {
        if (!process.env.TOKEN) {
            throw new Error("No token provided!");
        }

        this.login(process.env.TOKEN);

        await this.commandHandler.loadCommands();
        await this.commandHandler.registerCommands();
        await this.eventHandler.loadEvents();
    }
}