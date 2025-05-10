
import { ref } from "vue"
import store from "@/stores"
import { defineStore } from 'pinia';
// import router from "@/router"

import router, { resetRouter } from "@/router"
// {"id":"88","userName":"admin","priority":0}
// const router = useRouter()

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            id: '',
            userName: '',
            priority: '',
            keepAliveUser: {
                id: '',
                userName: '',
                priority: '',
            }
        }
    },
    actions: {
        async getUserInfo () {
            let LocalUser = await localStorage.getItem('user')
            // console.log("____getUserInfo____", LocalUser)
            LocalUser = !LocalUser || LocalUser == 'undefined'? null: JSON.parse(LocalUser) 
            // console.log("____getUserInfo__1__", LocalUser)
            if(!LocalUser || !LocalUser.id) {
                return
            }
            this.id = LocalUser.id
            this.userName = LocalUser.userName
            this.priority = LocalUser.priority
            this.keepAliveUser = {
                ...LocalUser
            }
            return LocalUser
        },
        logOut () {
            localStorage.removeItem('user')
            this.id = ''
            this.userName = ''
            this.priority = ''
            router.replace({'path': `/login`})
        },
        setUserInfo(data) {
            // console.log('setUserInfo', data)
            this.id = data.id
            this.userName = data.userName
            this.priority = data.priority
        }
    }
});

/** 在 setup 外使用 */
export function useUserStoreHook() {
    return useUserStore(store)
}
  

