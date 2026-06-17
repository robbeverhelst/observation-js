export interface GroupMember {
  id: number;
  name: string;
  avatar: string | null;
  role: 'admin' | 'member';
}

export interface Group {
  id: number;
  name: string;
  photo: string;
  /** Timestamp of creation. Absent from detail and join responses. */
  created_at?: string;
  /** URL to let another user join this group. Absent from detail and join responses. */
  invite_link?: string;
  members: GroupMember[];
}

export type GroupSummary = Pick<Group, 'id' | 'name' | 'photo'>;
