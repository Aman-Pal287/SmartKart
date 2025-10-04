// src/utils/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// 1. Define the Custom Log Format
const customFormat = printf(({ level, message, timestamp, stack }) => {
    // Check if the log contains an error (which usually has a stack trace)
    if (stack) {
        return `${timestamp} [${level}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level}]: ${message}`;
});

// 2. Create the Logger instance
const logger = createLogger({
    // Set the lowest level to log. (e.g., 'info' will log info, warn, and error)
    level: 'info', 
    
    // Combine multiple formats for the console output
    format: combine(
        // Add colors to the output level (only applies to the console transport)
        colorize(), 
        
        // Add a timestamp to the log entry
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        
        // Use our custom format defined above
        customFormat
    ),
    
    // 3. Define the Transports (where the logs go)
    transports: [
        // A. Console Transport (for terminal logging)
        new transports.Console({
            // You can optionally set a specific log level for this transport
            level: 'info' 
        }),
        
        // B. File Transport (Optional, but good for persistence)
        // new transports.File({ filename: 'error.log', level: 'error' }),
        // new transports.File({ filename: 'combined.log' })
    ],
    
    // This allows Winston to catch and log uncaught exceptions
    exceptionHandlers: [
        new transports.Console()
    ]
});

module.exports = logger;