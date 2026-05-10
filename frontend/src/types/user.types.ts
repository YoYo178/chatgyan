export interface IUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatarURL: string;
  room: null | string;
  createdAt: Date;
  updatedAt: Date;
}
