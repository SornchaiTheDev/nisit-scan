import { redirect } from "next/navigation";
import { getBasePath } from "~/lib/getBasePath";
import { isAdmin } from "~/lib/isAdmin";

function ManageAdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) {
    redirect(`/${getBasePath()}/auth/sign-out?redirect_to=/admins`);
  }
  return children;
}

export default ManageAdminLayout;
