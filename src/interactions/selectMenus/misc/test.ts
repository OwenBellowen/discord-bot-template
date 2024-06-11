import { StringSelectMenuInteraction } from "discord.js";
import { BaseSelectMenu } from "../../../interfaces";

export default <BaseSelectMenu>{
    customId: "test",
    async execute(interaction: StringSelectMenuInteraction) {
        await interaction.reply({ content: "You selected the test option!", ephemeral: true });
    }
}