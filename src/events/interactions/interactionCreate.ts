import BotClient from "../../classes/Client";
import { BaseEvent } from "../../interfaces";
import { CommandInteraction, Interaction } from "discord.js";

export default <BaseEvent>{
    name: "interactionCreate",
    async execute(client: BotClient, interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction as CommandInteraction);
            } catch (error) {
                client.logger.error(`An error occurred while executing the ${interaction.commandName} command: ${error}`);
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
        }

        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);

            if (!button) return;

            try {
                await button.execute(interaction);
            } catch (error) {
                client.logger.error(`An error occurred while executing the ${interaction.customId} button: ${error}`);
                await interaction.reply({ content: "There was an error while executing this button!", ephemeral: true });
            }
        }

        if (interaction.isStringSelectMenu()) {
            const selectMenu = client.selectMenus.get(interaction.customId);

            if (!selectMenu) return;

            try {
                await selectMenu.execute(interaction);
            } catch (error) {
                client.logger.error(`An error occurred while executing the ${interaction.customId} select menu: ${error}`);
                await interaction.reply({ content: "There was an error while executing this select menu!", ephemeral: true });
            }
        }

        if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);

            if (!modal) return;

            try {
                await modal.execute(interaction);
            } catch (error) {
                client.logger.error(`An error occurred while executing the ${interaction.customId} modal: ${error}`);
                await interaction.reply({ content: "There was an error while executing this modal!", ephemeral: true });
            }
        }

        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);

            if (!command || !command.autocomplete) return;

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                client.logger.error(`An error occurred while executing the ${interaction.commandName} command: ${error}`);
            }
        }
    }
}