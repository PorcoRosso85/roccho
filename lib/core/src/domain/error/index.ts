export { errorStatusCode, errorMessage, errorDetail, errorConstants }

type errorLevel = 'critical' | 'error' | 'warn' | 'info' | 'debug'

type errorMessage = {
  message: string
}

type errorStatusCode = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511

type errorDetail = {
  level: errorLevel
  message: errorMessage
  // traceback?: string;
  errorStatusCode?: errorStatusCode
  errorLocation?: string
  // internalMessage?: string;
}

type errorConstants = {
  [key in errorStatusCode]: errorDetail
}
