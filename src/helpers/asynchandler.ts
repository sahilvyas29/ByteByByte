import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: any, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (execution: AsyncFunction) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(execution(req, res, next)).catch((error) => next(error));
