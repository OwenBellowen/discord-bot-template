import fs from "fs";
import path from "path";
import BotClient from "./Client";
import { BaseButton, BaseModal, BaseSelectMenu } from "../interfaces";

export default class InteractionHandler {
    private interactionFolder = path.join(__dirname, "..", "interactions");
    constructor(private client: BotClient) {}

    public async loadButtons() {
        const buttonFolders = fs.readdirSync(path.join(this.interactionFolder, "buttons"));

        for (const folder of buttonFolders) {
            const buttonFiles = fs.readdirSync(path.join(this.interactionFolder, "buttons", folder)).filter((file) => file.endsWith(".ts"));

            for (const file of buttonFiles) {
                const { default: Button }: { default: BaseButton } = await import(path.join(this.interactionFolder, "buttons", folder, file));

                this.client.buttons.set(Button.customId, Button);
            }
        }

        this.client.logger.success("Loaded all buttons!");
    }

    public async loadSelectMenus() {
        const selectMenuFolders = fs.readdirSync(path.join(this.interactionFolder, "selectMenus"));

        for (const folder of selectMenuFolders) {
            const selectMenuFiles = fs.readdirSync(path.join(this.interactionFolder, "selectMenus", folder)).filter((file) => file.endsWith(".ts"));

            for (const file of selectMenuFiles) {
                const { default: SelectMenu }: { default: BaseSelectMenu } = await import(path.join(this.interactionFolder, "selectMenus", folder, file));

                this.client.selectMenus.set(SelectMenu.customId, SelectMenu);
            }
        }

        this.client.logger.success("Loaded all select menus!");
    }

    public async loadModals() {
        const modalFolders = fs.readdirSync(path.join(this.interactionFolder, "modals"));

        for (const folder of modalFolders) {
            const modalFiles = fs.readdirSync(path.join(this.interactionFolder, "modals", folder)).filter((file) => file.endsWith(".ts"));

            for (const file of modalFiles) {
                const { default: Modal }: { default: BaseModal } = await import(path.join(this.interactionFolder, "modals", folder, file));

                this.client.modals.set(Modal.customId, Modal);
            }
        }

        this.client.logger.success("Loaded all modals!");
    }
}