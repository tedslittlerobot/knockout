<script setup lang="ts">
import stores from '@/stores';
import type { BattleRoute } from '@/stores/ux';
import versusImage from './icons/sf-vs.png'
import { ref } from 'vue';

defineProps<{ route: BattleRoute }>()

const battle = stores.battle();

const showChangeContenders = ref(false)

function toggleExclusion(contenderId: string) {
  if (battle.excludedContenders.includes(contenderId)) {
    battle.excludedContenders.splice(battle.excludedContenders.indexOf(contenderId), 1)
  } else {
    battle.excludedContenders.push(contenderId)
  }
}

function clickNextRound() {
  showChangeContenders.value = false
  battle.nextRound()
}
</script>

<template>

  <section v-if="!showChangeContenders" class="flex flex-col gap-8" >
    <h2>Round {{ battle.rounds.length }}</h2>

    <article
      class="flex w-full gap-2 FaceOffItem"
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

  <section v-if="showChangeContenders" class="ChangeContenders">
    <h2>Who will be participating?</h2>

    <p>Click on a name to toggle whether they are participating or not.</p>

    <div class="grid grid-cols-3 gap-4 justify-center">
      <article
        v-for="contender in battle.roster.contenders"
        :key="contender.id"
        class="street-fighter"
        :class="{
          [battle.swatches[contender.id].text]: !battle.excludedContenders.includes(contender.id),
          'border-gray-400 text-gray-400 opacity-30': battle.excludedContenders.includes(contender.id),
        }"
        @click.exact="toggleExclusion(contender.id)"
      >
        {{ contender.name }}
      </article>
    </div>
  </section>


  <div class="flex flex-row gap-4 justify-center border-t-2 border-cyan-200 border-opacity-50 mt-12 pt-4">
    <div
      class="w-1/2 street-fighter text-amber-800 text-2xl mt-10 hover:text-amver-500 cursor-pointer opacity-75 hover:opacity-100 flex items-center justify-center"
      @click="showChangeContenders = !showChangeContenders"
      v-if="!showChangeContenders"
    >
      Change Contenders
    </div>
    <div
      @click.exact="clickNextRound()"
      class="w-1/2 street-fighter text-cyan-800 text-3xl mt-10 text-center hover:text-cyan-500 cursor-pointer flex items-center justify-center"
    >
      !! Next Round !!
    </div>
  </div>
</template>

<style scoped>
h2 {
  @apply text-4xl font-street-fighter;
  @apply my-6 pb-6;
}

.ChangeContenders h2 {
  @apply mt-10 mb-4 pb-0;
}

p {
  @apply font-street-fighter text-center mb-8
}

.ChangeContenders article {
  @apply flex items-center justify-center;
  @apply h-28 cursor-pointer font-extralight text-3xl;
  /* @apply rounded-lg border-2; */
  @apply font-street-fighter hover:opacity-70;
}

article.FaceOffItem {
  @apply text-center
}
article.FaceOffItem.ThreeWay>* {
  @apply w-1/5
}
article.FaceOffItem.TwoWay>* {
  @apply w-1/3
}

article.FaceOffItem>div {
  @apply flex items-center justify-center
}

article.FaceOffItem>.ContenderName {
  @apply text-4xl;
}

article.FaceOffItem>.VersusImage img {
  @apply max-h-16
}
</style>
