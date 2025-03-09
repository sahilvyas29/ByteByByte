// logger.ts
import { createLogger, transports, format } from 'winston';
import { nodeEnv } from '../config';
import { NODE_ENV, LogLevel } from '../constants';

const logDir = 'logs';

const logger = createLogger({
    level: nodeEnv === NODE_ENV.PRODUCTION ? LogLevel.INFO : LogLevel.DEBUG,
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.printf(({ timestamp, level, message, stack }) => {
            const baseMessage = `${timestamp} [${level}]: ${message}`;
            if (level === 'error') {
                const errorOrigin = stack && typeof stack === 'string' ? stack.split('\n')[1].match(/at (\S+) \((.+):(\d+):\d+\)/) : null;
                const functionName = errorOrigin ? errorOrigin[1] : 'unknown';
                const line = errorOrigin ? errorOrigin[3] : 'unknown';
                return `${baseMessage} [function]: ${functionName} [line]: ${line}`;
            }
            return baseMessage;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
        new transports.File({ filename: `${logDir}/combined.log` }),
    ],
});

export { logger };
