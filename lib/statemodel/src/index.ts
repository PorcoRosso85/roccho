import fs from 'fs'
import path from 'path'
import { machine } from '../example/machineObject'

// 抽出関数
function extractParallelStates(machine: any, baseKey = ''): string[] {
  let results: string[] = []
  for (const key in machine.states) {
    const state = machine.states[key]
    const fullKey = baseKey ? `${baseKey}.${key}` : key
    if (state.type === 'parallel') {
      for (const innerKey in state.states) {
        results.push(`${fullKey}.${innerKey}`)
      }
    }
    // ネストされた状態を処理するための再帰呼び出し
    if (state.states) {
      results = [...results, ...extractParallelStates(state, fullKey)]
    }
  }
  return results
}

// 抽出した情報をSQLファイルに書き込む関数
function writeToSQLFile(comments: string[], filePath: string) {
  const commentStr = comments.map((c) => `-- ${c}`).join('\n\n')
  fs.appendFileSync(filePath, commentStr)
}

// 実行
const comments = extractParallelStates(machine)
const filePath = path.resolve(__dirname, 'fromState.sql')
writeToSQLFile(comments, filePath)
