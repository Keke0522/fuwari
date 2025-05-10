
import store from "@/stores"
import { defineStore } from 'pinia';

export const useRouterStore = defineStore("router", {
    state: () => {
        return {
            userId: '',
            priority: '',
            routes:[]
        }
    },
    actions: {
        // 权限路由保存 
        setRoutes(data, userId, priority) {
            // 用户权限一致则无需重复保存菜单
            if(this.userId == userId && this.priority == priority) {
                return
            }
            this.userId = userId
            this.priority = priority
            this.routes = data
        }
    }
});

/** 在 setup 外使用 */
export function useRouterStoreHook() {
    return useRouterStore(store)
}