"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

const applicationSchema = z.object({
  discordUsername: z.string().min(2, "Discord username is required"),
  minecraftUsername: z.string().min(2, "Minecraft username is required"),
  age: z.string()
    .regex(/^\d+$/, "Age must be a number")
    .refine((val) => {
      const num = parseInt(val);
      return num >= 13 && num <= 99;
    }, "You must be between 13 and 99 years old"),
  experience: z.string().min(10, "Please provide more detail about your experience"),
  whyJoin: z.string().min(20, "Please explain why you want to join our team"),
  role: z.string().min(1, "Please select a role"),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const roles = [
  { value: "Helper", label: "Helper" },
  { value: "Moderator", label: "Moderator" },
  { value: "Admin", label: "Admin" },
  { value: "Builder", label: "Builder" },
  { value: "Developer", label: "Developer" },
];

function HeroSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Staff Application
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          Want to join the NexusMines team? Fill out this form and we&apos;ll get back to you!
        </p>
      </div>
    </section>
  );
}

function ApplicationForm() {
  const mutation = useMutation({
    mutationFn: async (data: ApplicationForm) => {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Application submitted!");
      reset();
    },
    onError: () => {
      toast.error("Failed to submit application");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  return (
    <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discordUsername">Discord</Label>
              <Input
                id="discordUsername"
                placeholder="username#1234"
                {...register("discordUsername")}
                className={errors.discordUsername ? "border-red-500" : ""}
              />
              {errors.discordUsername && (
                <p className="text-xs text-red-500">{errors.discordUsername.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minecraftUsername">Minecraft</Label>
              <Input
                id="minecraftUsername"
                placeholder="YourIGN"
                {...register("minecraftUsername")}
                className={errors.minecraftUsername ? "border-red-500" : ""}
              />
              {errors.minecraftUsername && (
                <p className="text-xs text-red-500">{errors.minecraftUsername.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                placeholder="18"
                {...register("age")}
                className={errors.age ? "border-red-500" : ""}
              />
              {errors.age && (
                <p className="text-xs text-red-500">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register("role")}
                className="flex h-10 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              placeholder="Tell us about your previous experience..."
              rows={3}
              {...register("experience")}
              className={errors.experience ? "border-red-500" : ""}
            />
            {errors.experience && (
              <p className="text-xs text-red-500">{errors.experience.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whyJoin">Why Join?</Label>
            <Textarea
              id="whyJoin"
              placeholder="Why do you want to join our team?"
              rows={3}
              {...register("whyJoin")}
              className={errors.whyJoin ? "border-red-500" : ""}
            />
            {errors.whyJoin && (
              <p className="text-xs text-red-500">{errors.whyJoin.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSection />
      <ApplicationForm />
    </div>
  );
}
