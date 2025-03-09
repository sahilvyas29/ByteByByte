// Desc: Database class to connect and disconnect to MongoDB and Redis

import { MongoDB } from './mongodb';
import { Redis } from './redis';

export class Database {
    private static instance: Database;
    private mongodb: MongoDB;
    private redis: Redis;

    private constructor() {
        this.mongodb = MongoDB.getInstance();
        this.redis = Redis.getInstance();
    }

    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    async connect(): Promise<void> {
        try {
            await this.mongodb.connect();
            await this.redis.connect();
        } catch (error: any) {
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.mongodb.disconnect();
            await this.redis.disconnect();
        } catch (error: any) {
            throw error;
        }
    }
}
