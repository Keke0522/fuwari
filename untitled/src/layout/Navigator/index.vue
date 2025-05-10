<template>
<!--  <el-button @click="isCollapsea" style="border: none; display: block; margin: 0 auto;">-->
<!--    <el-icon v-if="isCollapse"><Fold /></el-icon>-->
<!--    <el-icon v-else><Expand /></el-icon>-->
<!--  </el-button>-->

  <el-menu
      :router="true"
      :active-text-color="themeInfo[theme].color"
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :unique-opened="false"
      style="display: flex; flex-direction: column; height: 100%;"
  >
    <template v-for="(route, index) in routerStore.routes" :key="index">
      <!-- 判断路由是否隐藏，确保 meta 和 meta.hidden 已定义 -->
      <el-menu-item
          v-if="!route.meta?.hidden && route.children && !route.children[0].children && route.children[0].meta.roles.includes(userStore.priority)"
          :index="route.path"
      >
        <el-icon>
          <component :is="route.children[0].meta.svgIcon"></component>
        </el-icon>
        <template #title>
          {{ route.children[0].meta.title }}
        </template>
      </el-menu-item>

      <el-sub-menu
          v-else-if="!route.meta?.hidden && route.children && route.children[0].children && route.children[0].meta.roles.includes(userStore.priority)"
          :index="route.path"
      >
        <template #title>
          <el-icon>
            <component :is="route.children[0].meta.svgIcon"></component>
          </el-icon>
          <span>{{ route.children[0].meta.title }}</span>
        </template>
        <template v-for="(child, childIndex) in route.children[0].children" :key="childIndex">
          <el-menu-item
              v-if="!child.meta?.hidden && child.meta.roles.includes(userStore.priority)"
              :index="child.path"
          >
            <el-icon>
              <component :is="child.meta.svgIcon"></component>
            </el-icon>
            <template #title><span>{{ child.meta.title }}</span></template>
          </el-menu-item>
        </template>
      </el-sub-menu>
    </template>

  </el-menu>
</template>

<script setup >
import {ref, getCurrentInstance, watch} from 'vue'
import { useRouterStore } from "@/stores/moduls/router.js";
import { useUserStore } from "@/stores/moduls/user.js";
import { useRoute } from "vue-router";
import {Expand, Fold} from "@element-plus/icons-vue";
// import {
//   Document,
//   Menu as IconMenu,
//   Location,
//   Setting,
//   HomeFilled,
// } from '@element-plus/icons-vue'
const props = defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
});
// 获取ws全局代理对象
const { proxy } = getCurrentInstance();
// 配置数据
const { appInfo, theme, themeInfo } = proxy.$config

const isCollapse = ref(props.collapse)

watch(() => props.collapse, (newValue) => {
  isCollapse.value = newValue
})
const isCollapsea = () => {
  isCollapse.value = !isCollapse.value
}
const routerStore = useRouterStore()
const userStore = useUserStore()
const route = useRoute();

let defaultActive = ref(route.path)
if(defaultActive.value == '/dashboard') {
  defaultActive.value = '/'
} else if (defaultActive.value == '/deviceLogs/index'){
  defaultActive.value = '/deviceLogs'
}



// const defaultActive = computed(() =>
//   console.log("defaultActive", route)
//   route.meta?.activePath? route.meta.activePath : route.path
// );
// const priority = userStore.priority * 1

</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {}

.el-menu .el-menu-item {
  font-weight: bold;
}

.el-menu .el-menu-item span {
  font-weight: bold;
}
.el-menu .el-sub-menu__title span {
  font-weight: bold;
}
</style>
