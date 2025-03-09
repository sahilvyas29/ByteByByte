import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../helpers';
import { logger } from '../utils';
import { SuccessResponse } from '../core';

export class UserController {
    test = asyncHandler(async (req: Request, res: Response) => {
        try {
            const data = 'Hello World';
            return new SuccessResponse('Success', data).send(res);
        } catch (error: any) {
            logger.error(error);
            throw error;
        }
    });
}
