import { Router, Request, Response, NextFunction } from 'express';
import { ApiError, InternalError, BadRequestError } from '../core';
import { nodeEnv } from '../config';
import { NODE_ENV } from '../constants';
import { BadRequestResponse } from '../core/apiresponse';

export const RegisterErrorHandler = (router: Router): void => {
    // Main error handling middleware
    router.use((error: any, req: Request, res: Response, next: NextFunction) => {
        const isProduction = nodeEnv === NODE_ENV.PRODUCTION;

        handleError(error, res, isProduction);
    });
};

const handleError = (error: any, res: Response, isProduction: boolean): void => {
    if (error instanceof ApiError) {
        ApiError.handle(error, res);
        return;
    }

    const errorHandlers = {
        SyntaxError: handleSyntaxError,
        CastError: handleCastError,
        ValidationError: handleValidationError,
        MongoError: handleMongoError,
        Default: handleDefaultError,
    };

    const handler = errorHandlers[error.name as keyof typeof errorHandlers] || errorHandlers.Default;
    handler(error, res, isProduction);
};

const handleSyntaxError = (error: SyntaxError, res: Response): void => {
    if (error.message.endsWith('is not valid JSON')) {
        new BadRequestResponse('Invalid JSON body').send(res);
        return;
    }
    handleDefaultError(error, res);
};

const handleCastError = (error: any, res: Response): void => {
    ApiError.handle(new BadRequestError(`Invalid Id, ${error.reason}`), res);
};

const handleValidationError = (error: any, res: Response): void => {
    const errorMessages = Object.values(error.errors).map((errorObj: any) => {
        const errorTypes = {
            Number: `${errorObj.path} must be a number`,
            ObjectId: `${errorObj.value} is not a valid value for the ${errorObj.path} field`,
            required: errorObj.message,
            enum: `${errorObj.value} is not a valid value for ${errorObj.path}`,
        };
        return errorTypes[errorObj.kind as keyof typeof errorTypes] || 'Invalid body!';
    });

    ApiError.handle(new BadRequestError(errorMessages.join(', ')), res);
};

const handleMongoError = (error: any, res: Response, isProduction: boolean): void => {
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value =
            !isProduction && error.keyValue[field]
                ? typeof error.keyValue[field] === 'object'
                    ? ` ${JSON.stringify(error.keyValue[field])}`
                    : ` ${error.keyValue[field]}`
                : '';

        ApiError.handle(new BadRequestError(`${field}${value} already exists`), res);
    }
};

const handleDefaultError = (error: any, res: Response): void => {
    const message = error.message || 'Something went wrong';
    ApiError.handle(new InternalError(message), res);
};
