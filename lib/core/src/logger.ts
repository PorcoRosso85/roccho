export { LogLevel, LogEntry, logger, LogLevelConst }
import { type Static, TNumber, TObject } from '@sinclair/typebox'

const LogLevelConst = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const

type LogLevel = (typeof LogLevelConst)[keyof typeof LogLevelConst]

type LogEntry = {
  level: LogLevel
  message: string
  // [] 書式固定
  timestamp: Static<TNumber>
}

const logger = (logEntry: LogEntry): void => {
  switch (logEntry.level) {
    case LogLevelConst.ERROR:
      console.error(logEntry)
      break
    case LogLevelConst.WARN:
      console.warn(logEntry)
      break
    case LogLevelConst.INFO:
      console.info(logEntry)
      break
    case LogLevelConst.DEBUG:
      console.debug(logEntry)
      break
    default:
      console.warn('Unknown log level: ', logEntry.level)
      break
  }
}
