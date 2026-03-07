// src/data/staff.ts

export type StaffMember = {
  id: string;
  name: string;
  rank: string;
  bio: string;
  image: string;
};

export const staff: StaffMember[] = [
  {
    "id": "draft",
    "name": "DraftierMovie66",
    "rank": "Owner",
    "bio": "Founder of NexusMines.",
    "image": ""
  },
  {
    "id": "ijm",
    "name": "ItzzMateo",
    "rank": "Co-Owner",
    "bio": "Co-Owner and main developer of NexusMines.",
    "image": ""
  },
  {
    "id": "ccethan",
    "name": "CCEThan",
    "rank": "Developer",
    "bio": "Developer of NexusMines",
    "image": ""
  }
];
