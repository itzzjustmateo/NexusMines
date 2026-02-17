"use client";

import { useEffect, useRef, useState } from "react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type StaffMember = {
  id: string;
  name: string;
  rank: string;
  bio: string;
  image: string;
};

export default function StaffEditPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [saving, setSaving] = useState(false);

  // Store refs for all file inputs for members
  const fileInputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});

  // Load staff from server
  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then(setStaff)
      .catch(() => {});
  }, []);

  function addMember() {
    setStaff((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "New Staff",
        rank: "Role",
        bio: "",
        image: "",
      },
    ]);
  }

  function updateMember(id: string, patch: Partial<StaffMember>) {
    setStaff((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  async function handleDrop(
    e: React.DragEvent<HTMLDivElement>,
    member: StaffMember,
  ) {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Optimistic preview
    const preview = URL.createObjectURL(file);
    updateMember(member.id, { image: preview });

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    // Replace preview with persisted path
    updateMember(member.id, { image: data.path });
  }

  // New: handle upload from file input (click-to-select)
  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    member: StaffMember,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optimistic preview
    const preview = URL.createObjectURL(file);
    updateMember(member.id, { image: preview });

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    // Replace preview with persisted path
    updateMember(member.id, { image: data.path });
  }

  async function save() {
    setSaving(true);

    await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, staff }),
    });

    setSaving(false);
  }

  // ─────────────────────────────────────────────
  // Auth gate
  // ─────────────────────────────────────────────
  if (!authorized) {
    return (
      <div className="mx-auto mt-40 max-w-sm rounded-xl border border-border p-6">
        <Text weight="semibold" className="mb-4">
          Admin Login
        </Text>

        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-border bg-background px-3 py-2"
        />

        <Button className="w-full" onClick={() => setAuthorized(true)}>
          Enter
        </Button>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Editor
  // ─────────────────────────────────────────────
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-6 flex items-center justify-between">
        <Text size="2xl" weight="bold">
          Edit Staff
        </Text>

        <Button variant="outline" size="sm" onClick={addMember}>
          + Add Staff
        </Button>
      </div>

      <div className="grid gap-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className="grid gap-4 rounded-xl border border-border p-4 md:grid-cols-[120px_1fr]"
          >
            {/* Drag & Drop Avatar and Click-to-Select */}
            <div
              onDrop={(e) => handleDrop(e, member)}
              onDragOver={(e) => e.preventDefault()}
              tabIndex={0}
              role="button"
              onClick={() =>
                fileInputRefs.current[member.id]?.click()
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRefs.current[member.id]?.click();
                }
              }}
              className="flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-border text-xs text-muted-foreground transition hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Upload image"
            >
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={120}
                  height={120}
                  className="h-full w-full object-cover"
                />
              ) : (
                "Drop or click to select image"
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={(el) => {
                  fileInputRefs.current[member.id] = el;
                }}
                onChange={e => handleFileChange(e, member)}
                tabIndex={-1}
              />
            </div>

            {/* Fields */}
            <div className="grid gap-2">
              <input
                value={member.name}
                onChange={(e) =>
                  updateMember(member.id, { name: e.target.value })
                }
                className="rounded border border-border bg-background px-3 py-1"
              />

              <input
                value={member.rank}
                onChange={(e) =>
                  updateMember(member.id, { rank: e.target.value })
                }
                className="rounded border border-border bg-background px-3 py-1"
              />

              <textarea
                value={member.bio}
                onChange={(e) =>
                  updateMember(member.id, { bio: e.target.value })
                }
                rows={3}
                className="rounded border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </section>
  );
}
