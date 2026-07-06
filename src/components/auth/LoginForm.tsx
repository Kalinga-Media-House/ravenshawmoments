"use client";

import { signIn } from "@/app/actions/auth";

export default function LoginForm() {
  return (
    <form action={signIn} className="space-y-5">

      <input
        name="email"
        type="email"
        placeholder="Email Address"
        required
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 outline-none focus:border-yellow-400"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 outline-none focus:border-yellow-400"
      />

      <button
        type="submit"
        className="w-full rounded-xl bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400"
      >
        Login
      </button>

    </form>
  );
}