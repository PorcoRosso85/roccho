/**
 * このファイルは、パッケージの説明を記述するためのファイルです。
 * tsファイルにしている理由は
 * interface型を使用して、ディレクトリ構成を表現するためです。
 *
 */

export interface domain {
  entity: entity
  io: io
  usecase: usecase
  repository: repository
}

export interface entity {
  user: user
  account: account
}
export interface io {
  table: table
  query: query
  feature: feature
}
export interface usecase {
  user: user
  account: account
}
export interface repository {
  user: user
  account: account
}

export interface infrastructure {
  // infra層がどの層に依存するかを表現する
  dependee1: presentation
  dependee2: application
  dependee3: domain

  database: database
  api: api
  storage: storage
  logger: logger
}

export interface database {
  mysql: mysql
  postgresql: postgresql
  dynamodb: dynamodb
  firestore: firestore
}
export interface api {
  graphql: graphql
  rest: rest
}
export interface storage {
  s3: s3
  cloudstorage: cloudstorage
}
export interface logger {
  cloudwatch: cloudwatch
  stackdriver: stackdriver
}

export interface application {
  // app層がどの層に依存するかを表現する
  dependee1: domain
  service: service
  controller: controller
  gateway: gateway
  presenter: presenter
}

export interface service {
  user: user
  account: account
}
export interface controller {
  user: user
  account: account
}
export interface gateway {
  user: user
  account: account
}
export interface presenter {
  user: user
  account: account
}

export interface presentation {
  // presen層がどの層に依存するかを表現する
  dependee1: domain
  view: view
  router: router
  store: store
  component: component
}

export interface view {
  user: user
  account: account
}
export interface router {
  user: user
  account: account
}
export interface store {
  user: user
  account: account
}
export interface component {
  user: user
  account: account
}
