<script setup lang="ts">
import { computed, ref } from 'vue';

import type { ILocalNewTableRow } from '../../../../pages/TestPage1/testdata/testData';

import { useOutsideClickHandler } from '../../../../composables/useOutsideClickHandler';

const el = ref();

useOutsideClickHandler(
  () => el.value,
  close,
);
const props = defineProps<{
  data: ILocalNewTableRow[];
  payload?: any,
}>();

const emit = defineEmits<{
  (e: 'submit', event: { value: { priceSumms: number, customPriceSumms: number }, payload: any }): void;
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
  <div
    ref="el"
    class="new-reestr-side-menu-summs"
  >
    <form @submit="emit(
      'submit',
      {
        value: { priceSumms, customPriceSumms },
        payload: props.payload,
      }
    )">
      <div class="new-reestr-side-menu-summs__item">
        <span>price</span>: <span>{{ priceSumms }}</span>
      </div>

      <div class="new-reestr-side-menu-summs__item">
        <span>customPrice</span>: <span>{{ customPriceSumms }}</span>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style lang="css" scoped>
.new-reestr-side-menu-summs {
  position: absolute;
  background-color: antiquewhite;
  z-index: 1001;
  right: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 6px;
  box-shadow: 0 0 5px 1px #777;
}

.new-reestr-side-menu-summs__item {
  text-wrap: nowrap;
  color: #333;
}
</style>
