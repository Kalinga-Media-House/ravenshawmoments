// =============================================================================
// Ravenshaw Moments
// File      : src/lib/logger.ts
// Purpose   : Standardized Structured Logging
// =============================================================================

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogContext {
  userId?: string;
  action?: string;
  module?: "profile" | "department" | "hostel" | "organization" | "auth" | "system";
  [key: string]: any;
}

export const logger = {
  log: (level: LogLevel, message: string, context?: LogContext, error?: Error | unknown) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
    };

    if (process.env.NODE_ENV !== "production") {
      console[level === "error" ? "error" : "log"](`[${level.toUpperCase()}] ${timestamp} - ${message}`, context || "", error || "");
    } else {
      console[level === "error" ? "error" : "log"](JSON.stringify(logEntry));
    }
  },
  info: (message: string, context?: LogContext) => logger.log("info", message, context),
  warn: (message: string, context?: LogContext) => logger.log("warn", message, context),
  error: (message: string, error?: Error | unknown, context?: LogContext) => logger.log("error", message, context, error),
  debug: (message: string, context?: LogContext) => logger.log("debug", message, context),
};
