This folder contains cell components used by NewTable.

Each component follows a simple contract:
- Props: { value, row?, column?, mode?: 'view'|'edit' }
- Emits: 'update:value' with the new value when editing completes.

Naming: components are referenced by name in `src/components/NewTable/constants/columns.ts` under `components[component].name`.

Usage example:
```vue
<script setup lang="ts">
import { PriceComponent } from './components/cells'
</script>

<template>
  <PriceComponent :value="row.name" :row="row" :column="col" mode="edit" @update:value="v => row.name = v" />
</template>
```