"use client";

import { useState, useEffect, useCallback, useMemo, useRef, forwardRef, memo } from "react";
import { useQueryState } from "nuqs";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import {
  Trash, Loader2, Plus, Save,
  Users, ShieldCheck, Server, KeyRound,
  ShieldAlert, UserCheck, BugOff, MegaphoneOff, Gavel, AlertCircle,
  Clock, Heart, Star, Zap, Hammer, Lock, MessageSquare, Globe, Ghost, Sword, Axe,
  RefreshCw, Eye, EyeOff, Copy, FileText,
  Monitor, Wifi, ArrowLeft, Home, Gamepad2, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "../login/actions";
import {
  Combobox, ComboboxInput, ComboboxContent,
  ComboboxList, ComboboxItem, ComboboxEmpty,
} from "@/components/ui/combobox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

// ─────────────────── Types ───────────────────

type AdminRole = "owner" | "developer" | "admin";

type StaffMember = { id: string; name: string; rank: string; bio: string; image: string };
type Rule = { id: string; title: string; desc: string; icon?: string };
type RuleCategory = { id: string; title: string; icon: string; rules: Rule[] };
type BlogPost = { slug: string; title: string; excerpt: string; content: string; author: string; publishedAt: string; tags: string[]; coverImage?: string };
type ServerConfig = { javaIp: string; bedrockIp: string; javaPort: number; bedrockPort: number };
type AdminAccount = { id: string; username: string; roles: AdminRole[] };

const ADMIN_ROLES = {
  owner: { label: "Owner", color: "text-red-500", bg: "bg-red-500/10" },
  developer: { label: "Developer", color: "text-purple-500", bg: "bg-purple-500/10" },
  admin: { label: "Admin", color: "text-blue-500", bg: "bg-blue-500/10" },
} as const;

const PERMISSIONS = {
  MANAGE_ADMINS: ["owner", "developer", "admin"] as AdminRole[],
  MANAGE_ROLES: ["owner", "developer", "admin"] as AdminRole[],
  MANAGE_PASSWORD: ["owner", "developer"] as AdminRole[],
} as const;

function hasPermission(userRoles: AdminRole[], permission: keyof typeof PERMISSIONS): boolean {
  return userRoles.some(role => PERMISSIONS[permission].includes(role));
}

// ─────────────────── Helpers ───────────────────

function deepEquals(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function useWarnIfDirty(isDirty: boolean) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}

// ─────────────────── Icon Map ───────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert, UserCheck, BugOff, MegaphoneOff, Gavel, AlertCircle,
  Clock, Heart, Star, Zap, Hammer, Lock, MessageSquare, Globe, Ghost, Sword, Axe,
  Users, Gamepad2,
};
const AVAILABLE_ICONS = Object.keys(ICON_MAP);

const navItems = [
  { id: "staff", label: "Staff", icon: Users },
  { id: "rules", label: "Rules", icon: ShieldCheck },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "vote", label: "Vote", icon: Star },
  { id: "server", label: "Server", icon: Server },
  { id: "accounts", label: "Accounts", icon: KeyRound },
] as const;

// ═══════════════════════════════════════════════
// Admin Layout
// ═══════════════════════════════════════════════

export default function AdminClient({ username, roles }: { username?: string; roles: AdminRole[] }) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "staff",
    shallow: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          {/* Left: Back link & Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <Home className="h-4 w-4" />
            </Link>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />
            <span className="font-bold text-zinc-900 dark:text-white hidden sm:block">Admin</span>
          </div>

          {/* Center: Tabs - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  tab === item.id
                    ? "bg-zinc-900 dark:bg-zinc-700 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium">{navItems.find(n => n.id === tab)?.label}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileMenuOpen && "rotate-180")} />
            </Button>
            
            {/* Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-lg overflow-hidden">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setTab(item.id); setMobileMenuOpen(false); }}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors",
                      tab === item.id
                        ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: User & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">{username}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs sm:text-sm"
              onClick={() => { if (window.confirm("Log out?")) logoutAction(); }}
            >
              <span className="hidden sm:inline">Log out</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {tab === "staff" && <StaffTab />}
        {tab === "rules" && <RulesTab />}
        {tab === "blog" && <BlogTab />}
        {tab === "vote" && <VoteTab />}
        {tab === "server" && <ServerTab />}
        {tab === "accounts" && <AccountsTab userRoles={roles} />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════
// STAFF TAB
// ═══════════════════════════════════════════════

function StaffTab() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [initialStaff, setInitialStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const newMemberRef = useRef<HTMLDivElement | null>(null);
  const isDirty = useMemo(() => !deepEquals(staff, initialStaff), [staff, initialStaff]);
  useWarnIfDirty(isDirty);

  useEffect(() => {
    fetch("/api/staff").then(r => r.json()).then(data => {
      const arr = Array.isArray(data) ? data : [];
      setStaff(arr); setInitialStaff(arr); setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Failed to load staff"); });
  }, []);

  const addMember = useCallback(() => {
    const id = crypto.randomUUID();
    setStaff(prev => [...prev, { id, name: "New Staff", rank: "Role", bio: "", image: "" }]);
    setTimeout(() => newMemberRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  }, []);

  const updateMember = useCallback((id: string, patch: Partial<StaffMember>) => {
    setStaff(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  }, []);

  const deleteMember = useCallback((id: string) => {
    setStaff(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleImageUpload = useCallback(async (file: File, memberId: string) => {
    const previewUrl = URL.createObjectURL(file);
    updateMember(memberId, { image: previewUrl });
    
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      URL.revokeObjectURL(previewUrl);
      updateMember(memberId, { image: data.path });
    } catch { toast.error("Image upload failed"); }
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ staff }) });
      if (!res.ok) throw new Error();
      setInitialStaff(staff);
      toast.success("Staff saved");
    } catch { toast.error("Save failed"); }
    setSaving(false);
  }

  if (loading) return <Skeleton className="h-64 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Staff</h2>
          <p className="text-sm text-zinc-500">Manage staff members</p>
        </div>
        <Button onClick={addMember} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-zinc-500 mb-4">No staff members yet</p>
          <Button variant="outline" size="sm" onClick={addMember}>Add first staff</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {staff.map((member, idx) => (
            <div 
              key={member.id} 
              ref={idx === staff.length - 1 ? newMemberRef : undefined}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            >
              <div className="relative group">
                <img
                  src={member.image || `https://mc-heads.net/avatar/${member.name}/80`}
                  alt={member.name}
                  className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700"
                />
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, member.id);
                    }}
                  />
                  <span className="text-xs text-white font-medium">Change</span>
                </label>
                {member.image && (
                  <button
                    onClick={() => updateMember(member.id, { image: "" })}
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    value={member.name}
                    onChange={e => updateMember(member.id, { name: e.target.value })}
                    placeholder="Name"
                    className="h-8"
                  />
                  <Input
                    value={member.rank}
                    onChange={e => updateMember(member.id, { rank: e.target.value })}
                    placeholder="Rank"
                    className="h-8"
                  />
                </div>
                <Input
                  value={member.bio}
                  onChange={e => updateMember(member.id, { bio: e.target.value })}
                  placeholder="Bio"
                  className="h-8 mt-2"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 shrink-0"
                onClick={() => { if (window.confirm("Delete?")) deleteMember(member.id); }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isDirty && (
        <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-500">Unsaved changes</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStaff(initialStaff)}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// RULES TAB
// ═══════════════════════════════════════════════

function RulesTab() {
  const [rules, setRules] = useState<RuleCategory[]>([]);
  const [initialRules, setInitialRules] = useState<RuleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const newCategoryRef = useRef<HTMLDivElement | null>(null);
  const isDirty = useMemo(() => !deepEquals(rules, initialRules), [rules, initialRules]);
  useWarnIfDirty(isDirty);

  const CATEGORY_ICONS = ["ShieldAlert", "Gamepad2", "MessageSquare", "Users", "Zap", "Lock", "Globe"];

  useEffect(() => {
    fetch("/api/rules").then(r => r.json()).then(data => {
      const arr = Array.isArray(data) ? data : [];
      setRules(arr); setInitialRules(arr); setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Failed to load rules"); });
  }, []);

  const addCategory = useCallback(() => {
    const id = crypto.randomUUID();
    setRules(prev => [...prev, { id, title: "New Category", icon: "Shield", rules: [] }]);
    setTimeout(() => newCategoryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  }, []);

  const updateCategory = useCallback((id: string, patch: Partial<RuleCategory>) => {
    setRules(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setRules(prev => prev.filter(c => c.id !== id));
  }, []);

  const addRuleToCategory = useCallback((categoryId: string) => {
    const ruleId = crypto.randomUUID();
    setRules(prev => prev.map(c => {
      if (c.id === categoryId) {
        return { ...c, rules: [...c.rules, { id: ruleId, title: "New Rule", desc: "" }] };
      }
      return c;
    }));
  }, []);

  const updateRule = useCallback((categoryId: string, ruleId: string, patch: Partial<Rule>) => {
    setRules(prev => prev.map(c => {
      if (c.id === categoryId) {
        return { ...c, rules: c.rules.map(r => r.id === ruleId ? { ...r, ...patch } : r) };
      }
      return c;
    }));
  }, []);

  const deleteRule = useCallback((categoryId: string, ruleId: string) => {
    setRules(prev => prev.map(c => {
      if (c.id === categoryId) {
        return { ...c, rules: c.rules.filter(r => r.id !== ruleId) };
      }
      return c;
    }));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/rules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rules }) });
      if (!res.ok) throw new Error();
      setInitialRules(rules);
      toast.success("Rules saved");
    } catch { toast.error("Save failed"); }
    setSaving(false);
  }

  if (loading) return <Skeleton className="h-64 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Rules</h2>
          <p className="text-sm text-zinc-500">Manage server rules</p>
        </div>
        <Button onClick={addCategory} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-zinc-500 mb-4">No rule categories yet</p>
          <Button variant="outline" size="sm" onClick={addCategory}>Add first category</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {rules.map((category, idx) => (
            <div 
              key={category.id}
              ref={idx === rules.length - 1 ? newCategoryRef : undefined}
              className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center gap-2 p-3 border-b border-zinc-100 dark:border-zinc-700">
                <Combobox value={category.icon || ""} onValueChange={v => updateCategory(category.id, { icon: v || "ShieldAlert" })}>
                  <div className="relative">
                    <ComboboxInput placeholder="Icon" className="w-24 h-8 pl-8" />
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                      {(() => {
                        const iconKey = CATEGORY_ICONS.includes(category.icon || "") ? category.icon! : "ShieldAlert";
                        const Icon = ICON_MAP[iconKey];
                        return Icon ? <Icon className="h-4 w-4 text-zinc-500" /> : null;
                      })()}
                    </div>
                  </div>
                  <ComboboxContent>
                    <ComboboxList>
                      {CATEGORY_ICONS.map(icon => {
                        const Icon = ICON_MAP[icon];
                        return (
                          <ComboboxItem key={icon} value={icon} className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}{icon}
                          </ComboboxItem>
                        );
                      })}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <Input
                  value={category.title}
                  onChange={e => updateCategory(category.id, { title: e.target.value })}
                  placeholder="Category title"
                  className="flex-1 h-8 font-medium"
                />
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (window.confirm("Delete?")) deleteCategory(category.id); }}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 space-y-2">
                {category.rules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-2">
                    <Input
                      value={rule.title}
                      onChange={e => updateRule(category.id, rule.id, { title: e.target.value })}
                      placeholder="Rule title"
                      className="flex-1 h-8"
                    />
                    <Button variant="ghost" size="sm" className="text-red-500 shrink-0" onClick={() => deleteRule(category.id, rule.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addRuleToCategory(category.id)} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Rule
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDirty && (
        <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-500">Unsaved changes</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setRules(initialRules)}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// SERVER TAB
// ═══════════════════════════════════════════════

function ServerTab() {
  const [config, setConfig] = useState<ServerConfig>({ javaIp: "", bedrockIp: "", javaPort: 25565, bedrockPort: 19132 });
  const [initialConfig, setInitialConfig] = useState<ServerConfig>({ javaIp: "", bedrockIp: "", javaPort: 25565, bedrockPort: 19132 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isDirty = useMemo(() => !deepEquals(config, initialConfig), [config, initialConfig]);
  useWarnIfDirty(isDirty);

  useEffect(() => {
    fetch("/api/config").then(r => r.json()).then(data => {
      setConfig(data); setInitialConfig(data); setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Failed to load config"); });
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config }) });
      if (!res.ok) throw new Error();
      setInitialConfig(config);
      toast.success("Server config saved");
    } catch { toast.error("Save failed"); }
    setSaving(false);
  }

  if (loading) return <Skeleton className="h-96 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <Server className="h-7 w-7 text-brand-accent" />
          Server Configuration
        </h2>
        <Text variant="muted" className="mt-1">Manage your Minecraft server addresses</Text>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Java Edition */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Monitor className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <Text weight="semibold" className="text-lg">Java Edition</Text>
              <Text size="xs" variant="muted">PC/Mac players</Text>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">IP Address</Label>
              <Input
                value={config.javaIp}
                onChange={e => setConfig(c => ({ ...c, javaIp: e.target.value }))}
                placeholder="play.example.com"
                className="h-12 text-base"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Port</Label>
              <Input
                type="number"
                value={config.javaPort}
                onChange={e => setConfig(c => ({ ...c, javaPort: parseInt(e.target.value) || 25565 }))}
                className="h-12"
              />
            </div>
          </div>
        </div>

        {/* Bedrock Edition */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Wifi className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <Text weight="semibold" className="text-lg">Bedrock Edition</Text>
              <Text size="xs" variant="muted">Mobile/Console/PC</Text>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">IP Address</Label>
              <Input
                value={config.bedrockIp}
                onChange={e => setConfig(c => ({ ...c, bedrockIp: e.target.value }))}
                placeholder="bedrock.example.com"
                className="h-12 text-base"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Port</Label>
              <Input
                type="number"
                value={config.bedrockPort}
                onChange={e => setConfig(c => ({ ...c, bedrockPort: parseInt(e.target.value) || 19132 }))}
                className="h-12"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl">
        <div className="flex-1">
          <Text size="sm" variant="muted">
            {isDirty ? "You have unsaved changes" : "All changes saved"}
          </Text>
        </div>
        <Button variant="outline" onClick={() => { setConfig(initialConfig); toast("Changes discarded"); }} disabled={!isDirty}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving || !isDirty}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// VOTE TAB
// ═══════════════════════════════════════════════

type VoteSite = { name: string; href: string; icon: string; color: string; desc: string; enabled: boolean };

function VoteTab() {
  const [voteSites, setVoteSites] = useState<VoteSite[]>([]);
  const [initialVoteSites, setInitialVoteSites] = useState<VoteSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const newSiteRef = useRef<HTMLDivElement | null>(null);
  const isDirty = useMemo(() => !deepEquals(voteSites, initialVoteSites), [voteSites, initialVoteSites]);
  useWarnIfDirty(isDirty);

  useEffect(() => {
    fetch("/api/vote").then(r => r.json()).then(data => {
      const arr = Array.isArray(data) ? data : [];
      setVoteSites(arr); setInitialVoteSites(arr); setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Failed to load vote sites"); });
  }, []);

  const addSite = useCallback(() => {
    setVoteSites(prev => [...prev, { name: "New Site", href: "https://", icon: "Star", color: "text-yellow-500", desc: "", enabled: true }]);
    setTimeout(() => newSiteRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  }, []);

  const updateSite = useCallback((index: number, patch: Partial<VoteSite>) => {
    setVoteSites(prev => prev.map((s, i) => i === index ? { ...s, ...patch } : s));
  }, []);

  const deleteSite = useCallback((index: number) => {
    setVoteSites(prev => prev.filter((_, i) => i !== index));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/vote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ voteSites }) });
      if (!res.ok) throw new Error();
      setInitialVoteSites(voteSites);
      toast.success("Vote sites saved");
    } catch { toast.error("Save failed"); }
    setSaving(false);
  }

  if (loading) return <Skeleton className="h-96 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <Star className="h-7 w-7 text-brand-accent" />
            Vote Sites
          </h2>
          <Text variant="muted" className="mt-1">Manage voting links shown on the vote page</Text>
        </div>
        <Button onClick={addSite} className="gap-2">
          <Plus className="h-4 w-4" /> Add Site
        </Button>
      </div>

      <div className="grid gap-4">
        {voteSites.map((site, index) => (
          <div key={index} ref={index === voteSites.length - 1 ? newSiteRef : null} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Text weight="semibold">Site #{index + 1}</Text>
                <span className={`text-xs px-2 py-0.5 rounded-full ${site.enabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                  {site.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteSite(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Name</Label>
                <Input value={site.name} onChange={e => updateSite(index, { name: e.target.value })} placeholder="Site name" className="h-10" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">URL</Label>
                <Input value={site.href} onChange={e => updateSite(index, { href: e.target.value })} placeholder="https://" className="h-10 font-mono text-sm" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Description</Label>
                <Input value={site.desc} onChange={e => updateSite(index, { desc: e.target.value })} placeholder="Description" className="h-10" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Icon</Label>
                <Combobox value={site.icon || ""} onValueChange={v => updateSite(index, { icon: v || undefined })}>
                  <div className="relative">
                    <ComboboxInput placeholder="Select icon" className="h-10 pl-10" />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {site.icon && ICON_MAP[site.icon] ? (() => {
                        const Icon = ICON_MAP[site.icon];
                        return <Icon className="h-4 w-4 text-zinc-500" />;
                      })() : null}
                    </div>
                  </div>
                  <ComboboxContent>
                    <ComboboxList>
                      {AVAILABLE_ICONS.map(icon => {
                        const Icon = ICON_MAP[icon];
                        return (
                          <ComboboxItem 
                            key={icon} 
                            value={icon}
                            className={site.icon === icon ? "bg-zinc-100 dark:bg-zinc-800" : ""}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{icon}</span>
                          </ComboboxItem>
                        );
                      })}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id={`enabled-${index}`}
                checked={site.enabled}
                onChange={e => updateSite(index, { enabled: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-300"
              />
              <Label htmlFor={`enabled-${index}`} className="text-sm cursor-pointer">Enabled</Label>
            </div>
          </div>
        ))}
      </div>

      {voteSites.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <p>No vote sites configured. Add one to get started.</p>
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl">
        <div className="flex-1">
          <Text size="sm" variant="muted">
            {isDirty ? "You have unsaved changes" : "All changes saved"}
          </Text>
        </div>
        <Button variant="outline" onClick={() => { setVoteSites(initialVoteSites); toast("Changes discarded"); }} disabled={!isDirty}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving || !isDirty}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ACCOUNTS TAB
// ═══════════════════════════════════════════════

function generatePassword(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)), b => chars[b % chars.length]).join("");
}

function AccountsTab({ userRoles }: { userRoles: AdminRole[] }) {
  const canManageAdmins = hasPermission(userRoles, "MANAGE_ADMINS");
  const canManageRoles = hasPermission(userRoles, "MANAGE_ROLES");
  const canManagePassword = hasPermission(userRoles, "MANAGE_PASSWORD");

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRoles, setEditRoles] = useState<AdminRole[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState(() => generatePassword());
  const [newRoles, setNewRoles] = useState<AdminRole[]>(["admin"]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch("/api/admins").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAdmins(data);
      setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Failed to load accounts"); });
  }, []);

  function startEdit(admin: AdminAccount) {
    setEditingId(admin.id);
    setEditUsername(admin.username);
    setEditPassword("");
    setEditRoles([...admin.roles]);
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    try {
      const body: { username?: string; password?: string; roles?: AdminRole[] } = {};
      const currentAdmin = admins.find(a => a.id === editingId);
      if (editUsername !== currentAdmin?.username) body.username = editUsername;
      if (editPassword) body.password = editPassword;
      if (!deepEquals(editRoles.sort(), currentAdmin?.roles.sort())) body.roles = editRoles;

      if (Object.keys(body).length === 0) {
        setEditingId(null);
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/admins/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      
      setAdmins(prev => prev.map(a => 
        a.id === editingId 
          ? { ...a, username: editUsername || a.username, roles: editRoles }
          : a
      ));
      setEditingId(null);
      toast.success("Account updated");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to update account"); }
    setSaving(false);
  }

  async function createAdmin() {
    if (!newUsername.trim()) { toast.error("Username is required"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername.trim(), password: newPassword, roles: newRoles }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAdmins(prev => [...prev, { id: data.id, username: newUsername.trim(), roles: newRoles }]);
      toast.success(`Account created`);
      setNewUsername("");
      setNewPassword(generatePassword());
      setNewRoles(["admin"]);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to create account"); }
    setSaving(false);
  }

  async function deleteAdmin(id: string, name: string) {
    if (!window.confirm(`Delete admin "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAdmins(prev => prev.filter(a => a.id !== id));
      toast.success("Account deleted");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to delete"); }
  }

  if (loading) return <Skeleton className="h-96 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <KeyRound className="h-7 w-7 text-brand-accent" />
            Admin Accounts
          </h2>
          <Text variant="muted" className="mt-1">Manage dashboard access and permissions</Text>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <Text weight="semibold">Existing Accounts</Text>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500">Owner</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500">Developer</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">Admin</span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {admins.map(admin => (
            <div key={admin.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              {editingId === admin.id ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Username</Label>
                      <Input
                        value={editUsername}
                        onChange={e => setEditUsername(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    {canManagePassword && (
                      <div>
                        <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">New Password (optional)</Label>
                        <Input
                          type="password"
                          value={editPassword}
                          onChange={e => setEditPassword(e.target.value)}
                          placeholder="Leave empty to keep current"
                          className="h-10"
                        />
                      </div>
                    )}
                  </div>
                  {canManageRoles && (
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Roles</Label>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(ADMIN_ROLES) as AdminRole[]).map(role => (
                          <button
                            key={role}
                            onClick={() => {
                              if (editRoles.includes(role)) {
                                if (editRoles.length > 1) {
                                  setEditRoles(prev => prev.filter(r => r !== role));
                                }
                              } else {
                                setEditRoles(prev => [...prev, role]);
                              }
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                              editRoles.includes(role)
                                ? cn(ADMIN_ROLES[role].bg, ADMIN_ROLES[role].color)
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                            )}
                          >
                            {ADMIN_ROLES[role].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdit} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      <span className="ml-2">Save</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                      <KeyRound className="h-5 w-5 text-brand-accent" />
                    </div>
                    <div>
                      <Text weight="semibold">{admin.username}</Text>
                      <div className="flex gap-1 mt-1">
                        {admin.roles.map(role => (
                          <span key={role} className={cn("px-2 py-0.5 rounded text-[10px] font-bold", ADMIN_ROLES[role].bg, ADMIN_ROLES[role].color)}>
                            {ADMIN_ROLES[role].label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(admin)}>
                      Edit
                    </Button>
                    {canManageAdmins && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => deleteAdmin(admin.id, admin.username)}
                        disabled={admins.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {canManageAdmins && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <Text weight="semibold" className="mb-4 block">Create New Account</Text>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Username</Label>
              <Input
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="admin_username"
                className="h-11"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="h-11 pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(newPassword); toast.success("Copied"); }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button type="button" variant="outline" size="icon" onClick={() => setNewPassword(generatePassword())} title="Generate new password">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {canManageRoles && (
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Roles</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(ADMIN_ROLES) as AdminRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      if (newRoles.includes(role)) {
                        if (newRoles.length > 1) {
                          setNewRoles(prev => prev.filter(r => r !== role));
                        }
                      } else {
                        setNewRoles(prev => [...prev, role]);
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      newRoles.includes(role)
                        ? cn(ADMIN_ROLES[role].bg, ADMIN_ROLES[role].color)
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                    )}
                  >
                    {ADMIN_ROLES[role].label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={createAdmin} disabled={saving || !newUsername.trim()}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : <><Plus className="h-4 w-4 mr-2" />Create Account</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// BLOG TAB
// ═══════════════════════════════════════════════

function BlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [initialPosts, setInitialPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const newPostRef = useRef<HTMLDivElement | null>(null);
  const isDirty = useMemo(() => !deepEquals(posts, initialPosts), [posts, initialPosts]);
  useWarnIfDirty(isDirty);

  useEffect(() => {
    fetch("/api/blog").then(r => r.json()).then(data => {
      const arr = Array.isArray(data) ? data : [];
      setPosts(arr); setInitialPosts(arr); setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Failed to load blog posts"); });
  }, []);

  const createPost = useCallback(() => {
    const newPost: BlogPost = {
      slug: "",
      title: "New Post",
      excerpt: "",
      content: "",
      author: "NexusMines Team",
      publishedAt: new Date().toISOString().split("T")[0],
      tags: [],
    };
    setEditingPost(newPost);
    setIsCreating(true);
    setTimeout(() => newPostRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  }, []);

  const editPost = useCallback((post: BlogPost) => {
    setEditingPost({ ...post });
    setIsCreating(false);
  }, []);

  const savePost = useCallback(async () => {
    if (!editingPost) return;
    if (!editingPost.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPost)
      });
      if (!res.ok) throw new Error();
      if (isCreating) {
        setPosts(prev => [editingPost, ...prev]);
      } else {
        setPosts(prev => prev.map(p => p.slug === editingPost.slug ? editingPost : p));
      }
      setInitialPosts(posts);
      setEditingPost(null);
      setIsCreating(false);
      toast.success(isCreating ? "Post created" : "Post saved");
    } catch { toast.error("Save failed"); }
    setSaving(false);
  }, [editingPost, isCreating, posts]);

  const deletePost = useCallback(async (slug: string) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts(prev => prev.filter(p => p.slug !== slug));
      toast.success("Post deleted");
    } catch { toast.error("Delete failed"); }
  }, []);

  const updateEditingPost = useCallback((patch: Partial<BlogPost>) => {
    setEditingPost(prev => prev ? { ...prev, ...patch } : null);
  }, []);

  if (loading) return <Skeleton className="h-64 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Blog</h2>
          <p className="text-sm text-zinc-500">Manage blog posts</p>
        </div>
        <Button onClick={createPost} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      {editingPost ? (
        <div ref={newPostRef} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{isCreating ? "Create Post" : "Edit Post"}</h3>
            <Button variant="ghost" size="sm" onClick={() => { setEditingPost(null); setIsCreating(false); }}>Cancel</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-zinc-500 mb-1 block">Title</Label>
              <Input value={editingPost.title} onChange={e => updateEditingPost({ title: e.target.value })} placeholder="Title" className="h-9" />
            </div>
            <div>
              <Label className="text-xs text-zinc-500 mb-1 block">Slug</Label>
              <Input value={editingPost.slug} onChange={e => updateEditingPost({ slug: e.target.value })} placeholder="slug" className="h-9" />
            </div>
          </div>

          <div>
            <Label className="text-xs text-zinc-500 mb-1 block">Excerpt</Label>
            <Textarea value={editingPost.excerpt} onChange={e => updateEditingPost({ excerpt: e.target.value })} placeholder="Short description..." rows={2} />
          </div>

          <div>
            <Label className="text-xs text-zinc-500 mb-1 block">Content</Label>
            <Textarea value={editingPost.content} onChange={e => updateEditingPost({ content: e.target.value })} placeholder="Blog content..." rows={6} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-xs text-zinc-500 mb-1 block">Author</Label>
              <Input value={editingPost.author} onChange={e => updateEditingPost({ author: e.target.value })} className="h-9" />
            </div>
            <div>
              <Label className="text-xs text-zinc-500 mb-1 block">Date</Label>
              <Input type="date" value={editingPost.publishedAt} onChange={e => updateEditingPost({ publishedAt: e.target.value })} className="h-9" />
            </div>
            <div>
              <Label className="text-xs text-zinc-500 mb-1 block">Cover Image</Label>
              <Input value={editingPost.coverImage || ""} onChange={e => updateEditingPost({ coverImage: e.target.value })} placeholder="https://..." className="h-9" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={savePost} disabled={saving} size="sm">
              {saving ? "Saving..." : "Save"}
            </Button>
            {!isCreating && (
              <Button variant="destructive" size="sm" onClick={() => { if (window.confirm("Delete?")) deletePost(editingPost.slug); }}>
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-zinc-500 mb-4">No blog posts yet</p>
          <Button variant="outline" size="sm" onClick={createPost}>Add first post</Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {posts.map((post) => (
            <div key={post.slug} className="flex items-center justify-between p-3 border-b border-zinc-100 dark:border-zinc-700 last:border-0">
              <div className="min-w-0">
                <p className="font-medium truncate">{post.title}</p>
                <p className="text-xs text-zinc-500 truncate">{post.publishedAt}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => editPost(post)}>Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (window.confirm("Delete?")) deletePost(post.slug); }}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDirty && (
        <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-500">Unsaved changes</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPosts(initialPosts)}>Cancel</Button>
            <Button size="sm" onClick={savePost} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
