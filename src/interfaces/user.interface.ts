import { Document, ObjectId } from 'mongoose';

export interface User {
    email: string;
    password: string;
    address?: string;
}

export interface UserDocument extends User, Document {
    id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
