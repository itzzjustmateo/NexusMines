"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

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
            {/* Drag & Drop Avatar */}
            <div
              onDrop={(e) => handleDrop(e, member)}
              onDragOver={(e) => e.preventDefault()}
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-dashed border-border text-xs text-muted-foreground"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                "Drop image"
              )}
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
