import { ButtonInteraction } from "discord.js";
import { BaseButton } from "../../../interfaces";

export default <BaseButton>{
    customId: "ping",
    async execute(interaction: ButtonInteraction) {
        await interaction.reply({ content: "Pong!", ephemeral: true });
    }
}