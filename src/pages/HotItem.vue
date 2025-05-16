<template>
  <li class="flex justify-between items-center px-2 py-2 hover:bg-gray-100 rounded">
    <div class="flex items-start space-x-3">
      <span :class="['text-lg font-bold', highlight ? 'text-orange-400' : 'text-gray-500']">
        {{ index }}
      </span>
      <div>
        <div class="text-sm text-gray-800 font-medium">{{ title }}</div>
      </div>
    </div>
    <span class="text-xs text-gray-400">{{ tag }}</span>
  </li>
</template>

<script setup>
defineProps({
  index: String,
  title: String,
  tag: String,
  highlight: Boolean
})
</script>
