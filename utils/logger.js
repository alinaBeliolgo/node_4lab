import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),

    transports: [
        new DailyRotateFile({
            dirname: "logs",
            filename: "error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "30d",
            level: "error",
        }),
        new DailyRotateFile({
            dirname: "logs",
            filename: "combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "30d",
            level: "info",
        }),
        ...(process.env.NODE_ENV !== "production" ? [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.printf(({ level, message, timestamp, ...meta }) => {
                        return `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                    })
                )
            })
        ] : [])
    ]
});

export default logger;