// src/app/api/upload/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = path.join(
    process.cwd(),
    "public",
    "staff",
    fileName,
  );

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({
    path: `/staff/${fileName}`,
  });
}
