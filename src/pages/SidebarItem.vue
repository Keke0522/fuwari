<template>
  <div class="flex items-center space-x-2 text-sm hover:text-blue-500 cursor-pointer">
    <span class="text-lg">{{ icon }}</span>
    <span>{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  name: String
})
</script>
