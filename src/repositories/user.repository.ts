import { ObjectId } from 'mongoose';
import { User } from '../interfaces';
import { UserModel } from '../models';

class UserRepository {
    private readonly model = UserModel;

    constructor() {}

    async createUser(user: User): Promise<User> {
        const newUser = new this.model(user);
        return await newUser.save();
    }

    async getUserByAddress(address: string): Promise<User | null> {
        return await this.model.findOne({ address });
    }

    async getUsersByUserId(userId: ObjectId): Promise<User[] | null> {
        return await this.model.find({ _id: userId });
    }
}

export const userRepo = new UserRepository();
