import { redirect } from "next/navigation";
import { isAdmin } from "~/lib/isAdmin";

function ManageAdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) {
    redirect("/jo.in/auth/sign-out?redirect_to=/admins");
  }
  return children;
}

export default ManageAdminLayout;
