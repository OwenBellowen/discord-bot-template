import { Schema, model, Document } from 'mongoose';
import BotClient from './Client';

export interface IKVDatabase extends Document {
    key: string;
    value: string;
}

const KVDatabaseSchema = new Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
});

const KVDatabaseModel = model<IKVDatabase>('KVDatabase', KVDatabaseSchema);

/**
 * Represents a key-value database.
 */
export default class KVDatabase {
    /**
     * Creates an instance of KVDatabase.
     * @param {BotClient} client - The bot client.
     */
    constructor(private client: BotClient) {}

    /**
     * Retrieves the value associated with the specified key.
     * @param {string} key - The key to retrieve the value for.
     * @returns {Promise<string | null>} A promise that resolves to the value associated with the key, or null if the key does not exist.
     */
    public async get(key: string): Promise<string | null> {
        const data = await KVDatabaseModel.findOne({ key });

        return data ? data.value : null;
    }

    /**
     * Sets the value for the specified key.
     * @param {string} key - The key to set the value for.
     * @param {string} value - The value to set.
     * @returns {Promise<IKVDatabase | null>} A promise that resolves to the updated database entry, or null if an error occurred.
     */
    public async set(key: string, value: string): Promise<IKVDatabase | null> {
        const data = await KVDatabaseModel.findOneAndUpdate({ key }, { key, value }, { upsert: true });

        return data ? data : null;
    }

    /**
     * Deletes the entry associated with the specified key.
     * @param {string} key - The key to delete.
     * @returns {Promise<boolean>} A promise that resolves to true if the entry was successfully deleted, or false otherwise.
     */
    public async delete(key: string): Promise<boolean> {
        const data = await KVDatabaseModel.findOneAndDelete({ key });

        return data ? true : false;
    }

    /**
     * Clears the entire database.
     * @returns {Promise<boolean>} A promise that resolves to true if the database was successfully cleared, or false otherwise.
     */
    public async clear(): Promise<boolean> {
        const data = await KVDatabaseModel.deleteMany({});

        return data ? true : false;
    }

    /**
     * Retrieves all entries in the database.
     * @returns {Promise<IKVDatabase[]>} A promise that resolves to an array of all entries in the database.
     */
    public async getAll(): Promise<IKVDatabase[]> {
        return await KVDatabaseModel.find();
    }

    /**
     * Checks if the specified key exists in the database.
     * @param {string} key - The key to check.
     * @returns {Promise<boolean>} A promise that resolves to true if the key exists, or false otherwise.
     */
    public async has(key: string): Promise<boolean> {
        return !!(await KVDatabaseModel.findOne({ key }));
    }

    /**
     * Retrieves the number of entries in the database.
     * @returns {Promise<number>} A promise that resolves to the number of entries in the database.
     */
    public async size(): Promise<number> {
        return await KVDatabaseModel.countDocuments();
    }

    /**
     * Filters the entries in the database based on the provided filter function.
     * @param {(value: IKVDatabase, index: number, array: IKVDatabase[]) => unknown} fn - The filter function.
     * @returns {Promise<IKVDatabase[]>} A promise that resolves to an array of entries that pass the filter function.
     */
    public async filter(fn: (value: IKVDatabase, index: number, array: IKVDatabase[]) => unknown): Promise<IKVDatabase[]> {
        const data = await KVDatabaseModel.find();

        return data.filter(fn);
    }

    /**
     * Maps the entries in the database based on the provided mapping function.
     * @param {(value: IKVDatabase, index: number, array: IKVDatabase[]) => unknown} fn - The mapping function.
     * @returns {Promise<unknown[]>} A promise that resolves to an array of values resulting from applying the mapping function to each entry.
     */
    public async map(fn: (value: IKVDatabase, index: number, array: IKVDatabase[]) => unknown): Promise<unknown[]> {
        const data = await KVDatabaseModel.find();

        return data.map(fn);
    }

    /**
     * Reduces the entries in the database based on the provided reducing function.
     * @param {(previousValue: unknown, currentValue: IKVDatabase, currentIndex: number, array: IKVDatabase[]) => unknown} fn - The reducing function.
     * @param {unknown} initialValue - The initial value.
     * @returns {Promise<unknown>} A promise that resolves to the reduced value.
     */
    public async reduce(fn: (previousValue: unknown, currentValue: IKVDatabase, currentIndex: number, array: IKVDatabase[]) => unknown, initialValue: unknown): Promise<unknown> {
        const data = await KVDatabaseModel.find();

        return data.reduce(fn, initialValue);
    }

    /**
     * Executes the provided function once for each entry in the database.
     * @param {(value: IKVDatabase, index: number, array: IKVDatabase[]) => void} fn - The function to execute.
     * @returns {Promise<void>}
     */
    public async forEach(fn: (value: IKVDatabase, index: number, array: IKVDatabase[]) => void): Promise<void> {
        const data = await KVDatabaseModel.find();

        data.forEach(fn);
    }
}