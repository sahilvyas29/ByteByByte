// Desc: MongoDB connection class

import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { dbUri } from '../config';

export class MongoDB {
    private static instance: MongoDB;
    private connection: mongoose.Connection;

    private constructor() {
        this.connection = mongoose.connection;
        this.handleEvents();
    }

    static getInstance(): MongoDB {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }

        return MongoDB.instance;
    }

    private handleEvents() {
        this.connection.on('connected', () => {
            logger.info('MongoDB event connected');
        });

        this.connection.on('disconnected', () => {
            logger.info('MongoDB event disconnected');
        });

        this.connection.on('error', (error: any) => {
            logger.error(error);
        });
    }

    async connect(): Promise<void> {
        try {
            await mongoose.connect(dbUri, {
                autoIndex: true,
                connectTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            });
            mongoose.set('strictQuery', true);
        } catch (error: any) {
            logger.error(error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.connection.close(true);
        } catch (error: any) {
            logger.error(error);
            throw error;
        }
    }
}
