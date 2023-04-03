<script setup lang="ts">
import BattleRouter from './BattleRouter.vue';

</script>

<template>
  <header>
    <h1>Knockout</h1>
  </header>

  <main>
    <BattleRouter />
  </main>
</template>

<style scoped>
header {
  @apply mb-5
}
h1 {
  @apply text-6xl text-center text-fuchsia-400 font-street-fighter
}
main {
  @apply lg:w-[960px]
}
</style>
