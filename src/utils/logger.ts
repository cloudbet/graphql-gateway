import { createLogger, format, transports, Logger } from 'winston';

function serializeValue(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item, seen));
  }

  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) {
      return '[Circular]';
    }

    seen.add(value);
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        serializeValue(nestedValue, seen),
      ]),
    );
  }

  return value;
}

export function serializeError(error: unknown): unknown {
  return serializeValue(error);
}

const baseLogger = createLogger({
  level: process.env['LOG_LEVEL'] ?? 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      stderrLevels: ['error', 'warn'],
    }),
  ],
});

export const logger: Logger = baseLogger;

export function createRequestLogger(
  metadata: Record<string, unknown> = {},
): Logger {
  return baseLogger.child(metadata);
}
