import { ModalSubmitInteraction } from "discord.js";
import { BaseModal } from "../../../interfaces";

export default <BaseModal>{
    customId: "test",
    async execute(interaction: ModalSubmitInteraction) {
        await interaction.reply({ content: "You submitted the test modal!", ephemeral: true });
    }
}