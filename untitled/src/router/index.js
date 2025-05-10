import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore, useUserStoreHook } from "@/stores/moduls/user.js";
import { useRouterStore } from "@/stores/moduls/router.js";
import {i18n} from '@/plugins/i18n/index.js'

const Layout = () => import("@/layout/index.vue")
const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: i18n.global.t("common.Dashboard"),
          roles: ['-1', '0', '1', '2'],
          svgIcon: "Platform"
        }
      }
    ]
  },


  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/login",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_ROUTER_BASE),
  routes: routes
})
router.beforeEach(async (to, from, next) => {
  // 公共页面，任何时候都可以跳转
  if ( to.path === '/login') {
    localStorage.removeItem('user')
    next();
    return;
  }
  // 全局登录用户信息
  const userStore = useUserStore()
  let user = await userStore.getUserInfo()
  const userId = user && user.id? user.id : null
  // 无登录信息 跳转登录页面
  if (!userId && to.path !== `/login`) {
    // console.log("无登录信息 跳转登录页面", userId, to.path)
    localStorage.removeItem('user')
    next({ path: `/login` });
    return;
  }
  if(userId) {
    const priority = user && user.priority? user.priority : null
    router.getRoutes().forEach(route => {
      const { name, meta } = route
      if(meta && meta.roles && !meta.roles.includes(priority)) {
        // console.log('router.forEach', name)
        router.removeRoute(name)
      }
    });
    const routerStore = useRouterStore()
    routerStore.setRoutes(routes, userId, priority);
  }
  next();
});

/** 重置路由 */
export function resetRouter() {
  window.location.reload()
}

export default router
