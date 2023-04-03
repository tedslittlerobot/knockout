<script setup lang="ts">
import Router from './Router.vue';

</script>

<template>
  <header>
    <h1>Knockout</h1>
  </header>

  <main>
    <Router />
  </main>
</template>

<style scoped>
header {
  @apply mb-5
}
h1 {
  @apply text-6xl text-center text-fuchsia-400
}
main {
  @apply lg:w-[960px]
}
</style>
