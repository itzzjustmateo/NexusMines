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
    "bio": "Founder and main developer of NexusMines.",
    "image": "/staff/d6490171-134d-4ee6-b3f0-f8c884f9c173.png"
  },
  {
    "id": "ijm",
    "name": "ItzzMateo",
    "rank": "Co-Owner",
    "bio": "Co-Owner also a main developer of NexusMines.",
    "image": "/staff/itzzmateo.png"
  },
  {
    "id": "ccethan",
    "name": "CCEThan",
    "rank": "Developer",
    "bio": "Developer of NexusMines",
    "image": "/staff/0eff5505-954e-4c17-92ea-a1849ea4ddad.png"
  },
  {
    "id": "ef4b6629-6fb3-4913-8d5a-afb5f661eb01",
    "name": "ItzzMateo",
    "rank": "Role",
    "bio": "",
    "image": ""
  }
];
