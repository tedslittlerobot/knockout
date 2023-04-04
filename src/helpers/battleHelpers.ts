import type { Contender } from "@/stores/rosters";

/**
 * Prioritises a list of contenders putting those with "avoid"s at the front but otherwise
 * keeping the order
 *
 * @param contenders
 * @returns
 */
export function prioritiseContenders(contenders: Contender[]): Contender[] {
  const partition = contenders.reduce<[Contender[], Contender[]]>((partition, item) => {
    partition[item.avoid ? 0 : 1].push(item)

    return partition
  }, [[], []])

  return partition[0].concat(partition[1])
}

/**
 * Take an array of elements, and produce a list of all possible pairings of them
 *
 * Returns an array of pair Tuples
 *
 * @param arr[T]
 * @returns arr[[T, T]]
 */
export function pairs<T>(arr: T[]): [T, T][] {
  return arr
    .map((item, index) => {
      return arr.slice(index + 1).map(w => ([item, w] as [T, T]))
    })
    .flat();
}

/**
 * Check if the two contenders are allowed to fight each other
 *
 * @param left
 * @param right
 * @returns
 */
export function shouldAllowPairingOfPair(left: Contender, right: Contender): boolean {
  if (left.avoid && left.avoid.test(right.name)) {
    return false
  }

  if (right.avoid && right.avoid.test(left.name)) {
    return false
  }

  return true;
}

/**
 * Check if all given contenders are allowed to be in a fight together
 *
 * @param contenders
 * @returns
 */
export function shouldAllowPairingOf(contenders: Contender[]): boolean {
  return pairs(contenders).reduce((allow, [left, right]) => {
    return allow && shouldAllowPairingOfPair(left, right)
  }, true)
}
