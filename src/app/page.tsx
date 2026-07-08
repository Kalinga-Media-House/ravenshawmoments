"use client";

import { toast } from "sonner";

export default function Page() {
  return (
    <main style={{ padding: 40 }}>
      <button
        onClick={() => toast.success("Hello World")}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        Show Toast
      </button>
    </main>
  );
}