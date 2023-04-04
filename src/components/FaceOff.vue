<script setup lang="ts">
import stores from '@/stores';
import type { BattleRoute } from '@/stores/ux';
import versusImage from './icons/sf-vs.png'

defineProps<{ route: BattleRoute }>()

const battle = stores.battle();
</script>

<template>
  <h2>Round {{ battle.rounds.length }}</h2>

  <section class="flex flex-col gap-8">
    <article
      class="flex w-full gap-2"
      :class="{ ThreeWay: faceoff.length === 3, TwoWay: faceoff.length === 2 }"
      v-for="(faceoff, index) in battle.currentRound"
      :key="faceoff.join('::') + index"
    >
      <div class="ContenderName street-fighter" :class="{ [battle.swatches[faceoff[0].id].text]: true }">
        {{ faceoff[0].name }}
      </div>
      <div class="VersusImage"><img :src="versusImage" /></div>
      <div class="ContenderName street-fighter" :class="{ [battle.swatches[faceoff[1].id].text]: true }">
        {{ faceoff[1].name }}
      </div>
      <template v-if="faceoff[2]">
        <div class="VersusImage"><img :src="versusImage" /></div>
        <div class="ContenderName street-fighter" :class="{ [battle.swatches[faceoff[2].id].text]: true }">
          {{ faceoff[2].name }}
        </div>
      </template>
    </article>
  </section>

  <div @click.exact="battle.nextRound()" class="btn-cyan font-street-fighter text-xl mt-6">
    Next Round
  </div>
</template>

<style scoped>
h2 {
  @apply text-4xl font-street-fighter;
  @apply my-6 pb-6;
}

article {
  @apply text-center
}
article.ThreeWay>* {
  @apply w-1/5
}
article.TwoWay>* {
  @apply w-1/3
}

article>div {
  @apply flex items-center justify-center
}

article>.ContenderName {
  @apply text-4xl;
}

article>.VersusImage img {
  @apply max-h-16
}
</style>
