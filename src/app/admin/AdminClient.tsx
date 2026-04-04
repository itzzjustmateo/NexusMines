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
  Monitor, Wifi, ArrowLeft, Home, Gamepad2
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
};
const AVAILABLE_ICONS = Object.keys(ICON_MAP);

const navItems = [
  { id: "staff", label: "Staff", icon: Users },
  { id: "rules", label: "Rules", icon: ShieldCheck },
  { id: "blog", label: "Blog", icon: FileText },
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back link & Logo */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <Home className="h-4 w-4" />
              </Link>
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-accent to-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">Admin Dashboard</span>
              </div>
            </div>

            {/* Center: Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    tab === item.id
                      ? "bg-brand-accent text-white shadow-md"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right: User & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <Text size="sm" weight="semibold" className="text-zinc-900 dark:text-white">{username}</Text>
                <Text size="xs" variant="muted">Administrator</Text>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={() => { if (window.confirm("Log out?")) logoutAction(); }}
              >
                Log out
              </Button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden flex items-center gap-1 pb-3 -mx-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shrink-0",
                  tab === item.id
                    ? "bg-brand-accent text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === "staff" && <StaffTab />}
        {tab === "rules" && <RulesTab />}
        {tab === "blog" && <BlogTab />}
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
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const newMemberRef = useRef<HTMLDivElement | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
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

  const handleImageUpload = useCallback(async ({ file, memberId, revokeOld, oldUrl }: { file: File; memberId: string; revokeOld?: boolean; oldUrl?: string }) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    updateMember(memberId, { image: previewUrl });
    setIsUploading(u => ({ ...u, [memberId]: true }));
    if (revokeOld && oldUrl) URL.revokeObjectURL(oldUrl);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      URL.revokeObjectURL(previewUrl);
      updateMember(memberId, { image: data.path });
    } catch { toast.error("Image upload failed"); }
    setIsUploading(u => ({ ...u, [memberId]: false }));
  }, [updateMember]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ staff }) });
      if (!res.ok) throw new Error();
      setInitialStaff(staff);
      toast.success("Staff saved successfully");
    } catch { toast.error("Save failed"); }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <Users className="h-7 w-7 text-brand-accent" />
            Staff Members
          </h2>
          <Text variant="muted" className="mt-1">Manage your server staff team</Text>
        </div>
        <Button onClick={addMember} className="gap-2">
          <Plus className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      ) : staff.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <Users className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
          <Text variant="muted">No staff members yet</Text>
          <Button variant="outline" className="mt-4" onClick={addMember}>
            <Plus className="h-4 w-4 mr-2" /> Add your first staff member
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {staff.map((member, idx) => (
            <StaffMemberCard
              key={member.id}
              member={member}
              isUploading={isUploading[member.id]}
              onDropOrChange={(file, revokeOld, oldUrl) => handleImageUpload({ file, memberId: member.id, revokeOld, oldUrl })}
              onChange={updateMember}
              onDelete={deleteMember}
              ref={idx === staff.length - 1 ? newMemberRef : undefined}
              fileInputRef={el => { fileInputRefs.current[member.id] = el; }}
            />
          ))}
        </div>
      )}

      {isDirty && (
        <div className="sticky bottom-4 flex items-center justify-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
          <Text size="sm" variant="muted">You have unsaved changes</Text>
          <Button variant="outline" size="sm" onClick={() => { setStaff(initialStaff); toast("Changes discarded"); }}>
            Cancel
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
          </Button>
        </div>
      )}
    </div>
  );
}

const StaffMemberCard = memo(forwardRef<HTMLDivElement, {
  member: StaffMember;
  isUploading?: boolean;
  onDropOrChange: (file: File, revokeOld?: boolean, oldUrl?: string) => void;
  onChange: (id: string, patch: Partial<StaffMember>) => void;
  onDelete: (id: string) => void;
  fileInputRef?: (el: HTMLInputElement | null) => void;
}>(
  ({ member, isUploading, onDropOrChange, onChange, onDelete, fileInputRef }, ref) => {
    const lastPreviewUrl = useRef<string | null>(null);
    const localFileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => { if (fileInputRef) fileInputRef(localFileInputRef.current); }, [fileInputRef]);
    useEffect(() => () => { if (lastPreviewUrl.current) URL.revokeObjectURL(lastPreviewUrl.current); }, []);

    function handleImageDrop(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (!file) return;
      onDropOrChange(file, true, lastPreviewUrl.current || undefined);
      lastPreviewUrl.current = URL.createObjectURL(file);
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      onDropOrChange(file, true, lastPreviewUrl.current || undefined);
      lastPreviewUrl.current = URL.createObjectURL(file);
    }

    return (
      <div ref={ref} className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex p-4 gap-4">
          <div
            onDrop={handleImageDrop} onDragOver={e => e.preventDefault()}
            className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-brand-accent transition-colors"
            onClick={() => localFileInputRef.current?.click()}
          >
            {member.image ? (
              <Image src={member.image} alt={member.name} fill className="object-cover" unoptimized />
            ) : member.name ? (
              <Image src={`https://mc-heads.net/avatar/${member.name}/120`} alt={member.name} fill className="object-cover opacity-50" unoptimized />
            ) : (
              <div className="flex items-center justify-center h-full text-[10px] text-zinc-400 text-center p-1">Drop image</div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
            <input type="file" accept="image/*" style={{ display: "none" }} ref={localFileInputRef} onChange={handleFileInput} />
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <Input
                value={member.name}
                onChange={e => onChange(member.id, { name: e.target.value })}
                placeholder="Staff name"
                className="h-9 font-semibold"
              />
            </div>
            <div>
              <Input
                value={member.rank}
                onChange={e => onChange(member.id, { rank: e.target.value })}
                placeholder="Rank (e.g. Admin)"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <button
            onClick={() => { if (window.confirm("Delete this staff member?")) onDelete(member.id); }}
            className="h-9 w-9 shrink-0 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 pb-4">
          <Textarea
            value={member.bio}
            onChange={e => onChange(member.id, { bio: e.target.value })}
            placeholder="Staff bio..."
            rows={2}
            className="text-sm resize-none"
          />
        </div>
      </div>
    );
  }
));
StaffMemberCard.displayName = "StaffMemberCard";

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

  const CATEGORY_ICONS = ["Shield", "Gamepad2", "MessageSquare", "Users", "Zap", "Lock", "Globe"];

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
        return { ...c, rules: [...c.rules, { id: ruleId, title: "New Rule", desc: "", icon: "ShieldAlert" }] };
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
      toast.success("Rules saved successfully");
    } catch { toast.error("Save failed"); }
    setSaving(false);
  }

  if (loading) return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-brand-accent" />
            Server Rules
          </h2>
          <Text variant="muted" className="mt-1">Manage server rules and categories</Text>
        </div>
        <Button onClick={addCategory} className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {rules.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <ShieldCheck className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
          <Text variant="muted">No rule categories yet</Text>
          <Button variant="outline" className="mt-4" onClick={addCategory}>
            <Plus className="h-4 w-4 mr-2" /> Create your first category
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {rules.map((category, idx) => (
          <RuleCategoryCard
            key={category.id}
            category={category}
            onUpdate={updateCategory}
            onDelete={() => deleteCategory(category.id)}
            onAddRule={() => addRuleToCategory(category.id)}
            onUpdateRule={(ruleId, patch) => updateRule(category.id, ruleId, patch)}
            onDeleteRule={(ruleId) => deleteRule(category.id, ruleId)}
            categoryIcons={CATEGORY_ICONS}
            ref={idx === rules.length - 1 ? newCategoryRef : undefined}
          />
        ))}
      </div>

      {isDirty && (
        <div className="sticky bottom-4 flex items-center justify-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
          <Text size="sm" variant="muted">You have unsaved changes</Text>
          <Button variant="outline" size="sm" onClick={() => { setRules(initialRules); toast("Changes discarded"); }}>
            Cancel
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
          </Button>
        </div>
      )}
    </div>
  );
}

const RuleRow = memo(forwardRef<HTMLDivElement, {
  rule: Rule;
  onUpdate: (id: string, patch: Partial<Rule>) => void;
  onDelete: (id: string) => void;
}>(({ rule, onUpdate, onDelete }, ref) => {
  const [searchValue, setSearchValue] = useState("");
  const filteredIcons = useMemo(() => {
    if (!searchValue) return AVAILABLE_ICONS;
    return AVAILABLE_ICONS.filter(icon => icon.toLowerCase().includes(searchValue.toLowerCase()));
  }, [searchValue]);

  return (
    <div ref={ref} className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
      <div className="flex gap-4">
        <div className="shrink-0">
          <Combobox value={rule.icon} onValueChange={icon => onUpdate(rule.id, { icon: icon as string })}>
            <ComboboxInput placeholder="Icon..." className="w-32 h-9" />
            <ComboboxContent>
              <ComboboxList>
                {filteredIcons.slice(0, 10).map(icon => {
                  const Icon = ICON_MAP[icon];
                  return <ComboboxItem key={icon} value={icon} className="flex items-center gap-2"><Icon className="h-4 w-4" />{icon}</ComboboxItem>;
                })}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div className="flex-1 space-y-2">
          <Input value={rule.title} onChange={e => onUpdate(rule.id, { title: e.target.value })} placeholder="Rule title" className="h-9" />
          <Textarea value={rule.desc} onChange={e => onUpdate(rule.id, { desc: e.target.value })} placeholder="Rule description..." rows={2} className="text-sm resize-none" />
        </div>
        <button
          onClick={() => { if (window.confirm("Delete this rule?")) onDelete(rule.id); }}
          className="h-9 w-9 shrink-0 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}));
RuleRow.displayName = "RuleRow";

const RuleCategoryCard = memo(forwardRef<HTMLDivElement, {
  category: RuleCategory;
  onUpdate: (id: string, patch: Partial<RuleCategory>) => void;
  onDelete: () => void;
  onAddRule: () => void;
  onUpdateRule: (ruleId: string, patch: Partial<Rule>) => void;
  onDeleteRule: (ruleId: string) => void;
  categoryIcons: string[];
}>(({ category, onUpdate, onDelete, onAddRule, onUpdateRule, onDeleteRule, categoryIcons }, ref) => {
  const [searchValue, setSearchValue] = useState("");
  const [expanded, setExpanded] = useState(true);
  const filteredIcons = useMemo(() => {
    if (!searchValue) return categoryIcons;
    return categoryIcons.filter(icon => icon.toLowerCase().includes(searchValue.toLowerCase()));
  }, [searchValue, categoryIcons]);

  const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Shield: ShieldAlert, Gamepad2: Gamepad2, MessageSquare: MessageSquare,
    Users: UserCheck, Zap: Zap, Lock: Lock, Globe: Globe,
  };

  const CurrentIcon = CATEGORY_ICON_MAP[category.icon] || ShieldAlert;

  return (
    <div ref={ref} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-zinc-100 dark:border-zinc-800">
        <button onClick={() => setExpanded(!expanded)} className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
          <CurrentIcon className="h-5 w-5" />
        </button>
        <Input
          value={category.title}
          onChange={e => onUpdate(category.id, { title: e.target.value })}
          className="flex-1 h-10 font-semibold text-lg"
          placeholder="Category title"
        />
        <Combobox value={category.icon} onValueChange={icon => onUpdate(category.id, { icon: icon || undefined })}>
          <ComboboxInput placeholder="Icon" className="w-28" />
          <ComboboxContent>
            <ComboboxList>
              {filteredIcons.map(icon => {
                const Icon = CATEGORY_ICON_MAP[icon];
                return <ComboboxItem key={icon} value={icon} className="flex items-center gap-2"><Icon className="h-4 w-4" />{icon}</ComboboxItem>;
              })}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <button
          onClick={() => { if (window.confirm("Delete this category?")) onDelete(); }}
          className="h-10 w-10 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-colors"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          {category.rules.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              <Text variant="muted" size="sm">No rules in this category</Text>
            </div>
          )}
          {category.rules.map(rule => (
            <RuleRow key={rule.id} rule={rule} onUpdate={onUpdateRule} onDelete={onDeleteRule} />
          ))}
          <Button variant="outline" size="sm" onClick={onAddRule} className="w-full gap-2">
            <Plus className="h-4 w-4" /> Add Rule
          </Button>
        </div>
      )}
    </div>
  );
}));
RuleCategoryCard.displayName = "RuleCategoryCard";

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
      content: "<p>Write your content here...</p>",
      author: "NexusMines Team",
      publishedAt: new Date().toISOString().split("T")[0],
      tags: [],
      coverImage: ""
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
      const savedPost = await res.json();
      if (isCreating) {
        setPosts(prev => [savedPost.ok ? editingPost : savedPost, ...prev]);
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

  if (loading) return <Skeleton className="h-96 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <FileText className="h-7 w-7 text-brand-accent" />
            Blog Posts
          </h2>
          <Text variant="muted" className="mt-1">Create and manage blog content</Text>
        </div>
        <Button onClick={createPost} className="gap-2">
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      {editingPost ? (
        <div ref={newPostRef} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Text weight="semibold" className="text-lg">{isCreating ? "Create New Post" : "Edit Post"}</Text>
            <Button variant="ghost" size="sm" onClick={() => { setEditingPost(null); setIsCreating(false); }}>Cancel</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Title</Label>
              <Input value={editingPost.title} onChange={e => updateEditingPost({ title: e.target.value })} placeholder="Post title" className="h-11" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Slug</Label>
              <Input value={editingPost.slug} onChange={e => updateEditingPost({ slug: e.target.value })} placeholder="post-slug" className="h-11" />
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Excerpt</Label>
            <Textarea value={editingPost.excerpt} onChange={e => updateEditingPost({ excerpt: e.target.value })} placeholder="Short description..." rows={2} />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Content</Label>
            <RichTextEditor content={editingPost.content} onChange={content => updateEditingPost({ content })} placeholder="Write your blog post content..." />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Author</Label>
              <Input value={editingPost.author} onChange={e => updateEditingPost({ author: e.target.value })} className="h-11" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Date</Label>
              <Input type="date" value={editingPost.publishedAt} onChange={e => updateEditingPost({ publishedAt: e.target.value })} className="h-11" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Cover Image</Label>
              <Input value={editingPost.coverImage || ""} onChange={e => updateEditingPost({ coverImage: e.target.value })} placeholder="https://..." className="h-11" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button onClick={savePost} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Post</>}
            </Button>
            {!isCreating && (
              <Button variant="destructive" onClick={() => { if (window.confirm("Delete this post?")) deletePost(editingPost.slug); }}>
                <Trash className="h-4 w-4 mr-2" />Delete
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {posts.length === 0 && (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
              <Text variant="muted">No blog posts yet</Text>
              <Button variant="outline" className="mt-4" onClick={createPost}>
                <Plus className="h-4 w-4 mr-2" /> Create your first post
              </Button>
            </div>
          )}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {posts.map((post) => (
              <div key={post.slug} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <Text weight="semibold" className="truncate">{post.title}</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Text size="xs" variant="muted">{post.publishedAt}</Text>
                    <span className="text-zinc-300">•</span>
                    <Text size="xs" variant="muted" className="truncate">{post.excerpt}</Text>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => editPost(post)}>Edit</Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => { if (window.confirm("Delete this post?")) deletePost(post.slug); }}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
