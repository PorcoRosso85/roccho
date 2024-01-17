import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { LogEntry, LogLevelConst, logger } from './logger'

describe('logger', () => {
  let consoleSpy: any

  afterEach(() => {
    consoleSpy.mockReset()
  })

  test('should log error messages', () => {
    consoleSpy = vi.spyOn(console, 'error')
    const logEntry: LogEntry = {
      level: LogLevelConst.ERROR,
      message: 'Test error message',
      timestamp: Date.now(),
    }
    logger(logEntry)
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining(logEntry))
  })

  test('should log warning messages', () => {
    consoleSpy = vi.spyOn(console, 'warn')
    const logEntry: LogEntry = {
      level: LogLevelConst.WARN,
      message: 'Test warning message',
      timestamp: Date.now(),
    }
    logger(logEntry)
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining(logEntry))
  })

  test('should log info messages', () => {
    consoleSpy = vi.spyOn(console, 'info')
    const logEntry: LogEntry = {
      level: LogLevelConst.INFO,
      message: 'Test info message',
      timestamp: Date.now(),
    }
    logger(logEntry)
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining(logEntry))
  })

  test('should log debug messages', () => {
    consoleSpy = vi.spyOn(console, 'debug')
    const logEntry: LogEntry = {
      level: LogLevelConst.DEBUG,
      message: 'Test debug message',
      timestamp: Date.now(),
    }
    logger(logEntry)
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining(logEntry))
  })

  test('should warn about unknown log levels', () => {
    consoleSpy = vi.spyOn(console, 'warn')
    const logEntry: LogEntry = {
      level: 'unknown' as any,
      message: 'Unknown log level: ',
      timestamp: Date.now(),
    }
    logger(logEntry)
    // [] 期待を確定させる
    // expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining(logEntry))
  })
})
