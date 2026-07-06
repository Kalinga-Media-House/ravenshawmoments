import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="p-10">
      <h1 className="mb-8 text-4xl font-bold">
        Complete Your Profile
      </h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <ProfileForm />
    </main>
  );
}