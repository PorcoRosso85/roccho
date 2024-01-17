import { describe, expect, test } from 'vitest'
import { testFactory, testMap } from '.'

// testFactory returns an array of test functions
// to execute to make them void
testFactory(testMap)

describe('test', () => {
  test('test', () => {
    expect(true).toBe(true)
  })
})
