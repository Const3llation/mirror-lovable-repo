import pino from "pino";

type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

const logger = pino({
	level: (process.env.LOG_LEVEL || "info") as LogLevel,
	timestamp: true,
	...(process.env.NODE_ENV === "development" && {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				ignore: "pid,hostname",
			},
		},
	}),
	serializers: {
		err: pino.stdSerializers.err,
		error: pino.stdSerializers.err,
		emailData: (data: Record<string, unknown>) => ({
			...data,
			recipient: data.recipient ? "***@***.***" : undefined,
			password: undefined,
			token: undefined,
		}),
	},
	formatters: {
		level(label) {
			return { level: label };
		},
	},
});

export default logger;
