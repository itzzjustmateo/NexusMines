// src/app/api/[[...slug]]/route.ts
import { Elysia, t } from "elysia";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/staff.ts");
const RULES_DATA_PATH = path.join(process.cwd(), "src/data/rules.ts");
const CONFIG_DATA_PATH = path.join(process.cwd(), "src/data/config.ts");
const ADMIN_DATA_PATH = path.join(process.cwd(), "src/data/admin.ts");
const UPLOAD_DIR = path.join(process.cwd(), "public/staff");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function readAdmins() {
  try {
    const content = fs.readFileSync(ADMIN_DATA_PATH, "utf-8");
    const match = content.match(/export const admins: Admin\[\] = ([\s\S]*);/);
    if (match) {
      let arrayStr = match[1].trim();
      if (arrayStr.endsWith(";")) arrayStr = arrayStr.slice(0, -1);
      return new Function(`return ${arrayStr}`)() as { id: string; username: string; passwordHash: string }[];
    }
    return [];
  } catch { return []; }
}

function writeAdmins(admins: { id: string; username: string; passwordHash: string }[]) {
  const fileContent = `// src/data/admin.ts

export type Admin = {
  id: string;
  username: string;
  passwordHash: string;
};

export const admins: Admin[] = ${JSON.stringify(admins, null, 2)};
`;
  fs.writeFileSync(ADMIN_DATA_PATH, fileContent);
}

const app = new Elysia({ prefix: "/api" })
  .get("/auth/status", async () => {
    const session = await getSession();
    return { isLoggedIn: session.isLoggedIn, username: session.username || null };
  })
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
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
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
      staff: t.Array(t.Object({ id: t.String(), name: t.String(), rank: t.String(), bio: t.String(), image: t.String() }))
    })
  })
  // ─── Rules ───
  .get("/rules", () => {
    try {
      const content = fs.readFileSync(RULES_DATA_PATH, "utf-8");
      const match = content.match(/export const rules: Rule\[\] = ([\s\S]*);/);
      if (match) {
        let arrayStr = match[1].trim();
        if (arrayStr.endsWith(";")) arrayStr = arrayStr.slice(0, -1);
        const rulesData = new Function(`return ${arrayStr}`)();
        return rulesData;
      }
      return [];
    } catch (e) {
      console.error("Error loading rules:", e);
      return [];
    }
  })
  .post("/rules", async ({ body, set }) => {
    const { rules } = body;
    const session = await getSession();
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
    const fileContent = `// src/data/rules.ts

export type Rule = {
  id: string;
  title: string;
  desc: string;
  icon?: string;
};

export const rules: Rule[] = ${JSON.stringify(rules, null, 2)};
`;
    fs.writeFileSync(RULES_DATA_PATH, fileContent);
    return { ok: true };
  }, {
    body: t.Object({
      rules: t.Array(t.Object({ id: t.String(), title: t.String(), desc: t.String(), icon: t.Optional(t.String()) }))
    })
  })
  // ─── Config ───
  .get("/config", () => {
    try {
      const content = fs.readFileSync(CONFIG_DATA_PATH, "utf-8");
      const match = content.match(/export const config: ServerConfig = ([\s\S]*);/);
      if (match) {
        let objStr = match[1].trim();
        if (objStr.endsWith(";")) objStr = objStr.slice(0, -1);
        const configData = new Function(`return ${objStr}`)();
        return configData;
      }
      return { javaIp: "", bedrockIp: "", javaPort: 25565, bedrockPort: 19132 };
    } catch (e) {
      console.error("Error loading config:", e);
      return { javaIp: "", bedrockIp: "", javaPort: 25565, bedrockPort: 19132 };
    }
  })
  .post("/config", async ({ body, set }) => {
    const session = await getSession();
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
    const fileContent = `// src/data/config.ts

export type ServerConfig = {
  javaIp: string;
  bedrockIp: string;
  javaPort: number;
  bedrockPort: number;
};

export const config: ServerConfig = ${JSON.stringify(body.config, null, 2)};
`;
    fs.writeFileSync(CONFIG_DATA_PATH, fileContent);
    return { ok: true };
  }, {
    body: t.Object({
      config: t.Object({ javaIp: t.String(), bedrockIp: t.String(), javaPort: t.Number(), bedrockPort: t.Number() })
    })
  })
  // ─── Admins ───
  .get("/admins", async ({ set }) => {
    const session = await getSession();
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
    const admins = readAdmins();
    return admins.map(a => ({ id: a.id, username: a.username }));
  })
  .post("/admins", async ({ body, set }) => {
    const session = await getSession();
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
    const admins = readAdmins();
    const hash = await bcrypt.hash(body.password, 10);
    const newAdmin = { id: crypto.randomUUID(), username: body.username, passwordHash: hash };
    admins.push(newAdmin);
    writeAdmins(admins);
    return { ok: true, id: newAdmin.id };
  }, {
    body: t.Object({ username: t.String(), password: t.String() })
  })
  .delete("/admins/:id", async ({ params, set }) => {
    const session = await getSession();
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
    let admins = readAdmins();
    if (admins.length <= 1) { set.status = 400; return { error: "Cannot delete the last admin" }; }
    admins = admins.filter(a => a.id !== params.id);
    writeAdmins(admins);
    return { ok: true };
  })
  // ─── Upload ───
  .post("/upload", async ({ body: { file }, set }) => {
    if (!file) { set.status = 400; return { error: "No file" }; }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);
    return { path: `/staff/${fileName}` };
  }, {
    body: t.Object({ file: t.File() })
  });

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
