import { createLogger, format, transports } from 'winston';

/**
 * Logger configuration for the Intelligent Agent
 */
export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'intelligent-agent' },
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.printf(({ timestamp, level, message, service, ...meta }) => {
          return `${timestamp} [${service}] ${level}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      )
    }),
    
    // File transport for errors
    new transports.File({
      filename: 'logs/intelligent-agent-error.log',
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    }),
    
    // File transport for all logs
    new transports.File({
      filename: 'logs/intelligent-agent.log',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ]
});

// Handle uncaught exceptions
logger.exceptions.handle(
  new transports.File({ filename: 'logs/intelligent-agent-exceptions.log' })
);

// Handle unhandled promise rejections
logger.rejections.handle(
  new transports.File({ filename: 'logs/intelligent-agent-rejections.log' })
);

export default logger;
