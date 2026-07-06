"use client";

import { signUp } from "@/app/actions/auth";

export default function RegisterForm() {
  return (
    <form action={signUp} className="space-y-4 w-full max-w-sm">
      <h1 className="text-3xl font-bold">Create Account</h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full rounded border p-3"
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full rounded border p-3"
        required
      />

      <button
        className="w-full rounded bg-maroon-700 p-3 text-white"
        type="submit"
      >
        Register
      </button>
    </form>
  );
}