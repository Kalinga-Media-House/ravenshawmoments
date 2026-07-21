import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, PermissionError, NotFoundError, ConflictError } from "../../lib/errors";

export function handleApiError(error: any) {
  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: "Validation failed",
      validationErrors: error.flatten().fieldErrors
    }, { status: 422 });
  }

  if (error instanceof PermissionError) {
    return NextResponse.json({ success: false, error: error.message }, { status: 403 });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }

  if (error instanceof ConflictError) {
    return NextResponse.json({ success: false, error: error.message }, { status: 409 });
  }

  if (error instanceof AppError) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
}

export function jsonResponse(data: any, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
