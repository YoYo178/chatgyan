import { User } from '@src/models/user.model.js';
import type { IUser } from '@src/types/user.types.js';

const sensitiveUserFields = [
    'passwordHash',
    'name',
    'email',
    'room',
    'updatedAt',
];

const publicUserFilterString = sensitiveUserFields.map(key => `-${key}`).join(' ');

export async function getAllUsers(filter = {}, publicUser?: boolean): Promise<IUser[]> {
    return User.find(filter).select(publicUser ? publicUserFilterString : '-passwordHash').lean().exec();
}

export async function getUser(userId: string, publicUser?: boolean): Promise<IUser | null> {
    return User.findById(userId).select(publicUser ? publicUserFilterString : '-passwordHash').lean().exec();
}

export async function getUserByEmail(email: string, publicUser?: boolean): Promise<IUser | null> {
    return User.findOne({ email }).select(publicUser ? publicUserFilterString : '-passwordHash').lean().exec();
}

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = await User.create(userData);
    return user.toObject();
}

export async function updateUser(userId: string, newUserData: Partial<IUser>, publicUser?: boolean): Promise<IUser | null> {
    return User.findByIdAndUpdate(
        userId,
        { $set: newUserData },
        { new: true, lean: true, select: publicUser ? publicUserFilterString : '-passwordHash' },
    ).exec();
}

export async function deleteUser(userId: string): Promise<IUser | null> {
    return User.findByIdAndDelete(userId).lean().exec();
}

export async function updateUserRoom(userId: string, roomId: string | null, publicUser?: boolean) {
    return User.findByIdAndUpdate(
        userId,
        { $set: { room: roomId } },
        { new: true, lean: true, select: publicUser ? publicUserFilterString : '-passwordHash' },
    ).exec();
}

export function getPublicUser(user: IUser) {
    const publicUser = Object.fromEntries(
        Object.entries(user).filter(([key]) => !sensitiveUserFields.includes(key)),
    ) as Omit<IUser, typeof sensitiveUserFields[number]>;

    return publicUser;
}