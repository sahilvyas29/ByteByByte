import { model, Schema } from 'mongoose';
import { UserDocument } from '../interfaces';
import { COLLECTION_NAME } from '../constants';

const schema = new Schema<UserDocument>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        address: { type: String },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const UserModel = model<UserDocument>(COLLECTION_NAME.USER, schema);
