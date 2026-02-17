import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import StaffManageClient from "./StaffManageClient";

export default async function StaffManagePage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/login");
  }

  return <StaffManageClient username={session.username} />;
}
