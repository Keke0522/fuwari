
<template>
  <svg class="svg-icon" aria-hidden="true" :style="{fontSize: size, backgroundColor: backgroundColor }">
    <use :href="symbolId" :fill="color"/>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from "vue"

const props = defineProps({
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#ffffff',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    size: {
      type: [Number, String],
      default: 20,
    },
    spin: {
      type: Boolean,
      default: false,
    },
  })

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>


<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
