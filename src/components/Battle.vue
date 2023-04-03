<script setup lang="ts">
import stores from '@/stores';
import type { BattleRoute } from '@/stores/ux';

defineProps<{ route: BattleRoute }>()

const battle = stores.battle();
</script>

<template>
  <h1>BATTLE</h1>
  <section>
    <article class="flex w-full gap-4" :class="{ ThreeWay: faceoff.length === 3, TwoWay: faceoff.length === 2 }" v-for="faceoff in battle.currentRound">
      <div>
        {{ faceoff[0].name }}
      </div>
      <div>vs</div>
      <div>
        {{ faceoff[1].name }}
      </div>
      <template v-if="faceoff[2]">
        <div>vs</div>
        <div>
          {{ faceoff[2].name }}
        </div>
      </template>
    </article>
  </section>
</template>

<style scoped>
article {
  @apply text-center
}
article.ThreeWay>div {
  @apply w-1/5
}
article.TwoWay>div {
  @apply w-1/3
}
</style>
