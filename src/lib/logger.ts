type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

function formatMessage(level: LogLevel, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const payload: LogPayload = {
    level,
    message,
    timestamp,
    ...(data !== undefined && { data }),
  };
  return JSON.stringify(payload);
}

const isProduction = process.env.NODE_ENV === "production";

export const logger = {
  debug(message: string, data?: unknown): void {
    if (!isProduction) {
      console.debug(formatMessage("debug", message, data));
    }
  },

  info(message: string, data?: unknown): void {
    console.info(formatMessage("info", message, data));
  },

  warn(message: string, data?: unknown): void {
    console.warn(formatMessage("warn", message, data));
  },

  error(message: string, error?: unknown): void {
    const errorData =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
    console.error(formatMessage("error", message, errorData));
  },
};
