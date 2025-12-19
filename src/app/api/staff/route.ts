// src/app/api/staff/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/staff.ts");
const ADMIN_PASSWORD = process.env.NEXT_ADMIN_PASSWORD;

export async function POST(req: Request) {
  const { password, staff } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const file = `
export type StaffMember = {
  id: string;
  name: string;
  rank: string;
  bio: string;
  image: string;
};

export let staff = ${JSON.stringify(staff, null, 2)};
`;

  fs.writeFileSync(DATA_PATH, file);

  return NextResponse.json({ ok: true });
}
