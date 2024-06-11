import {
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,

    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,

    StringSelectMenuBuilder,
} from "discord.js";
import { BaseCommand } from "../../interfaces";

export default <BaseCommand>{
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    config: {
        category: "misc",
        usage: "",
        examples: [],
        permissions: []
    },
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("Pong!")
            .setDescription(`Websocket heartbeat: ${interaction.client.ws.ping}ms\nRoundtrip latency: ${Date.now() - interaction.createdTimestamp}ms`)
            .setColor("Blurple");

        const button = new ButtonBuilder()
            .setCustomId("ping")
            .setLabel("Ping again")
            .setStyle(ButtonStyle.Primary);

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("test")
            .addOptions([
                {
                    label: "Pong!",
                    value: "pong"
                }
            ]);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button);

        const row2 = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        await interaction.reply({
            embeds: [embed],
            components: [row, row2]
        });
    }
}