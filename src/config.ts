require('dotenv').config();
import config from 'config';
import { NODE_ENV, LogLevel } from './constants';

export const nodeEnv = config.get<NODE_ENV>('nodeEnv');
export const port = config.get<number>('port');
export const host = config.get<string>('host');
export const apiVersion = config.get<string>('apiVersion');
export const logLevel = config.get<LogLevel>('logLevel');
export const dbUri = config.get<string>('dbUri');

export const redis = {
    host: config.get<string>('redisHost'),
    port: config.get<number>('redisPort'),
    username: config.get<string>('redisUsername'),
    password: config.get<string>('redisPassword'),
};
