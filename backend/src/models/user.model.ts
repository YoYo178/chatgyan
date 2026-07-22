import type { IUser } from '@src/types/user.types.js';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true },

    email: { type: String, required: true },

    passwordHash: { type: String, required: true },

    avatarURL: { type: String, required: false, default: '' },

    course: { type: String, required: false, default: '-' },
    year: { type: String, required: false, default: '-' },

    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  },
  { timestamps: true },
);

// Set the dynamic avatar URL for each user if not set already
//
// This could've been done using the 'default' property in the schema as well
// but in order to get the document ID, we need this pre-save function
userSchema.pre('save', function () {
  if (!this.avatarURL?.length) this.avatarURL = `assets/users/${this._id.toString()}/avatar.jpeg`;
});

export const User = mongoose.model<IUser>('User', userSchema);
