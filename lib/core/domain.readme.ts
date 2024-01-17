export interface app {
  core: core
}

export interface postgres {
  core: core
}

export interface auth {
  core: core
}

export interface core {
  config: config
  logger: logger
  error: error
  io: io
  features: features

  domain: domain
}

export interface features {
  domain: domain
}

export interface config {
  domain: domain
}

export interface logger {
  domain: domain
}

export interface error {
  domain: domain
}

export interface io {
  domain: domain
}

export interface domain {
  '': ''
}

export const config: config = {}
export const logger: logger = {}
export const error: error = {}
export const features: features = {}
