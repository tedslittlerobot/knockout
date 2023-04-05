<script setup lang="ts">
import stores from '@/stores';
import { ref, watch, onMounted } from 'vue';
import { v4 as uuid4 } from 'uuid'
import type { CreateRosterRoute } from '@/stores/ux';

defineProps<{ route: CreateRosterRoute }>()

const rosters = stores.rosters()
const ux = stores.ux()

const name = ref<string>('')
const nameElement = ref<HTMLElement|null>(null)
const contenders = ref<{ id: string, name: string, avoid: string }[]>([{ id: uuid4(), name: '', avoid: '' }])
const contenderElements = ref<HTMLElement[]>([])

watch(contenderElements.value, (oldV, newV) => {
  if (newV.length === 1) {
    return;
  }

  (newV[newV.length - 1].children.item(0)! as HTMLElement).focus()
})

onMounted(() => {
  nameElement.value?.focus()
})

function addContender() {
  if (contenders.value[contenders.value.length - 1].name.length === 0) {
    return;
  }

  contenders.value.push({ id: uuid4(), name: '', avoid: '' })
}

function save() {
  if (!name.value || contenders.value.length === 0) {
    console.error('Validation Error')
    return
  }

  const created = {
    id: uuid4(),
    name: name.value,
    contenders: contenders.value
      .filter(({ name }) => name.length > 0)
      .map(({id, name, avoid}) => ({
        id,
        name,
        avoid: avoid ? new RegExp(avoid) : null
      })),
  }

  rosters.add(created)

  ux.route = { route: 'battle:prepare', rosterId: created.id }
}
</script>

<template>
  <h2>New Roster</h2>

  <label for="RosterName" class="RosterNameInput">
    Roster Name:
    <input id="RosterName" type="text" ref="nameElement" v-model="name" />
  </label>

  <section>
    <h3>Contenders:</h3>
    <article
      v-for="(contender, index) in contenders"
      :key="index"
      ref="contenderElements"
    >
      <label :for="`ContenderNameInput-${index}`">
        Name
        <input
          :id="`ContenderNameInput-${index}`"
          type="text"
          :class="{ Empty: contenders[index].name.length === 0 }"
          v-model="contenders[index].name"
          @keyup.enter.exact="addContender"
          @keyup.meta.enter.exact="save"
          @keyup.ctrl.enter.exact="save"
        />
      </label>
      <label :for="`ContenderAvoidInput-${index}`">
        Avoid
        <input
          :id="`ContenderAvoidInput-${index}`"
          type="text"
          :class="{ Empty: contenders[index].avoid.length === 0 }"
          v-model="contenders[index].avoid"
          @keyup.enter.exact="addContender"
          @keyup.meta.enter.exact="save"
          @keyup.ctrl.enter.exact="save"
        />
      </label>
    </article>
  </section>

  <p>Press "enter" while typing a contender name to add another contender.</p>

  <p>This will save this roster to your Browser's localstorage, so as long as you do not change browsers or use private browsing, this will persist across sessions. No data is sent to any other locaations.</p>

  <div class="btn-cyan" @click="save">Save</div>
</template>

<style scoped>
h2 {
  @apply text-2xl text-cyan-300;
  @apply border-b-4 border-cyan-600;
  @apply mt-4 mb-6 pb-2;
}

p {
  @apply my-8;
}

section {
  @apply my-8;
}

.RosterNameInput {
  @apply text-gray-200 font-light text-xl
}

.RosterNameInput input {
  @apply bg-transparent border-b-2 border-cyan-400 rounded-md text-white;
  @apply w-full text-lg font-normal;
  @apply py-1 px-3;
}

section h3 {
  @apply text-gray-200 font-light text-xl mb-4
}

article {
  @apply flex flex-row gap-4 mb-4
}

article>* {
  @apply w-1/2
}

article label {
  @apply text-gray-200 font-thin text-sm
}

article input {
  @apply bg-transparent border-b-2 border-emerald-400 rounded-md text-white;
  @apply w-full text-lg font-normal;
  @apply py-1 px-3;
}

article input.Empty {
  @apply opacity-50
}
article input.Empty:focus {
  @apply opacity-100
}
</style>
