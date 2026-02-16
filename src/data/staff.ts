// src/data/staff.ts

export type StaffMember = {
  id: string;
  name: string;
  rank: string;
  bio: string;
  image: string;
};

export let staff: StaffMember[] = [
  {
    id: "draft",
    name: "DraftierMovie66",
    rank: "Founder",
    bio: "Founder and main developer of NexusMines.",
    image: "/staff/draftiermovie.png",
  },
  {
    id: "ijm",
    name: "ItzzMateo",
    rank: "Co-Founder",
    bio: "Co-Founder and also a main developer of NexusMines.",
    image: "/staff/itzzmateo.png",
  },
  {
    id: "ccethan",
    name: "CCEThan",
    rank: "Developer",
    bio: "Developer of NexusMines",
    image: "/staff/ccethan.png"
  },
];
