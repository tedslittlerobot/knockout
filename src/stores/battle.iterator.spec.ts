import { describe, it, expect } from 'vitest'
import LoopingContenderIterator from './battle.iterator'

describe('Single entry iterator', () => {
  it('Iterates indefinitely when no loop origin is specified', () => {
    const iterator = new LoopingContenderIterator([ { id: 'foo', name: 'Foo', avoid: null } ])

    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('foo')
  })

  it('Iterates only once when specifying start point / loop origin', () => {
    const iterator = new LoopingContenderIterator([ { id: 'foo', name: 'Foo', avoid: null } ])

    expect(iterator.startIterating!.id).toBe('foo')
    expect(iterator.next).toBe(null)
  })

  it('Converts a finite loop to an infinite one', () => {
    const iterator = new LoopingContenderIterator([ { id: 'foo', name: 'Foo', avoid: null } ])

    expect(iterator.startIterating!.id).toBe('foo')
    expect(iterator.next).toBe(null)
    expect(iterator.clearLoop().next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('foo')
  })
})

describe('Triple entry iterator', () => {
  const contenders = [
    { id: 'foo', name: 'Foo', avoid: null },
    { id: 'bar', name: 'Bar', avoid: null },
    { id: 'baz', name: 'Baz', avoid: null },
  ]

  it('Iterates to end and stops', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.startIterating!.id).toBe('foo')
    expect(iterator.next!.id).toBe('bar')
    expect(iterator.next!.id).toBe('baz')
    expect(iterator.next).toBe(null)
  })

  it('Iterates from offset and loops to offset end', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.startIterating!.id).toBe('foo')
    expect(iterator.startIterating!.id).toBe('bar')
    expect(iterator.next!.id).toBe('baz')
    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next).toBe(null)
  })

  it('Removes entry from iterations', () => {
    const iterator = new LoopingContenderIterator(contenders)

    iterator.remove({ id: 'bar', name: 'Bar', avoid: null })

    expect(iterator.startIterating!.id).toBe('foo')
    expect(iterator.next!.id).toBe('baz')
    expect(iterator.next).toBe(null)
  })

  it('Removes entry from source mid-iteration', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.startIterating!.id).toBe('foo')

    iterator.remove({ id: 'bar', name: 'Bar', avoid: null })

    expect(iterator.next!.id).toBe('baz')
    expect(iterator.next).toBe(null)
  })

  it('Finds an entry from the start of a loop', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.find(item => item.id === 'bar')!.id).toBe('bar')
    expect(iterator.clearLoop().next!.id).toBe('baz')
  })

  it('Finds an entry from a looping loop', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('bar')

    expect(iterator.find(item => item.id === 'foo')!.id).toBe('foo')
    expect(iterator.next!.id).toBe('bar')
  })

  it('Returns null when it cannot "find()" an entry', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.find(item => item.id === 'monkeys')).toBe(null)
    expect(iterator.next!.id).toBe('foo')
  })


  it('Finds the first next loop entry', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.find(() => true)!.id).toBe('foo')
    expect(iterator.next!.id).toBe('bar')

    expect(iterator.find(() => true)!.id).toBe('baz')
    expect(iterator.next!.id).toBe('foo')

    expect(iterator.find(() => true)!.id).toBe('bar')
    expect(iterator.next!.id).toBe('baz')

    expect(iterator.find(() => true)!.id).toBe('foo')
    expect(iterator.next!.id).toBe('bar')
  })

  it('Finds and removes an entry from a looping loop', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.find(item => item.id === 'foo')!.id).toBe('foo')

    expect(iterator.next!.id).toBe('bar')
    expect(iterator.next!.id).toBe('baz')

    expect(iterator.find(item => item.id === 'bar', true)!.id).toBe('bar')
    expect(iterator.next!.id).toBe('baz')
    expect(iterator.next!.id).toBe('foo')
    expect(iterator.next!.id).toBe('baz')
  })

  it('Yanks an entry', () => {
    const iterator = new LoopingContenderIterator(contenders)

    expect(iterator.yank()!.id).toBe('foo')

    expect(iterator.next!.id).toBe('bar')
    expect(iterator.next!.id).toBe('baz')

    expect(iterator.next!.id).toBe('bar')

    expect(iterator.yank()!.id).toBe('baz')

    expect(iterator.next!.id).toBe('bar')
    expect(iterator.next!.id).toBe('bar')

    expect(iterator.yank()!.id).toBe('bar')

    expect(iterator.size).toBe(0)

  })

})
