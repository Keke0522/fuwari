<script setup>
import { ref, getCurrentInstance } from 'vue';
import { RouterView } from 'vue-router'
import { useTheme } from "@/hooks/useTheme"


const { proxy } = getCurrentInstance();
const {  theme } = proxy.$config

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()

const { setTheme } = useTheme()

let themeName = ''
themeName = localStorage.getItem('appThemeName')

if(themeName != theme ) {
    themeName = theme
    setTheme(themeName)
}


</script>

<template>
  <RouterView />
</template>

