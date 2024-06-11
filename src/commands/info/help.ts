import {
    CommandInteraction,
    AutocompleteInteraction,
    CommandInteractionOptionResolver,
    SlashCommandBuilder,
    EmbedBuilder,

    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,

    StringSelectMenuBuilder,
    RestOrArray,
    APIEmbedField,
} from "discord.js";
import { BaseCommand } from "../../interfaces";
import BotClient from "../../classes/Client";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get a list of all categories, info about a specific command, or all commands in a category.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("all")
                .setDescription("Get a list of all categories with number of commands.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("category")
                .setDescription("Get all commands in a category.")
                .addStringOption((option) =>
                    option
                        .setName("category")
                        .setDescription("The category to get all commands from.")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("command")
                .setDescription("Get information about a specific command.")
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("The command to get information about.")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ),
    config: {
        category: "info",
        usage: "/help [all | category | command]",
        examples: [
            "/help",
            "/help all",
            "/help category fun",
            "/help command ping",
        ],
        permissions: [],
    },
    async execute(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver,
            client = interaction.client as BotClient,
            subcommand = options.getSubcommand();

        if (subcommand === "all") {
            let fields: RestOrArray<APIEmbedField> = [];

            const categories = await client.commandHandler.getAllCategories(true);

            for (const category of categories) {
                const commands = await client.commandHandler.getCommandsByCategory(category);

                fields.push({
                    name: category,
                    value: commands.map(command => `\`${command.name}\``).join(", "),
                    inline: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle("Need help? Here are all the categories and the number of commands in each.")
                .setDescription("Use `/help category <category>` to get all commands in a specific category. Use `/help command <command>` to get information about a specific command.")
                .setColor("Blurple")
                .addFields(fields)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }

        if (subcommand === "category") {
            const category = options.getString("category") as string,
                categoryUpper = category.charAt(0).toUpperCase() + category.slice(1);

            const categories = await client.commandHandler.getAllCategories(true);
            if (!categories.includes(categoryUpper)) {
                return await interaction.reply({ content: "Invalid category!", ephemeral: true });
            }

            const commands = await client.commandHandler.getCommandsByCategory(category);

            if (!commands.length) {
                return await interaction.reply({ content: "No commands found in that category!", ephemeral: true });
            }

            const fields: RestOrArray<APIEmbedField> = [];

            for (const command of commands) {
                fields.push({
                    name: command.name,
                    value: `\`${command.description}\``,
                    inline: false
                });
            }

            if (fields.length > 25) {
                const embed = new EmbedBuilder()
                    .setTitle(`${categoryUpper} Commands`)
                    .setColor("Blurple")
                    .setDescription("This category has too many commands to display in one embed. Please use the `command` subcommand to get information about a specific command.")
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setTitle(`${categoryUpper} Commands`)
                .setColor("Blurple")
                .addFields(fields)

            await interaction.reply({ embeds: [embed] });
        }

        if (subcommand === "command") {
            const commandName = options.getString("command") as string,
                command = await client.commandHandler.getCommand(commandName);

            if (!command) {
                return await interaction.reply({ content: "No command found with that name!", ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle(commandName)
                .setColor("Blurple")
                .setDescription(`**Description:** ${command.data.description}`)
                .addFields([
                    {
                        name: "Category",
                        value: `\`${command.config.category}\``,
                        inline: true
                    },
                    {
                        name: "Usage",
                        value: `\`${command.config.usage ? command.config.usage : "No usage provided."}\``,
                        inline: true
                    },
                    {
                        name: "Examples",
                        value: `\`${command.config.examples && command.config.examples.length ? command.config.examples.join("\n") : "No examples provided."}\``,
                        inline: false
                    }
                ])
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    async autocomplete(interaction: AutocompleteInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver,
            subcommand = options.getSubcommand(),
            command = options.getString("command"),
            category = options.getString("category"),
            client = interaction.client as BotClient;

        if (subcommand === "command") {
            if (command) {
                const commands = client.commands.map((c) => c.data.name);

                const focused = interaction.options.getFocused();
                const filtered = commands.filter(c => c.startsWith(focused));

                if (focused === "") return interaction.respond(commands.map((c) => ({ name: c, value: c })));

                await interaction.respond(
                    filtered.map((c) => ({ name: c, value: c }))
                )
            } else {
                const commands = client.commands.map((c) => c.data.name);
                await interaction.respond(commands.map((c) => ({ name: c, value: c })));
            }
        }

        if (subcommand === "category") {
            if (category) {
                const categories = [...new Set(client.commands.map(command => command.config.category))];

                const focused = interaction.options.getFocused();
                const filtered = categories.filter(c => c.startsWith(focused));

                if (focused === "") return interaction.respond(categories.map((c) => ({ name: c, value: c })));

                await interaction.respond(
                    filtered.map((c) => ({ name: c, value: c }))
                );
            } else {
                const categories = [...new Set(client.commands.map(command => command.config.category))];
                await interaction.respond(categories.map((c) => ({ name: c, value: c })));
            }
        }
    }
}