import { User } from '../interfaces';
import { userRepo } from '../repositories';
import { logger } from '../utils';

class UserService {
    private readonly repo = userRepo;

    constructor() {}

    async createUser(user: User): Promise<User> {
        try {
            return await this.repo.createUser(user);
        } catch (error: any) {
            logger.error(error);
            throw error;
        }
    }
}

export { UserService };
