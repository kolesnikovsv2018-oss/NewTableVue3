/**
 Проблема

 начиная с Vue 3.3, слушатели событий (@dblclick, @click, ...) в $attrs приходят в виде onXxx пропов, например:
 $attrs = {
  onDblclick: () => { ... },
  onMouseenter: () => { ... }
 }

 И если ты делаешь просто:
 <GrandChild v-on="$attrs" />

 → Vue превращает это в атрибут on-dblclick для <GrandChild />.

 → Когда GrandChild делает то же самое (v-on="$attrs"), то Vue снова оборачивает имена обработчиков, и выходит on-on-dblclick.
 
 То есть цепочка превращается в:
 @dblclick → onDblclick → on-on-dblclick → on-on-on-dblclick ...


 Решение 1. Явная нормализация событий через Object.entries()

 Чтобы избежать накопления on-, тебе нужно вручную «нормализовать» $attrs, оставляя ключи без повторного префикса on.
 
 Пример — создаём хелпер для проброса событий дальше:

 <!-- Child.vue -->
 <template>
   <GrandChild v-bind="normalizedAttrs" />
 </template>
 
 <script setup>
 import { computed, useAttrs } from 'vue'
 import GrandChild from './GrandChild.vue'
 
 const attrs = useAttrs()
 
 // Нормализуем: снимаем лишний "on" и создаём чистый объект для v-on
 const normalizedAttrs = computed(() => {
   const res = {}
   for (const [key, val] of Object.entries(attrs)) {
     if (key.startsWith('on')) {
       // превращаем onDblclick → dblclick
       const event = key.slice(2).toLowerCase()
       res[event] = val
     } else {
       res[key] = val
     }
   }
   return res
 })
 </script>

 
 Теперь можно безопасно делать дальше:

 <GrandChild v-on="normalizedAttrs" />

 🔹 и Vue не будет накапливать on-
 🔹 событие @dblclick дойдёт до самого родителя

 */


// useNormalizedListeners.js
import { computed } from 'vue'

export function useNormalizedListeners(attrs) {
  return computed(() => {
    const res = {}
    for (const [key, val] of Object.entries(attrs)) {
      if (key.startsWith('on')) {
        res[key.slice(2).toLowerCase()] = val
      }
    }
    return res
  })
}

