<script setup lang="ts">
import { computed, ref } from 'vue';

import type { ILocalNewTableRow } from '../../testdata/testNewReestrData';

import { useOutsideClickHandler } from '../../../../composables/useOutsideClickHandler';

import NewReestrSideMenuWrapper from '../NewReestrSideMenuWrapper/NewReestrSideMenuWrapper.vue';

const el = ref<typeof NewReestrSideMenuWrapper>();

useOutsideClickHandler(
  () => el.value.$el,
  close,
);
const props = defineProps<{
  data: ILocalNewTableRow[];
  payload?: unknown,
}>();

const emit = defineEmits<{
  (e: 'submit', event: {
    value: { priceSumms: number, customPriceSumms: number },
    payload: unknown
  }): void;
  (e: 'close'): void;
}>();

const priceSumms = computed<number>(
  () => props.data?.reduce(
    (acc: number, row: ILocalNewTableRow) => acc + row.data.priceTotal,
    0
  ),
);

const customPriceSumms = computed<number>(
  () => props.data?.reduce(
    (acc: number, row: ILocalNewTableRow) => acc + row.data.customPriceTotal,
    0
  ),
);

function close() {
  emit('close');
}
</script>

<template>
  <NewReestrSideMenuWrapper
    ref="el"
    @close="close"
  >
    <form
      class="new-reestr__side-menu__summs"
      @submit="emit(
        'submit',
        {
          value: { priceSumms, customPriceSumms },
          payload: props.payload,
        }
      )"
    >
      <div class="new-reestr__side-menu__summs__item">
        <span>price</span> <span class="--value">{{ priceSumms }}</span>
      </div>

      <div class="new-reestr__side-menu__summs__item">
        <span>customPrice</span> <span class="--value">{{ customPriceSumms }}</span>
      </div>

      <div style="flex: 1 1;" />

      <button type="submit">Close</button>
    </form>
  </NewReestrSideMenuWrapper>
</template>

<style lang="css" scoped>
.new-reestr__side-menu__summs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.new-reestr__side-menu__summs__item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  white-space: nowrap;
  text-wrap: nowrap;
}

.new-reestr__side-menu__summs__item .--value {
  font-weight: 600;
}
</style>
