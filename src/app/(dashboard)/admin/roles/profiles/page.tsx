import { redirect } from "next/navigation";

export default function AdminProfilesIndexPage() {
  redirect("/admin/roles?tab=unclaimed");
}
