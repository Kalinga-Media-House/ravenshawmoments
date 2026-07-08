import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ravenshaw-moments-api",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
}
