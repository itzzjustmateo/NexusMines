import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";
import { AdminRole, admins } from "@/data/admin";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/login");
  }

  const currentAdmin = admins.find(a => a.id === session.adminId);
  const roles = currentAdmin?.roles || [];

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NuqsAdapter>
        <AdminClient username={session.username} roles={roles as AdminRole[]} />
      </NuqsAdapter>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
