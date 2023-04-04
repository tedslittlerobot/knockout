import { describe, it, expect } from 'vitest'
import { pairs } from './battleHelpers'

describe('Pairs', () => {
  it('Splits to pairs', () => {
    expect(pairs([1, 2, 3])).toStrictEqual([
      [1, 2],
      [1, 3],
      [2, 3],
    ])
  })

  it('Splits objects to pairs', () => {
    expect(pairs([{thing: 1}, {thing: 2}, {thing: 3}])).toStrictEqual([
      [{thing: 1}, {thing: 2}],
      [{thing: 1}, {thing: 3}],
      [{thing: 2}, {thing: 3}],
    ])
  })
})
