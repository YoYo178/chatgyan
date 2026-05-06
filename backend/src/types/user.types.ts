import mongoose from 'mongoose';

export interface IUser {
    _id: mongoose.Types.ObjectId;

    /** User's full name */
    name: string;

    /** User's username (handle) */
    username: string;

    /** User's email */
    email: string;

    /** User's password hash */
    passwordHash: string;

    /** User's avatar URL */
    avatarURL: string;

    /** The room the user is currently in */
    room: mongoose.Types.ObjectId | null;

    createdAt: number;
    updatedAt: number;
}

export type IPublicUser = Omit<
    IUser,
    'email' |
    'name' |
    'passwordHash' |
    'room' |
    'updatedAt'
>;