import {
    Awaitable,
    CommandInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    ClientEvents,
    PermissionResolvable,
    AutocompleteInteraction
} from "discord.js";
import BotClient from "../classes/Client";

interface CommandConfig {
    category: string;
    usage?: string;
    examples?: string[];
    permissions?: PermissionResolvable | PermissionResolvable[];
}

export interface BaseCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
        | Omit<SlashCommandSubcommandBuilder, "addSubcommand" | "addSubcommandGroup">
        | Omit<SlashCommandSubcommandGroupBuilder, "addSubcommand" | "addSubcommandGroup">
        | Omit<SlashCommandOptionsOnlyBuilder, "addSubcommand" | "addSubcommandGroup">
        | Omit<SlashCommandSubcommandsOnlyBuilder, "addSubcommand" | "addSubcommandGroup">;
    config: CommandConfig;
    execute: (interaction: CommandInteraction) => Awaitable<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Awaitable<void>;
}

export interface BaseEvent {
    name: keyof ClientEvents;
    once?: boolean;
    execute: (client: BotClient, ...args: ClientEvents[keyof ClientEvents]) => Awaitable<void>;
}