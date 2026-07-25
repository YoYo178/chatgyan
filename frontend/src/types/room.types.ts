export interface IRoomMember {
  user: string;
  roomRole: 'admin' | 'member';
  joinTimestamp: number;
}

export interface IRoom {
  _id: string;

  /** Room name */
  name: string;

  /** Room type's name (course name or topic name) */
  typeName: string;

  /** Room type */
  type: 'topic' | 'course';

  /** Room code */
  code: string;

  /** Room owner */
  owner: string | null;

  /** Room members array */
  members: IRoomMember[];

  /** Number of members currently in the room */
  memberCount: number;

  /** Room member limit (2 > n > 10) */
  memberLimit: number;

  /** True for system generated rooms */
  isSystemGenerated: boolean;

  /** Room's visibility */
  visibility: 'public' | 'private';

  createdAt: number;
  updatedAt: number;
}

export type IRoomPublicView = Omit<IRoom, 'code' | 'members' | 'messages'>;
