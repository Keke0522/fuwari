<script setup>
import { ref } from "vue"
import { useUserStore } from "@/stores/moduls/user.js";

defineOptions({
  name: "wireless"
})
const userStore = useUserStore()
const text = ref("")

</script>

<template>
  <div>
      无线配置
      用户信息 {{ userStore.id }}/{{ userStore.userName }}/{{ userStore.priority }}
  </div>
</template>
