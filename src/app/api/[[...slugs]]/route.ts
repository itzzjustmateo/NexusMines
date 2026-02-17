// src/app/api/[[...slug]]/route.ts
import { Elysia, t } from "elysia";
import { getSession } from "@/lib/session";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/staff.ts");
const UPLOAD_DIR = path.join(process.cwd(), "public/staff");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const app = new Elysia({ prefix: "/api" })
  .get("/staff", () => {
    try {
      const content = fs.readFileSync(DATA_PATH, "utf-8");
      const match = content.match(/export const staff: StaffMember\[\] = ([\s\S]*);/);
      if (match) {
        let arrayStr = match[1].trim();
        if (arrayStr.endsWith(";")) arrayStr = arrayStr.slice(0, -1);
        
        const staffData = new Function(`return ${arrayStr}`)();
        return staffData;
      }
      return [];
    } catch (e) {
      console.error("Error loading staff:", e);
      return [];
    }
  })
  .post("/staff", async ({ body, set }) => {
    const { staff } = body;

    const session = await getSession();
    if (!session.isLoggedIn) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const fileContent = `// src/data/staff.ts

export type StaffMember = {
  id: string;
  name: string;
  rank: string;
  bio: string;
  image: string;
};

export const staff: StaffMember[] = ${JSON.stringify(staff, null, 2)};
`;

    fs.writeFileSync(DATA_PATH, fileContent);
    return { ok: true };
  }, {
    body: t.Object({
      staff: t.Array(t.Object({
        id: t.String(),
        name: t.String(),
        rank: t.String(),
        bio: t.String(),
        image: t.String()
      }))
    })
  })
  .post("/upload", async ({ body: { file }, set }) => {
    if (!file) {
      set.status = 400;
      return { error: "No file" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.writeFileSync(filePath, buffer);

    return {
      path: `/staff/${fileName}`,
    };
  }, {
    body: t.Object({
      file: t.File()
    })
  });

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
