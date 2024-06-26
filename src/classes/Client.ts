import { Client, IntentsBitField, Collection } from "discord.js";
import { BaseCommand, BaseEvent, BaseButton, BaseModal, BaseSelectMenu } from "../interfaces";
import { connect } from "mongoose";
import "dotenv/config";

import CommandHandler from "./CommandHandler";
import EventHandler from "./EventHandler";
import InteractionHandler from "./InteractionHandler";
import Logger from "./Logger";
import KVDatabase from "./KVDatabase";

export default class BotClient extends Client<true> {
    public commands: Collection<string, BaseCommand> = new Collection();
    public events: Collection<string, BaseEvent> = new Collection();
    public buttons: Collection<string, BaseButton> = new Collection();
    public selectMenus: Collection<string, BaseSelectMenu> = new Collection();
    public modals: Collection<string, BaseModal> = new Collection();

    public commandHandler: CommandHandler = new CommandHandler(this);
    private eventHandler: EventHandler = new EventHandler(this);
    private interactionHandler: InteractionHandler = new InteractionHandler(this);

    public logger: Logger = new Logger();
    public kvDatabase: KVDatabase = new KVDatabase(this);

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

        // Login to the bot
        this.login(process.env.TOKEN);

        // Load all commands, events, buttons, select menus, and modals
        await this.commandHandler.loadCommands();
        await this.commandHandler.registerCommands();

        await this.eventHandler.loadEvents();

        await this.interactionHandler.loadButtons();
        await this.interactionHandler.loadSelectMenus();
        await this.interactionHandler.loadModals();

        // Connect to MongoDB
        await connect(process.env.MONGO_URI!)
            .then(() => this.logger.success("Connected to MongoDB!"))
            .catch((error) => this.logger.error(`An error occurred while connecting to MongoDB: ${error}`));
    }
}