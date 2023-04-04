import type { Contender } from "@/stores/rosters";

export function prioritiseContenders(contenders: Contender[]): Contender[] {
  const partition = contenders.reduce<[Contender[], Contender[]]>((partition, item) => {
    partition[item.avoid ? 0 : 1].push(item)

    return partition
  }, [[], []])

  return partition[0].concat(partition[1])
}

export function shouldAllowPairing(left: Contender, right: Contender): boolean {
  if (left.avoid && left.avoid.test(right.name)) {
    return false
  }

  if (right.avoid && right.avoid.test(left.name)) {
    return false
  }

  return true;
}

export default { prioritiseContenders, shouldAllowPairing }
