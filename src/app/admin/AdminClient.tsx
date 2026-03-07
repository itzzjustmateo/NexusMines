"use client";

import { useState, useEffect, useCallback, useMemo, useRef, forwardRef, memo } from "react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import {
  Trash, Loader2, X, Plus, Save,
  Users, ShieldCheck, Server, KeyRound,
  ShieldAlert, UserCheck, BugOff, MegaphoneOff, Gavel, AlertCircle,
  Clock, Heart, Star, Zap, Hammer, Lock, MessageSquare, Globe, Ghost, Sword, Axe,
  RefreshCw, Eye, EyeOff, Copy
} from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "../login/actions";
import {
  Combobox, ComboboxInput, ComboboxContent,
  ComboboxList, ComboboxItem, ComboboxEmpty,
} from "@/components/ui/combobox";

// ─────────────────── Types ───────────────────

type StaffMember = { id: string; name: string; rank: string; bio: string; image: string };
type Rule = { id: string; title: string; desc: string; icon?: string };
type ServerConfig = { javaIp: string; bedrockIp: string; javaPort: number; bedrockPort: number };
type AdminAccount = { id: string; username: string };

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

// ═══════════════════════════════════════════════
// Admin Client
// ═══════════════════════════════════════════════

export default function AdminClient({ username }: { username?: string }) {
  return (
    <section className="relative flex flex-col items-center min-h-[calc(100vh-8rem)] py-12 sm:py-20 px-4 bg-zinc-50/70 dark:bg-zinc-950/70 transition-colors duration-300 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] opacity-50 dark:opacity-30 pointer-events-none animate-in fade-in duration-1000" />
      <div className="absolute bottom-1/4 right-1/4 w-120 h-120 bg-indigo-500/10 rounded-full blur-[120px] opacity-50 dark:opacity-30 pointer-events-none animate-in fade-in duration-1000 delay-300" />
      
      <div className="z-10 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div>
            <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-zinc-900 dark:text-white flex items-center gap-x-2 transition-colors duration-300">
              Admin <span className="text-brand-accent">Dashboard</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium border border-zinc-200/50 dark:border-zinc-700/50">
                <UserCheck className="h-4 w-4 text-brand-accent" />
                {username}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
              <Button
                variant="ghost" size="sm"
                className="h-8 rounded-full px-3 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                onClick={() => { if (window.confirm("Log out?")) logoutAction(); }}
              >
                Log out
              </Button>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
             <div className="h-16 w-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 shadow-inner">
               <ShieldCheck className="h-8 w-8 text-brand-accent" />
             </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="staff">
          <TabsList className="w-full grid grid-cols-4 mb-8">
            <TabsTrigger value="staff" className="gap-2"><Users className="h-4 w-4" />Staff</TabsTrigger>
            <TabsTrigger value="rules" className="gap-2"><ShieldCheck className="h-4 w-4" />Rules</TabsTrigger>
            <TabsTrigger value="server" className="gap-2"><Server className="h-4 w-4" />Server</TabsTrigger>
            <TabsTrigger value="accounts" className="gap-2"><KeyRound className="h-4 w-4" />Accounts</TabsTrigger>
          </TabsList>
          <TabsContent value="staff"><StaffTab /></TabsContent>
          <TabsContent value="rules"><RulesTab /></TabsContent>
          <TabsContent value="server"><ServerTab /></TabsContent>
          <TabsContent value="accounts"><AccountsTab /></TabsContent>
        </Tabs>
      </div>
    </section>
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
      toast.success("Staff saved!");
    } catch { toast.error("Save failed!"); }
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Text size="lg" weight="semibold">Staff Members</Text>
        <Button variant="outline" size="sm" onClick={addMember}><Plus className="h-4 w-4 mr-2" />Add Staff</Button>
      </div>
      {loading ? (
        <div className="grid gap-6">{[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}</div>
      ) : (
        <div className="grid gap-6">
          {staff.map((member, idx) => (
            <StaffMemberRow
              key={member.id} member={member}
              isUploading={isUploading[member.id]}
              onDropOrChange={(file, revokeOld, oldUrl) => handleImageUpload({ file, memberId: member.id, revokeOld, oldUrl })}
              onChange={updateMember} onDelete={deleteMember}
              ref={idx === staff.length - 1 ? newMemberRef : undefined}
              fileInputRef={el => { fileInputRefs.current[member.id] = el; }}
            />
          ))}
        </div>
      )}
      <div className="mt-8 flex gap-2">
        <Button onClick={save} disabled={saving || !isDirty}>
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
        </Button>
        <Button variant="ghost" onClick={() => { setStaff(initialStaff); toast("Reverted"); }} disabled={!isDirty}>
          <X className="h-4 w-4 mr-2" />Cancel
        </Button>
      </div>
    </div>
  );
}

// ─────────────────── Staff Member Row ───────────────────

type StaffMemberRowProps = {
  member: StaffMember;
  isUploading?: boolean;
  onDropOrChange: (file: File, revokeOld?: boolean, oldUrl?: string) => void;
  onChange: (id: string, patch: Partial<StaffMember>) => void;
  onDelete: (id: string) => void;
  ref?: React.Ref<HTMLDivElement>;
  fileInputRef?: (el: HTMLInputElement | null) => void;
};

const StaffMemberRow = memo(forwardRef<HTMLDivElement, StaffMemberRowProps>(
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
      <div ref={ref} className="grid gap-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm p-6 sm:p-8 md:grid-cols-[120px_1fr_56px] relative group shadow-sm hover:shadow-md transition-all duration-300">
        <div
          onDrop={handleImageDrop} onDragOver={e => e.preventDefault()}
          tabIndex={0} role="button" aria-label="Upload image"
          className="relative flex h-28 w-28 mx-auto md:mx-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-background text-xs text-muted-foreground transition hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
          onClick={() => localFileInputRef.current?.click()}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); localFileInputRef.current?.click(); } }}
        >
          {member.image ? (
            <div className="relative group/avatar h-full w-full">
              <Image src={member.image} alt={member.name} width={120} height={120} className="h-full w-full object-cover" unoptimized />
              <Button type="button" size="icon" variant="destructive"
                className="absolute inset-0 m-auto h-8 w-8 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity shadow-lg"
                onClick={e => { e.stopPropagation(); if (window.confirm("Remove this profile picture?")) onChange(member.id, { image: "" }); }}
              ><X className="h-4 w-4" /></Button>
            </div>
          ) : member.name ? (
            <div className="relative h-full w-full">
              <Image src={`https://mc-heads.net/avatar/${member.name}/120`} alt={member.name} width={120} height={120} className="h-full w-full object-cover opacity-50 transition-opacity group-hover:opacity-30" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center p-2 text-center leading-tight">Drop or click</div>
            </div>
          ) : "Drop or click"}
          <input type="file" accept="image/*" style={{ display: "none" }} ref={localFileInputRef} onChange={handleFileInput} tabIndex={-1} />
          {isUploading && (
            <div className="absolute inset-0 bg-background bg-opacity-70 flex items-center justify-center rounded-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="grid gap-3">
          <div><Label htmlFor={`staff-name-${member.id}`}>Name</Label><Input id={`staff-name-${member.id}`} value={member.name} onChange={e => onChange(member.id, { name: e.target.value })} /></div>
          <div><Label htmlFor={`staff-rank-${member.id}`}>Rank</Label><Input id={`staff-rank-${member.id}`} value={member.rank} onChange={e => onChange(member.id, { rank: e.target.value })} /></div>
          <div><Label htmlFor={`staff-bio-${member.id}`}>Bio</Label><Textarea id={`staff-bio-${member.id}`} value={member.bio} onChange={e => onChange(member.id, { bio: e.target.value })} rows={3} /></div>
        </div>
        <div className="flex flex-col items-end justify-start pt-2">
          <Button type="button" variant="ghost" aria-label="Delete staff member"
            className="opacity-60 hover:text-destructive hover:opacity-100 hover:bg-destructive/10 w-fit"
            onClick={() => { if (window.confirm("Delete this staff member?")) onDelete(member.id); }}
          ><Trash className="h-5 w-5" /></Button>
        </div>
      </div>
    );
  }
));
StaffMemberRow.displayName = "StaffMemberRow";

// ═══════════════════════════════════════════════
// RULES TAB
// ═══════════════════════════════════════════════

function RulesTab() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [initialRules, setInitialRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const newRuleRef = useRef<HTMLDivElement | null>(null);
  const isDirty = useMemo(() => !deepEquals(rules, initialRules), [rules, initialRules]);
  useWarnIfDirty(isDirty);

  useEffect(() => {
    fetch("/api/rules").then(r => r.json()).then(data => {
      const arr = Array.isArray(data) ? data : [];
      setRules(arr); setInitialRules(arr); setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Failed to load rules"); });
  }, []);

  const addRule = useCallback(() => {
    const id = crypto.randomUUID();
    setRules(prev => [...prev, { id, title: "New Rule", desc: "", icon: "ShieldAlert" }]);
    setTimeout(() => newRuleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  }, []);

  const updateRule = useCallback((id: string, patch: Partial<Rule>) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/rules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rules }) });
      if (!res.ok) throw new Error();
      setInitialRules(rules);
      toast.success("Rules saved!");
    } catch { toast.error("Save failed!"); }
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Text size="lg" weight="semibold">Server Rules</Text>
        <Button variant="outline" size="sm" onClick={addRule}><Plus className="h-4 w-4 mr-2" />Add Rule</Button>
      </div>
      {loading ? (
        <div className="grid gap-6">{[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>
      ) : (
        <div className="grid gap-6">
          {rules.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <Text variant="muted">No rules yet. Click &quot;Add Rule&quot; to get started.</Text>
            </div>
          )}
          {rules.map((rule, idx) => (
            <RuleRow key={rule.id} rule={rule} onUpdate={updateRule} onDelete={deleteRule}
              ref={idx === rules.length - 1 ? newRuleRef : undefined} />
          ))}
        </div>
      )}
      <div className="mt-8 flex gap-2">
        <Button onClick={save} disabled={saving || !isDirty}>
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
        </Button>
        <Button variant="ghost" onClick={() => { setRules(initialRules); toast("Reverted"); }} disabled={!isDirty}>
          <X className="h-4 w-4 mr-2" />Cancel
        </Button>
      </div>
    </div>
  );
}

// ─────────────────── Rule Row ───────────────────

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
    <div ref={ref} className="p-6 sm:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm grid grid-cols-1 md:grid-cols-[240px_1fr_40px] gap-8 items-start shadow-sm hover:shadow-md transition-all duration-300">
      <div className="space-y-4">
        <div>
          <Label className="text-[10px] uppercase tracking-widest mb-1.5 block">Icon</Label>
          <Combobox value={rule.icon} onValueChange={icon => onUpdate(rule.id, { icon: icon as string })}>
            <ComboboxInput placeholder="Search icons..." value={searchValue} onChange={e => setSearchValue(e.target.value)} />
            <ComboboxContent>
              <ComboboxList>
                {filteredIcons.map(icon => {
                  const Icon = ICON_MAP[icon];
                  return <ComboboxItem key={icon} value={icon} className="flex items-center gap-2"><Icon className="h-4 w-4" />{icon}</ComboboxItem>;
                })}
              </ComboboxList>
              <ComboboxEmpty>No icons found.</ComboboxEmpty>
            </ComboboxContent>
          </Combobox>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          {(() => {
            const Icon = (rule.icon && ICON_MAP[rule.icon]) || AlertCircle;
            return <><Icon className="h-10 w-10 text-brand-accent mb-2" /><Text size="xxs" variant="muted" className="uppercase font-bold tracking-widest">{rule.icon || "Default"}</Text></>;
          })()}
        </div>
      </div>
      <div className="space-y-4">
        <div><Label className="text-[10px] uppercase tracking-widest mb-1.5 block">Title</Label><Input value={rule.title} onChange={e => onUpdate(rule.id, { title: e.target.value })} placeholder="e.g. Respect all players" /></div>
        <div><Label className="text-[10px] uppercase tracking-widest mb-1.5 block">Description</Label><Textarea value={rule.desc} onChange={e => onUpdate(rule.id, { desc: e.target.value })} placeholder="Explain the rule in detail..." rows={3} /></div>
      </div>
      <div className="flex justify-end md:flex-col md:items-center">
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 transition-colors" onClick={() => { if (window.confirm("Delete this rule?")) onDelete(rule.id); }}>
          <Trash className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}));
RuleRow.displayName = "RuleRow";

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
      toast.success("Server config saved!");
    } catch { toast.error("Save failed!"); }
    setSaving(false);
  }

  if (loading) return <div className="grid gap-6"><Skeleton className="h-48 w-full rounded-xl" /></div>;

  return (
    <div>
      <div className="mb-6">
        <Text size="lg" weight="semibold">Server Configuration</Text>
        <Text size="sm" variant="muted" className="mt-1">Manage your Minecraft server addresses. Changes will update across the entire site.</Text>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Java Edition */}
        <div className="p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-5 w-5 text-brand-accent" />
            <Text weight="semibold">Java Edition</Text>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest mb-1.5 block">IP Address</Label>
            <Input value={config.javaIp} onChange={e => setConfig(c => ({ ...c, javaIp: e.target.value }))} placeholder="play.example.com" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest mb-1.5 block">Port</Label>
            <Input type="number" value={config.javaPort} onChange={e => setConfig(c => ({ ...c, javaPort: parseInt(e.target.value) || 25565 }))} />
          </div>
        </div>

        {/* Bedrock Edition */}
        <div className="p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-5 w-5 text-brand-accent" />
            <Text weight="semibold">Bedrock Edition</Text>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest mb-1.5 block">IP Address</Label>
            <Input value={config.bedrockIp} onChange={e => setConfig(c => ({ ...c, bedrockIp: e.target.value }))} placeholder="bedrock.example.com" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest mb-1.5 block">Port</Label>
            <Input type="number" value={config.bedrockPort} onChange={e => setConfig(c => ({ ...c, bedrockPort: parseInt(e.target.value) || 19132 }))} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
        <Button onClick={save} disabled={saving || !isDirty}>
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
        </Button>
        <Button variant="ghost" onClick={() => { setConfig(initialConfig); toast("Reverted"); }} disabled={!isDirty}>
          <X className="h-4 w-4 mr-2" />Cancel
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

function AccountsTab() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New account form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState(() => generatePassword());
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch("/api/admins").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAdmins(data);
      setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Failed to load accounts"); });
  }, []);

  async function createAdmin() {
    if (!newUsername.trim()) { toast.error("Username is required"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername.trim(), password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAdmins(prev => [...prev, { id: data.id, username: newUsername.trim() }]);
      toast.success(`Account "${newUsername.trim()}" created!`);
      setNewUsername("");
      setNewPassword(generatePassword());
      setShowPassword(false);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to create account"); }
    setSaving(false);
  }

  async function deleteAdmin(id: string, name: string) {
    if (!window.confirm(`Delete admin "${name}"? They will no longer be able to log in.`)) return;
    try {
      const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAdmins(prev => prev.filter(a => a.id !== id));
      toast.success(`Account "${name}" deleted`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to delete"); }
  }

  if (loading) return <div className="grid gap-6"><Skeleton className="h-48 w-full rounded-xl" /></div>;

  return (
    <div>
      <div className="mb-6">
        <Text size="lg" weight="semibold">Admin Accounts</Text>
        <Text size="sm" variant="muted" className="mt-1">Manage who can access this admin dashboard.</Text>
      </div>

      {/* Existing Admins */}
      <div className="grid gap-4 mb-10">
        {admins.map(admin => (
          <div key={admin.id} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <KeyRound className="h-4 w-4 text-brand-accent" />
              </div>
              <div>
                <Text weight="semibold">{admin.username}</Text>
                <Text size="xxs" variant="muted">Administrator</Text>
              </div>
            </div>
            <Button
              variant="ghost" size="icon"
              className="text-zinc-400 hover:text-red-500 transition-colors"
              onClick={() => deleteAdmin(admin.id, admin.username)}
              disabled={admins.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Create New Admin */}
      <div className="p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="h-5 w-5 text-brand-accent" />
          <Text weight="semibold">Create New Admin</Text>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-[10px] uppercase tracking-widest mb-1.5 block">Username</Label>
            <Input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="NewAdmin" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest mb-1.5 block">Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="pr-20"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => { navigator.clipboard.writeText(newPassword); toast.success("Password copied!"); }}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={() => setNewPassword(generatePassword())} title="Generate new password">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Text size="xxs" variant="muted" className="mt-1">Auto-generated 16-character password. Edit or copy before saving.</Text>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={createAdmin} disabled={saving || !newUsername.trim()}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating…</> : <><Plus className="h-4 w-4 mr-2" />Create Account</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
