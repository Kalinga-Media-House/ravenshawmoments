"use client";

import { toast } from "sonner";
import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    console.log("toast fired");
    toast.success("Hello from useEffect");
  }, []);

  return <h1>Testing...</h1>;
}