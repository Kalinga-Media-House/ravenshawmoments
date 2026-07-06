import { createProfile } from "@/app/actions/profile";

export default function ProfileForm() {
  return (
    <form
      action={createProfile}
      className="space-y-5 rounded-lg border p-6 shadow"
    >
      <div>
        <label className="mb-2 block font-medium">
          Full Name
        </label>

        <input
          type="text"
          name="full_name"
          required
          placeholder="Enter your full name"
          className="w-full rounded border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Username
        </label>

        <input
          type="text"
          name="username"
          required
          placeholder="Choose a username"
          className="w-full rounded border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Bio
        </label>

        <textarea
          name="bio"
          rows={5}
          placeholder="Tell us about yourself..."
          className="w-full rounded border p-3"
        />
      </div>

      <button
        type="submit"
        className="rounded bg-maroon-700 px-6 py-3 text-white"
      >
        Save Profile
      </button>
    </form>
  );
}