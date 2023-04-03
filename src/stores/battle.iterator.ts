import type { Contender } from "./rosters";

type ContenderMatcher = (value: Contender) => boolean

export default class LoopingContenderIterator {
  source: Map<string, Contender>
  #iterator: IterableIterator<Contender>
  #loopOrigin: Contender|null = null
  #loopCache: IteratorResult<Contender, any>|null = null

  constructor(source: Contender[]) {
    this.source = new Map(source.map(item => [item.id, item]))
    source.map
    this.#iterator = this.source.values()
  }

  #iterate(startANewLoop = false): Contender | null {
    if (this.#loopCache) {
      // console.info('Loop Iteration Cached')
      const cachedIteration = this.#loopCache

      // if(!startANewLoop) {
      //   return null
      // }

      if (startANewLoop) {
        // console.info('Starting new Iteration from cached value', cachedIteration.value)
        this.#loopOrigin = cachedIteration.value
      }

      // console.info('Using cached value', cachedIteration)
      this.#loopCache = null
      return cachedIteration.value
    }

    const iteration = this.#iterator.next()

    if (! iteration.done) {
      if (startANewLoop) {
        // console.info('Starting new Loop Iteration', iteration.value)
        this.#loopOrigin = iteration.value
      } else if (this.#loopOrigin && iteration.value.id === this.#loopOrigin.id) {
        // console.info('reached the Loop Origin: caching it', iteration.value)
        this.#loopCache = iteration
        return null
      }

      // console.info('Found value', iteration.value)
      return iteration.value
    }
    // console.info('Reached the end of the source loop')

    if (this.source.size === 0) {
      throw Error('Nothing to iterate over')
    }

    // if the iterator is "done", start it again at the beginning

    this.#iterator = this.source.values()
    const loopedIteration = this.#iterator.next()

    if (startANewLoop) {
      // console.info('Starting new Loop Iteration', iteration.value)
      this.#loopOrigin = loopedIteration.value
    } else if (this.#loopOrigin && loopedIteration.value.id === this.#loopOrigin.id) {
      // console.info('reached the Loop Origin: caching it', loopedIteration.value)
        this.#loopCache = loopedIteration
        return null
    }

    // console.info('Found value', iteration.value)
    return loopedIteration.value
  }

  #wrappedIterate(startANewLoop = false): Contender | null {
    const value = this.#iterate(startANewLoop)

    // console.info('ITERATION COMPLETE', { inLoop: !!this.#loopOrigin, value })

    return value
  }

  get startIterating(): Contender|null {
    return this.#wrappedIterate(true)
  }

  get next(): Contender|null {
    return this.#wrappedIterate()
  }

  get size() {
    return this.source.size
  }

  yank() {
    const value = this.next

    if (!value) {
      return null
    }

    this.remove(value)

    return value
  }

  remove(contender: Contender) {
    this.source.delete(contender.id)
  }

  clearLoop(): LoopingContenderIterator {
    // console.info('Clearing Loop Origin')
    this.#loopOrigin = null

    return this
  }

  find(matcher: ContenderMatcher, deleteIfFound = false): Contender|null {
    this.clearLoop()
    let value: Contender | null

    while(value = this.#wrappedIterate(!this.#loopOrigin)) {
      if (matcher(value)) {
        if (deleteIfFound) {
          this.remove(value)
        }

        this.clearLoop()
        return value
      }
    }

    this.clearLoop()
    return null
  }
}
