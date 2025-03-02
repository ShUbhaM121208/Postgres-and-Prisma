import { Client } from 'pg';

export async function getClient() {
    const client = new Client("postgresql://db_owner:npg_1VkoUFYvG0fJ@ep-still-snow-a8co0oms-pooler.eastus2.azure.neon.tech/db?sslmode=require");
    await client.connect();
    return client;
}