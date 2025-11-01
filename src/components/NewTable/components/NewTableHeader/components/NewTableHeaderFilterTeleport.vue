<script setup lang="ts">
import { ref } from 'vue';

import type { INewTableChangeFilterValue } from '../../../types/NewTableEventTypes';
import type { INewTableFilters } from '../../../types/NewTableFilterTypes';

import { useOutsideClickHandler } from '../../../../../composables/useOutsideClickHandler';

const props = defineProps<{
  activeHeaderFilterName: string;
  filters?: INewTableFilters;
  computedFilterTeleportNames: Record<string, string>,
}>();

const emit = defineEmits<{
  (e: 'change:filter-value', event: INewTableChangeFilterValue): void;
  (e: 'close', event: string): void;
}>();

const el = ref<HTMLElement>();

useOutsideClickHandler(
  () => el.value,
  onClose,
)

function onClose() {
  emit('close', props.activeHeaderFilterName);
}
</script>

<template>
  <teleport
    v-if="!!activeHeaderFilterName && activeHeaderFilterName in (filters || {})"
    :to="`#${computedFilterTeleportNames[activeHeaderFilterName]}`"
  >
    <div
      ref="el"
      class="new-table__header__filter"
    >
      <component
        :is="props.filters[activeHeaderFilterName]?.component.name || 'input'"
        :value="props.filters[activeHeaderFilterName]?.currentValue"
        :default-value="props.filters[activeHeaderFilterName]?.defaultValue"
        :initial-value="props.filters[activeHeaderFilterName]?.initialValue"
        :filter="props.filters[activeHeaderFilterName]"
        v-bind="props.filters[activeHeaderFilterName]?.component.props || {}"
        v-on="{
          [props.filters[activeHeaderFilterName]?.component.changeEventName || 'change']:
            ($event) => emit('change:filter-value', { key: activeHeaderFilterName, value: $event }),
        }"
      />
    </div>
  </teleport>
</template>