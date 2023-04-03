<script setup lang="ts">
import stores from '@/stores'
import type { HomeRoute } from '@/stores/ux';

defineProps<{ route: HomeRoute }>()

const rosters = stores.rosters()
const ux = stores.ux()
</script>

<template>
  <section class="my-8 flex justify-center">
    <div class="flex flex-col gap-4">
      <div class="Roster" v-for="roster in rosters.rosters">
        <div class="flex">
          <div class="grow">
            <h3>{{ roster.name }}</h3>
            <h4>{{ roster.contenders.length }} contenders</h4>
          </div>
          <div>
            <div class="EditButton" @click="ux.route = { route: 'roster:update', rosterId: roster.id }">✏️</div>
          </div>
        </div>

        <div
          class="mt-4 btn-fuchsia"
          @click.exact="ux.route = { 'route': 'battle:prepare', rosterId: roster.id }"
        >
          Launch!
        </div>

      </div>
    </div>
  </section>

  <div
    class="btn-teal"
    @click.exact="ux.route = { route: 'roster:create' }"
  >
    Create Roster
  </div>
</template>

<style scoped>
.Roster {
  @apply border-2 border-fuchsia-600 p-4 w-full sm:w-96;
  @apply rounded-lg;
}
.Roster h3 {
  @apply font-bold;
}
.Roster h4 {
  @apply font-light text-xs;
}

.EditButton {
  @apply cursor-pointer;
  @apply rounded-full w-8 h-8 hover:bg-blue-300 hover:bg-opacity-20;
  @apply flex items-center justify-center;
}
</style>
