// src/data/admin.ts

export type AdminRole = "owner" | "developer" | "admin";

export type Admin = {
  id: string;
  username: string;
  passwordHash: string;
  roles: AdminRole[];
};

export const admins: Admin[] = [
  {
    "id": "1",
    "username": "DraftierMovie66",
    "passwordHash": "$2b$10$IC16jQPKF5GJE/YJ40RVs.qtykXVWadwRgxHxg.fZ1p9IFbwAV6.6",
    "roles": [
      "admin"
    ]
  },
  {
    "id": "2",
    "username": "ItzzMateo",
    "passwordHash": "$2b$10$mkme5/XZ13/25LJQDlOTWuQsdprT2VMToJrpYtR10XgAZWv.eEtkq",
    "roles": [
      "owner",
      "developer"
    ]
  }
];
