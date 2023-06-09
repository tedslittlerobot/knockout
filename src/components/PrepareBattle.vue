<script setup lang="ts">
import stores from '@/stores';
import type { PrepareBattleRoute } from '@/stores/ux';
import { computed, ref } from 'vue';
import swatch from "@/helpers/swatches";

const props = defineProps<{ route: PrepareBattleRoute }>()

const ux = stores.ux()
const rosters = stores.rosters()
const battle = stores.battle()

const roster = computed(() => rosters.rosters.find(item => item.id === props.route.rosterId)!)
const exclusions = ref<string[]>([])

function doBattle() {
  battle.begin(roster.value, exclusions.value)

  ux.route = { route: 'battle:face-off' }
}

function toggleExclusion(contenderId: string) {
  if (exclusions.value.includes(contenderId)) {
    exclusions.value.splice(exclusions.value.indexOf(contenderId), 1)
  } else {
    exclusions.value.push(contenderId)
  }
}

</script>

<template>
  <h2>Who will be participating?</h2>

  <p>Click on a name to toggle whether they are participating or not.</p>

  <section class="grid grid-cols-3 gap-4">
    <article
      v-for="(contender, index) in roster.contenders"
      :key="contender.id"
      class="street-fighter"
      :class="{
        [swatch('battleText', index).text]: !exclusions.includes(contender.id),
        // [`${swatch[index % swatch.length]}`]: !exclusions.includes(contender.id),
        'border-gray-400 text-gray-400 opacity-30': exclusions.includes(contender.id),
      }"
      @click.exact="toggleExclusion(contender.id)"
    >
      {{ contender.name }}
    </article>
  </section>

  <div
    class="btn-teal mt-8"
    @click.exact="doBattle"
  >
    Go!
  </div>
</template>

<style scoped>
h2 {
  @apply text-4xl font-street-fighter;
  @apply mt-10 mb-4;
}

p {
  @apply font-street-fighter text-center
}

article {
  @apply flex items-center justify-center;
  @apply h-28 cursor-pointer font-extralight text-3xl;
  /* @apply rounded-lg border-2; */
  @apply font-street-fighter hover:opacity-70;
}
</style>
