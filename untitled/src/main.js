import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import {useI18n} from "@/plugins/i18n/index.js";

import ElementPlus from 'element-plus'
import * as ElIcons from '@element-plus/icons-vue'


import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
// import "@/styles/index.scss"
import WebSoket from '@/api/webSocket.js'

// import Echarts from "vue-echarts";
// icon svg 全局注册 不然不显示图标
import "virtual:svg-icons-register"
// 获取根目录配置文件
import {getPlatformConfig} from "./config";


const app = createApp(App)


for (const name in ElIcons) {
    app.component(name, ElIcons[name])
}

// let wsHost = import.meta.env.VITE_APP_API_WS_PATH

// let wsHost = `ws://${window.location.hostname}/ws/`
// let wsHost = `ws://${window.location.hostname}:8099/ws/`
// let wsHost = `ws://${window.location.hostname}:8099/websocket/`

// wss
let wsHost = `ws://${window.location.hostname}:8001/ws`

// let wsHost = 'ws://192.168.1.214:8099/ws/'
// let wsHost = `ws://localhost:8082/scxt/ws/47` //前端开发本地测试 WebSoket

app.config.globalProperties.$WebSoket = new WebSoket({
    //网址（端口是我下面的服务器的端口）
    'url': `${wsHost}`,
    // 重连次数
    'reconnectTimes': 1,
})

app.config.globalProperties.$WebSoket.onmessage((msg) => {
    let data = JSON.parse(msg)
})


// 禁止异常调试行为
const blockConsole = () => {
    // console.log('____________outerHeight', window.outerHeight, window.innerHeight, window.outerHeight - window.innerHeight)
    // 禁止右键菜单
    document.oncontextmenu = function (event) {
        event.preventDefault();
        // return false;
    };

    // 禁止键盘
    document.onkeydown = (event) => {
        // 禁止F12快捷键
        if (event.key === 'F12' || event.keyCode === 123) {
            event.preventDefault();
        }

        // 快捷键
        if (event.key === 'I' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
            event.preventDefault();
        }

        // 快捷键
        if (event.key === 'J' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
            event.preventDefault();
        }
    };
    // 调试台打开超过150px 执行
    if (window.outerHeight - window.innerHeight > 150 || window.outerWidth - window.innerWidth > 150) {
        document.body.innerHTML = "检测到非法调试,请关闭后刷新重试!";
        setInterval(() => {
            (function () {
                return false;
            }
                ['constructor']('debugger')
                ['call']());
        }, 50);
    }
}


let Debug = false

getPlatformConfig(app).then(async config => {
    config && config.Debug && console.log("main__host", window.location)

    Debug = config && config.Debug ? config.Debug : false

    // 禁止异常调试行为  prohibitDebug
    config && config.ProhibitDebug && blockConsole();
    document.title = config.locale == 'zh' ? '设备管理' : 'Device Manager'

    app.use(createPinia())
    app.use(useI18n)
    app.use(router)
    app.use(ElementPlus)
    app.mount('#app')
});


// // let reloadTimer = null
// let routerTimer = null
// // 监听页面加载  刷新页面跳转登录页面 并清除用户登录信息
// window.onload = function(ev) {
//   // reloadTimer = setTimeout(() => {
//
//     // if(reloadTimer) {
//     //   clearTimeout(reloadTimer)
//     // }
//
//     app.config.globalProperties.$WebSoket.close()
//
//     // 延迟页面跳转 服务重连时间
//
//     routerTimer = setTimeout(() => {
//       if(routerTimer) {
//         clearTimeout(routerTimer)
//       }
//       // 清除用户缓存
//       localStorage.removeItem('user')
//       router.replace({'path': `/login`})
//     },300)
//
//   // }, 50)   // 异步时间经测试 1毫秒appConfig已经就能获取
// }

