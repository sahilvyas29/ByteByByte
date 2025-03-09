import { Router, Request, Response, NextFunction } from 'express';
import { nodeEnv } from '../config';
import { NotFoundError } from '../core';
import { UserRoutes } from '../routes';

export const RegisterApiRoutes = (router: Router, prefix: string): void => {
    router.get(prefix, (req: Request, res: Response) => {
        res.send(`WELCOME MY PROJECT ${nodeEnv.toUpperCase()} ❤`);
    });

    router.use(`${prefix}/test`, new UserRoutes().router);

    router.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError()));
};
