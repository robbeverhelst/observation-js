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
  created_at: string;
  invite_link: string;
  members: GroupMember[];
}

export type GroupSummary = Pick<Group, 'id' | 'name' | 'photo'>; 