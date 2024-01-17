export { Query, QueryOperationType, TableFromTypeBox }

// type Query = (params: any) => string | string[]
type Query = {
  [key: string]: (params: any) => string | string[]
}

type QueryOperationType = (tableFromTypeBox: TableFromTypeBox) => string

type TableFromTypeBox = any
