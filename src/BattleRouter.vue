<script setup lang="ts">
import stores from './stores';
import RosterIndex from "./components/RosterIndex.vue";
import CreateRoster from "./components/CreateRoster.vue";
import UpdateRoster from './components/UpdateRoster.vue';
import PrepareBattle from './components/PrepareBattle.vue';
import FaceOff from './components/FaceOff.vue';

const ux = stores.ux();
</script>

<template>
  <RosterIndex v-if="ux.route.route === 'roster:index'" :route="ux.route" />
  <CreateRoster v-else-if="ux.route.route === 'roster:create'" :route="ux.route" />
  <UpdateRoster v-else-if="ux.route.route === 'roster:update'" :route="ux.route" />
  <PrepareBattle v-else-if="ux.route.route === 'battle:prepare'" :route="ux.route" />
  <FaceOff v-else-if="ux.route.route === 'battle:face-off'" :route="ux.route" />
</template>
