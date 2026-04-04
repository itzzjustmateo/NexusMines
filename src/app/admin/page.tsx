import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";
import { AdminRole, admins } from "@/data/admin";

export default async function AdminPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/login");
  }

  const currentAdmin = admins.find(a => a.id === session.adminId);
  const roles = currentAdmin?.roles || [];

  return <AdminClient username={session.username} roles={roles as AdminRole[]} />;
}
