// Desc: Redis client for caching

import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';
import { redis } from '../config';

export class Redis {
    private static instance: Redis;
    private client: RedisClientType;
    private readonly PING_INTERVAL = 5000;
    private readonly CONNECTION_TIMEOUT = 30000;

    private constructor() {
        this.client = createClient({
            socket: {
                host: redis.host,
                port: redis.port,
                connectTimeout: this.CONNECTION_TIMEOUT,
                reconnectStrategy: (times: number) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
            },
            password: redis.password,
            pingInterval: this.PING_INTERVAL,
        });

        this.handleEvents();
    }

    static getInstance(): Redis {
        if (!Redis.instance) {
            Redis.instance = new Redis();
        }

        return Redis.instance;
    }

    private handleEvents() {
        this.client.on('connect', () => {
            logger.info('Redis event connected');
        });

        this.client.on('reconnecting', () => {
            logger.info('Redis event reconnecting');
        });

        this.client.on('end', () => {
            logger.info('Redis event end');
        });

        this.client.on('error', (error: any) => {
            logger.error(error);
        });
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
        } catch (error: any) {
            logger.error(error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.quit();
        } catch (error: any) {
            logger.error(error);
            throw error;
        }
    }

    getClient(): RedisClientType {
        return this.client;
    }
}
