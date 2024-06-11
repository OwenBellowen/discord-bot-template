import BotClient from "../../classes/Client";
import { BaseEvent } from "../../interfaces";

export default <BaseEvent>{
    name: "ready",
    once: true,
    async execute(client: BotClient) {
        client.logger.info(`Logged in as ${client.user.username}`);
    }
}