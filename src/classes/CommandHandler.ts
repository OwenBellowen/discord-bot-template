import fs from "fs";
import path from "path";
import BotClient from "./Client";
import { BaseCommand } from "../interfaces";
import { REST, Routes } from "discord.js";

export default class CommandHandler {
    constructor(private client: BotClient) {}

    public async loadCommands() {
        const commandsFolders = fs.readdirSync(path.join(__dirname, "..", "commands"));

        for (const folder of commandsFolders) {
            const commandFiles = fs.readdirSync(path.join(__dirname, "..", "commands", folder)).filter((file) => file.endsWith(".ts"));

            for (const file of commandFiles) {
                const { default: Command }: { default: BaseCommand } = await import(path.join(__dirname, "..", "commands", folder, file));

                this.client.commands.set(Command.data.name, Command);
            }
        }

        this.client.logger.success("Loaded all commands!");
    }

    public async registerCommands() {
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

        const commands = this.client.commands.map((command) => command.data.toJSON());

        try {
            this.client.logger.info("Started refreshing application (/) commands.");
            await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), { body: [] });
            await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), { body: commands });
            this.client.logger.success("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    }
}