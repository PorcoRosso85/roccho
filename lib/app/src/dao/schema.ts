/**
 * this file is for top of the schema file.
 * define the schema of the table.
 *
 */
import { type Static, Type } from '@sinclair/typebox'

/**
 * T containes the schema of the table, and all of column name
 * T will be used as a type of the schema.
 *
 */
const T = {
  /** pk */
  userId: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  email: Type.String({ minLength: 1, maxLength: 50, format: 'email' }),
  userName: Type.String({ minLength: 1, maxLength: 100 }),
  userRole: Type.String({ minLength: 1, maxLength: 50 }),
  otherInfo: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),

  /**
   * pk
   * N-userId: N-bankId
   */
  bankId: Type.String({ minLength: 1, maxLength: 50 }),
  /** lowercased */
  bankName: Type.String({ minLength: 1, maxLength: 100, pattern: '^[a-z0-9_]+$' }),
  /** */
  bankType: Type.String({ minLength: 1, maxLength: 50 }),

  /**
   * pk
   * 送信元titleId, 送信先titleId
   * 同じtxIdで、送信元のamountの減少と、送信先のamountの増加を表現する。
   * 1-bankId: N-titleId
   */
  titleId: Type.String({ minLength: 1, maxLength: 50 }),

  /**
   * pk
   * 取引ID、レコードに一意
   */
  txId: Type.String({ minLength: 1, maxLength: 50 }),
  /** 仕訳ID、1仕訳に複数の取引が含まれる、1journalId: NtxId */
  journalId: Type.String({ minLength: 1, maxLength: 50 }),
  // bankId: Type.String({ minLength: 1, maxLength: 50 }),
  amount: Type.Number({ minimum: 0, maximum: 1000000000 }),
  debitCredit: Type.String({ minLength: 1, maxLength: 10 }),
  transactionDate: Type.String({ format: 'date-time' }),
  reason: Type.String({ minLength: 1, maxLength: 200 }),

  /**
   * utc time
   * iso8601 extended format
   * milliseconds with timezone
   * ex. 2021-08-01T00:00:00.000+09:00
   */
  datetime: Type.String({ format: 'date-time' }),
}

const bankTableTypeBox = {
  tableName: 'bank',
  columns: Type.Object({
    bank_id: T.bankId,
    // TODO
    // bank_id: {...T.bankId, metadata: {pk: true}},
    bank_name: T.bankName,
    bank_type: T.bankType,
    /** バンクを作成したオーナーと、オーナーがバンクに招待したメンバー */
    user_id: T.userId,
  }),
}

const userTableTypeBox = {
  tableName: 'user',
  columns: Type.Object({
    user_id: T.userId,
    user_name: T.userName,
    user_role: T.userRole,
    email: T.email,
    other_info: T.otherInfo,
    created_at: T.datetime,
  }),
}

const titleTableTypeBox = {
  tableName: 'title',
  columns: Type.Object({
    title_id: T.titleId,
    /** 関連付けアカウント */
    bank_id: T.bankId,
    /** 権限を持つユーザー */
    user_id: T.userId,
    created_at: T.datetime,
  }),
}

const transactionTableTypeBox = {
  tableName: 'transaction',
  columns: Type.Object({
    tx_id: T.txId,
    journal_id: T.journalId,
    title_id: T.titleId,
    amount: T.amount,
    debit_credit: T.debitCredit,
    reason: T.reason,
    created_at: T.datetime,
  }),
}

/**
 * generate DDL from typebox object
 * for all of the tables
 * @param typebox
 * @returns
 *
 * required type mapping for sqlite, from typebox to sqlite
 * such as
 * Type.String({ minLength: 1, maxLength: 50 }) => TEXT
 * Type.Number({ minimum: 0, maximum: 1000000000 }) => INTEGER
 * etc.
 */
// [] genDdlがもとめる引数の型を定義する
const genDdl = (typeboxTableDefinition: any) => {
  let ddl = `CREATE TABLE ${typeboxTableDefinition.tableName} (`

  const columns = Object.keys(typeboxTableDefinition.columns.properties)
  const columnDefs = columns.map((column) => {
    const typeDef = typeboxTableDefinition.columns.properties[column]
    let sqliteType = ''

    if (typeDef.type === 'string') {
      sqliteType = 'TEXT'
    } else if (typeDef.type === 'number') {
      sqliteType = 'INTEGER'
    } else if (typeDef.type === 'boolean') {
      sqliteType = 'BOOLEAN'
    } else if (typeDef.type === 'blob') {
      sqliteType = 'BLOB'
    } else if (typeDef.type === 'array') {
      sqliteType = 'TEXT'
    } else if (typeDef.type === 'object') {
      sqliteType = 'TEXT'
    } else if (typeDef.type === 'integer') {
      sqliteType = 'INTEGER'
    } else {
      throw new Error(`Unsupported type: ${typeDef.type}`)
    }

    return `${column} ${sqliteType}`

    // TODO: uniqueの制約を追加する
    // let constraints = ''
    // if (typeDef.unique) {
    //   constraints += ' UNIQUE'
    // }

    // return `${column} ${sqliteType}${constraints}`
  })

  ddl += columnDefs.join(', ')
  ddl += ');'

  return ddl
}

export { T, bankTableTypeBox, genDdl, userTableTypeBox }
