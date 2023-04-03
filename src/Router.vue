<script setup lang="ts">
import stores from './stores';
import Home from "./components/Home.vue";
import CreateRoster from "./components/CreateRoster.vue";
import UpdateRoster from './components/UpdateRoster.vue';
import PrepareBattle from './components/PrepareBattle.vue';

const ux = stores.ux();
</script>

<template>
  <Home v-if="ux.route.route === 'home'" :route="ux.route" />
  <CreateRoster v-else-if="ux.route.route === 'roster:create'" :route="ux.route" />
  <UpdateRoster v-else-if="ux.route.route === 'roster:update'" :route="ux.route" />
  <PrepareBattle v-else-if="ux.route.route === 'battle:prepare'" :route="ux.route" />
</template>
