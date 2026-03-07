// src/data/admin.ts

export type Admin = {
  id: string;
  username: string;
  passwordHash: string;
};

export const admins: Admin[] = [
  {
    "id": "1",
    "username": "DraftierMovie66",
    "passwordHash": "$2b$10$IC16jQPKF5GJE/YJ40RVs.qtykXVWadwRgxHxg.fZ1p9IFbwAV6.6"
  },
  {
    "id": "2",
    "username": "ItzzMateo",
    "passwordHash": "$2b$10$IC16jQPKF5GJE/YJ40RVs.qtykXVWadwRgxHxg.fZ1p9IFbwAV6.6"
  }
];
