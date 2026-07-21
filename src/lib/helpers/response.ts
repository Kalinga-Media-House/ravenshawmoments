import { NextResponse } from "next/server";
import { AppError } from "../errors";
import { logger } from "../logger";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    logger.error(`[${error.code}] ${error.message}`, error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod or unexpected errors safely without leaking internals
  logger.error("Unhandled Error:", error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    { status: 500 }
  );
}
