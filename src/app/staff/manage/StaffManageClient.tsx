"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useTransition,
  useMemo,
  forwardRef,
  memo
} from "react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type StaffMember = {
  id: string;
  name: string;
  rank: string;
  bio: string;
  image: string;
};

type MemberUploadingState = Record<string, boolean>;

function deepEquals(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function useWarnIfDirty(isDirty: boolean) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}

export default function StaffEditPage({ username }: { username?: string }) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [initialStaff, setInitialStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<MemberUploadingState>({});
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const newMemberRef = useRef<HTMLDivElement | null>(null);
  const fileInputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});

  const isDirty = useMemo(() => !deepEquals(staff, initialStaff), [staff, initialStaff]);
  useWarnIfDirty(isDirty);

  useEffect(() => {
    setLoading(true);
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStaff(data);
          setInitialStaff(data);
        } else {
          setStaff([]);
          setInitialStaff([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to load staff list");
      });
  }, []);

  function addMember() {
    startTransition(() => {
      const id = uuidv4();
      setStaff((prev) => [
        ...prev,
        {
          id,
          name: "New Staff",
          rank: "Role",
          bio: "",
          image: "",
        },
      ]);
      setTimeout(() => {
        newMemberRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    });
  }

  function updateMember(id: string, patch: Partial<StaffMember>) {
    startTransition(() => {
      setStaff((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    });
  }

  function deleteMember(id: string) {
    startTransition(() => {
      setStaff((prev) => prev.filter((m) => m.id !== id));
    });
  }

  function cancelChanges() {
    setStaff(initialStaff);
    toast("Edits canceled", { description: "Reverted to last saved changes." });
  }

  const handleImageUpload = useCallback(
    async ({
      file,
      memberId,
      revokeOld,
      oldUrl,
    }: {
      file: File;
      memberId: string;
      revokeOld?: boolean;
      oldUrl?: string;
    }) => {
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      updateMember(memberId, { image: previewUrl });
      setIsUploading((u) => ({ ...u, [memberId]: true }));

      if (revokeOld && oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }

      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        URL.revokeObjectURL(previewUrl);
        updateMember(memberId, { image: data.path });
      } catch {
        toast.error("Image upload failed", {
          description: "Please try again.",
        });
      }
      setIsUploading((u) => ({ ...u, [memberId]: false }));
    },
    []
  );

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staff }),
      });
      if (!res.ok) throw new Error();
      setInitialStaff(staff);
      toast.success("Changes saved!");
    } catch {
      toast.error("Save failed!", { description: "Please check your network." });
    }
    setSaving(false);
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text size="2xl" weight="bold">
            Edit Staff
          </Text>
          <Text size="sm" className="text-zinc-500">
            Welcome back, <span className="font-semibold text-zinc-900 dark:text-zinc-100">{username}</span>
          </Text>
        </div>
        <Button variant="outline" size="sm" onClick={addMember}>
          + Add Staff
        </Button>
      </div>

      {loading ? (
        <SkeletonList count={3} />
      ) : (
        <div className="grid gap-6">
          {staff.map((member, idx) => (
            <StaffMemberRow
              key={member.id}
              member={member}
              isUploading={isUploading[member.id]}
              onDropOrChange={(file, revokeOld, oldUrl) =>
                handleImageUpload({ file, memberId: member.id, revokeOld, oldUrl })
              }
              onChange={updateMember}
              onDelete={deleteMember}
              ref={idx === staff.length - 1 ? newMemberRef : undefined}
              fileInputRef={(el) => {
                fileInputRefs.current[member.id] = el;
              }}
            />
          ))}
        </div>
      )}
      <div className="mt-8 flex gap-2">
        <Button onClick={save} disabled={saving || !isDirty || isPending}>
          {saving || isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={cancelChanges}
          disabled={!isDirty || isPending}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}

// ──────────────────────────────────────
// StaffMemberRow component
// ──────────────────────────────────────

type StaffMemberRowProps = {
  member: StaffMember;
  isUploading?: boolean;
  onDropOrChange: (
    file: File,
    revokeOld?: boolean,
    oldUrl?: string
  ) => void;
  onChange: (id: string, patch: Partial<StaffMember>) => void;
  onDelete: (id: string) => void;
  ref?: React.Ref<HTMLDivElement>;
  fileInputRef?: (el: HTMLInputElement | null) => void;
};

const StaffMemberRow = memo(
  forwardRef<HTMLDivElement, StaffMemberRowProps>(
    (
      {
        member,
        isUploading,
        onDropOrChange,
        onChange,
        onDelete,
        fileInputRef,
      },
      ref
    ) => {
      const lastPreviewUrl = useRef<string | null>(null);
      const localFileInputRef = useRef<HTMLInputElement | null>(null);

      useEffect(() => {
        if (fileInputRef) {
          fileInputRef(localFileInputRef.current);
        }
      }, [fileInputRef]);

      useEffect(() => () => {
        if (lastPreviewUrl.current) {
          URL.revokeObjectURL(lastPreviewUrl.current);
        }
      }, []);

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

      function openFileDialog() {
        localFileInputRef.current?.click();
      }

      return (
        <div
          ref={ref}
          className="grid gap-4 rounded-xl border border-border p-4 md:grid-cols-[120px_1fr_56px] relative group"
        >
          <div
            onDrop={handleImageDrop}
            onDragOver={(e) => e.preventDefault()}
            tabIndex={0}
            role="button"
            aria-label="Upload image"
            className="relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-background text-xs text-muted-foreground transition hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={openFileDialog}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openFileDialog();
              }
            }}
          >
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                width={120}
                height={120}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              "Drop or click to select image"
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={localFileInputRef}
              onChange={handleFileInput}
              tabIndex={-1}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-background bg-opacity-70 flex items-center justify-center rounded-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
          <div className="grid gap-3">
            <div>
              <Label htmlFor={`staff-name-${member.id}`}>Name</Label>
              <Input
                id={`staff-name-${member.id}`}
                value={member.name}
                onChange={(e) =>
                  onChange(member.id, { name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor={`staff-rank-${member.id}`}>Rank</Label>
              <Input
                id={`staff-rank-${member.id}`}
                value={member.rank}
                onChange={(e) =>
                  onChange(member.id, { rank: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor={`staff-bio-${member.id}`}>Bio</Label>
              <Textarea
                id={`staff-bio-${member.id}`}
                value={member.bio}
                onChange={(e) =>
                  onChange(member.id, { bio: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <div className="flex flex-col items-end justify-start pt-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Delete staff member"
              className="opacity-60 hover:text-destructive hover:opacity-100 hover:bg-destructive/10 dark:hover:bg-destructive/20 dark:active:bg-destructive/30 active:bg-destructive/20"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this staff member?"
                  )
                ) {
                  onDelete(member.id);
                }
              }}
            >
              <Trash className="h-5 w-5 text-destructive dark:text-destructive" />
            </Button>
          </div>
        </div>
      );
    }
  )
);

function SkeletonList({ count }: { count: number }) {
  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="grid gap-4 rounded-xl border border-border p-4 md:grid-cols-[120px_1fr_56px]"
        >
          <Skeleton className="h-28 w-28 rounded-full" />
          <div className="grid gap-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div />
        </div>
      ))}
    </div>
  );
}
