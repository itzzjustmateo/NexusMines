// src/app/api/[[...slug]]/route.ts
import { Elysia, t } from "elysia";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

const DATA_PATH = path.join(process.cwd(), "src/data/staff.ts");
const RULES_DATA_PATH = path.join(process.cwd(), "src/data/rules.ts");
const ADMIN_DATA_PATH = path.join(process.cwd(), "src/data/admin.ts");
const BLOG_DATA_PATH = path.join(process.cwd(), "src/data/blog.ts");
const UPLOAD_DIR = path.join(process.cwd(), "public/staff");

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  publishedAt: string;
  tags: string[];
};

const db = mysql.createPool({
  host: "panel.devflare.de",
  port: 3306,
  user: "u3_onTMMeUESm",
  password: "y2^zK=cbs2L42AJUDuDw0MkX",
  database: "s3_nexusmines_web",
});

async function getConfigFromDb() {
  try {
    await db.execute("CREATE TABLE IF NOT EXISTS config (id INT PRIMARY KEY DEFAULT 1, javaIp VARCHAR(255), bedrockIp VARCHAR(255), javaPort INT, bedrockPort INT)");
    const [rows] = await db.execute("SELECT * FROM config LIMIT 1");
    const config = rows as { javaIp: string; bedrockIp: string; javaPort: number; bedrockPort: number }[];
    if (config.length > 0 && config[0].javaIp) {
      return config[0];
    }
    const defaultConfig = { javaIp: "nexusmines.minekeep.gg", bedrockIp: "nexusmines.bedrock.minekeep.gg", javaPort: 25565, bedrockPort: 19132 };
    await db.execute("INSERT INTO config (id, javaIp, bedrockIp, javaPort, bedrockPort) VALUES (1, ?, ?, ?, ?)", 
      [defaultConfig.javaIp, defaultConfig.bedrockIp, defaultConfig.javaPort, defaultConfig.bedrockPort]);
    return defaultConfig;
  } catch (e) {
    console.error("Error loading config from DB:", e);
    return { javaIp: "nexusmines.minekeep.gg", bedrockIp: "nexusmines.bedrock.minekeep.gg", javaPort: 25565, bedrockPort: 19132 };
  }
}

async function saveConfigToDb(config: { javaIp: string; bedrockIp: string; javaPort: number; bedrockPort: number }) {
  await db.execute("UPDATE config SET javaIp = ?, bedrockIp = ?, javaPort = ?, bedrockPort = ?", 
    [config.javaIp, config.bedrockIp, config.javaPort, config.bedrockPort]);
}

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
  // ─── Rules (Categories) ───
  .get("/rules", () => {
    try {
      const content = fs.readFileSync(RULES_DATA_PATH, "utf-8");
      const match = content.match(/export const rules: RuleCategory\[\] = ([\s\S]*);/);
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
    const fileContent = `export type Rule = {
  id: string;
  title: string;
  desc: string;
  icon?: string;
};

export type RuleCategory = {
  id: string;
  title: string;
  icon: string;
  rules: Rule[];
};

export const rules: RuleCategory[] = ${JSON.stringify(rules, null, 2)};
`;
    fs.writeFileSync(RULES_DATA_PATH, fileContent);
    return { ok: true };
  }, {
    body: t.Object({
      rules: t.Array(t.Object({
        id: t.String(),
        title: t.String(),
        icon: t.String(),
        rules: t.Array(t.Object({ id: t.String(), title: t.String(), desc: t.String(), icon: t.Optional(t.String()) }))
      }))
    })
  })
  // ─── Config ───
  .get("/config", async () => {
    return await getConfigFromDb();
  })
  .post("/config", async ({ body, set }) => {
    const session = await getSession();
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
    try {
      await saveConfigToDb(body.config);
      return { ok: true };
    } catch (e) {
      console.error("Error saving config:", e);
      return { error: "Failed to save config" };
    }
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
  })
  // ─── Staff Application ───
  .post("/apply", async ({ body, set }) => {
    const { discordUsername, minecraftUsername, age, experience, whyJoin, role } = body;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      set.status = 500;
      return { error: "Webhook not configured" };
    }
    const embed = {
      embeds: [{
        title: "📝 New Staff Application",
        color: 5763714,
        fields: [
          { name: "Discord", value: discordUsername, inline: true },
          { name: "Minecraft", value: minecraftUsername, inline: true },
          { name: "Age", value: age, inline: true },
          { name: "Role Applied", value: role, inline: true },
          { name: "Experience", value: experience, inline: false },
          { name: "Why Join", value: whyJoin, inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "NexusMines Staff Application" },
      }],
    };
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed),
      });
      return { ok: true };
    } catch (e) {
      console.error("Error sending webhook:", e);
      return { error: "Failed to submit application" };
    }
  }, {
    body: t.Object({
      discordUsername: t.String(),
      minecraftUsername: t.String(),
      age: t.String(),
      experience: t.String(),
      whyJoin: t.String(),
      role: t.String(),
    })
  })
  // ─── Blog ───
  .get("/blog", () => {
    try {
      const content = fs.readFileSync(BLOG_DATA_PATH, "utf-8");
      const match = content.match(/export const blogPosts: BlogPost\[\] = ([\s\S]*);/);
      if (match) {
        let arrayStr = match[1].trim();
        if (arrayStr.endsWith(";")) arrayStr = arrayStr.slice(0, -1);
        const blogData = new Function(`return ${arrayStr}`)();
        return blogData;
      }
      return [];
    } catch (e) {
      console.error("Error loading blog posts:", e);
      return [];
    }
  })
  .post("/blog", async ({ body, set }) => {
    const session = await getSession();
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
    const { slug, title, excerpt, content, coverImage, author, publishedAt, tags } = body;
    try {
      const existingContent = fs.readFileSync(BLOG_DATA_PATH, "utf-8");
      const match = existingContent.match(/export const blogPosts: BlogPost\[\] = ([\s\S]*);/);
      let posts: BlogPost[] = [];
      if (match) {
        let arrayStr = match[1].trim();
        if (arrayStr.endsWith(";")) arrayStr = arrayStr.slice(0, -1);
        posts = new Function(`return ${arrayStr}`)();
      }
      const newPost: BlogPost = {
        slug: slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        title,
        excerpt,
        content,
        coverImage: coverImage || "",
        author: author || "NexusMines Team",
        publishedAt: publishedAt || new Date().toISOString().split("T")[0],
        tags: tags || []
      };
      const existingIndex = posts.findIndex(p => p.slug === newPost.slug);
      if (existingIndex >= 0) {
        posts[existingIndex] = newPost;
      } else {
        posts.unshift(newPost);
      }
      const fileContent = `export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  publishedAt: string;
  tags: string[];
};

export const blogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};
`;
      fs.writeFileSync(BLOG_DATA_PATH, fileContent);
      return { ok: true };
    } catch (e) {
      console.error("Error saving blog post:", e);
      return { error: "Failed to save blog post" };
    }
  }, {
    body: t.Object({
      slug: t.Optional(t.String()),
      title: t.String(),
      excerpt: t.String(),
      content: t.String(),
      coverImage: t.Optional(t.String()),
      author: t.Optional(t.String()),
      publishedAt: t.Optional(t.String()),
      tags: t.Optional(t.Array(t.String()))
    })
  })
  .delete("/blog/:slug", async ({ params, set }) => {
    const session = await getSession();
    if (!session.isLoggedIn) { set.status = 401; return { error: "Unauthorized" }; }
    try {
      const content = fs.readFileSync(BLOG_DATA_PATH, "utf-8");
      const match = content.match(/export const blogPosts: BlogPost\[\] = ([\s\S]*);/);
      if (!match) { set.status = 404; return { error: "No posts found" }; }
      let arrayStr = match[1].trim();
      if (arrayStr.endsWith(";")) arrayStr = arrayStr.slice(0, -1);
      let posts: BlogPost[] = new Function(`return ${arrayStr}`)();
      posts = posts.filter(p => p.slug !== params.slug);
      const fileContent = `export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  publishedAt: string;
  tags: string[];
};

export const blogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};
`;
      fs.writeFileSync(BLOG_DATA_PATH, fileContent);
      return { ok: true };
    } catch (e) {
      console.error("Error deleting blog post:", e);
      return { error: "Failed to delete blog post" };
    }
  });

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;

export type Api = typeof app;
