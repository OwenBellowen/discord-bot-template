import {
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,

    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder
} from "discord.js";
import { BaseCommand } from "../../interfaces";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    config: {
        category: "misc",
        usage: "",
        examples: [],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("Test command")
            .setDescription("This is a test command!")
            .setColor("Blurple");

        const input = new TextInputBuilder()
            .setCustomId("test")
            .setLabel("Test input")
            .setPlaceholder("Type something here")
            .setMinLength(1)
            .setMaxLength(100)
            .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(input);

        const modal = new ModalBuilder()
            .setCustomId("test")
            .setTitle("Test modal")
            .addComponents(row);

        await interaction.showModal(modal);
    }
}