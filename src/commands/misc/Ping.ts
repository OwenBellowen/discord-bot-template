import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
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
            .setDescription(`Websocket heartbeat: ${interaction.client.ws.ping}ms`)
            .setColor("Blurple");

        await interaction.reply({ embeds: [embed] });
    }
}