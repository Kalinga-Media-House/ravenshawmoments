import ProfileForm from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-8 text-4xl font-bold">
        Complete Your Profile
      </h1>

      <ProfileForm />
    </main>
  );
}