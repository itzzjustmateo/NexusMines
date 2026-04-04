"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/ui/text";
import { toast } from "sonner";
import { Send, Loader2, ClipboardCheck } from "lucide-react";

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

export default function ApplyPage() {
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
    <section className="relative flex flex-col items-center min-h-[calc(100vh-8rem)] py-12 sm:py-20 px-4 bg-zinc-50/70 dark:bg-zinc-950/70 transition-colors duration-300 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] opacity-50 dark:opacity-30 pointer-events-none animate-in fade-in duration-1000" />
      <div className="absolute bottom-1/4 left-1/4 w-120 h-120 bg-indigo-500/10 rounded-full blur-[120px] opacity-50 dark:opacity-30 pointer-events-none animate-in fade-in duration-1000 delay-300" />
      
      <div className="z-10 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-accent/10 text-brand-accent mb-4">
            <ClipboardCheck className="h-8 w-8" />
          </div>
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-zinc-900 dark:text-white">
            Staff <span className="text-brand-accent">Application</span>
          </h1>
          <Text variant="muted" className="mt-3 max-w-md mx-auto">
            Want to join the NexusMines team? Fill out this form and we'll get back to you!
          </Text>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discordUsername">Discord Username</Label>
              <Input
                id="discordUsername"
                placeholder="username#1234"
                {...register("discordUsername")}
                className={errors.discordUsername ? "border-destructive" : ""}
              />
              {errors.discordUsername && (
                <Text size="sm" className="text-destructive">{errors.discordUsername.message}</Text>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minecraftUsername">Minecraft Username</Label>
              <Input
                id="minecraftUsername"
                placeholder="YourIGN"
                {...register("minecraftUsername")}
                className={errors.minecraftUsername ? "border-destructive" : ""}
              />
              {errors.minecraftUsername && (
                <Text size="sm" className="text-destructive">{errors.minecraftUsername.message}</Text>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Your Age</Label>
              <Input
                id="age"
                placeholder="18"
                {...register("age")}
                className={errors.age ? "border-destructive" : ""}
              />
              {errors.age && (
                <Text size="sm" className="text-destructive">{errors.age.message}</Text>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role You're Applying For</Label>
              <select
                id="role"
                {...register("role")}
                className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              >
                <option value="">Select a role...</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <Text size="sm" className="text-destructive">{errors.role.message}</Text>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Previous Experience</Label>
            <Textarea
              id="experience"
              placeholder="Tell us about your previous experience as staff on other servers..."
              rows={4}
              {...register("experience")}
              className={errors.experience ? "border-destructive" : ""}
            />
            {errors.experience && (
              <Text size="sm" className="text-destructive">{errors.experience.message}</Text>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whyJoin">Why Do You Want to Join?</Label>
            <Textarea
              id="whyJoin"
              placeholder="Why do you want to become a staff member on NexusMines?"
              rows={4}
              {...register("whyJoin")}
              className={errors.whyJoin ? "border-destructive" : ""}
            />
            {errors.whyJoin && (
              <Text size="sm" className="text-destructive">{errors.whyJoin.message}</Text>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Application
              </>
            )}
          </Button>

          <Text size="sm" variant="muted" className="text-center">
            By submitting this application, you agree to our terms and privacy policy.
          </Text>
        </form>
      </div>
    </section>
  );
}
