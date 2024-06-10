import fs from "fs";
import path from "path";
import BotClient from "./Client";
import { BaseEvent } from "../interfaces";

export default class EventHandler {
    constructor(private client: BotClient) {}

    public async loadEvents() {
        const eventFolders = fs.readdirSync(path.join(__dirname, "..", "events"));

        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(path.join(__dirname, "..", "events", folder)).filter((file) => file.endsWith(".ts"));

            for (const file of eventFiles) {
                const { default: Event }: { default: BaseEvent } = await import(path.join(__dirname, "..", "events", folder, file));

                this.client.events.set(Event.name, Event);

                if (Event.once) {
                    this.client.once(Event.name, (...args) => Event.execute(this.client, ...args));
                } else {
                    this.client.on(Event.name, (...args) => Event.execute(this.client, ...args));
                }
            }
        }
    }
}