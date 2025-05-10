// import Vue from 'vue'
// import VueI18n from 'vue-i18n'
import { createI18n } from "vue-i18n";
// import Cookies from 'js-cookie'
// element-plus国际化
import enElementPlus from "element-plus/dist/locale/en.mjs";
import zhElementPlus from "element-plus/dist/locale/zh-cn.mjs";

import enLocale from './en.js' // 导入项目中用到的英文语言包
import zhLocale from './zh.js'// 导入项目中用到的中文语言包


const messages = {
  en: {
    ...enLocale,
    ...enElementPlus,
    message: {
      hello: 'hello world',
      home: 'home'
    }
  },
  zh: {
    ...zhLocale,
    ...zhElementPlus,
    message: {
      hello: 'こんにちは、世界',
      home: '首页'
    }
  }
}

let locale = 'zh'
locale = localStorage.getItem('locale')? localStorage.getItem('locale'): localStorage.setItem('locale', locale)

export const i18n = createI18n({
  legacy: false,
  locale: locale,
  fallbackLocale: "en",
  messages
});

export function useI18n(app) {

  // 缓存与 appConfig配置语言不一致时 采用appConfig配置语言 存入缓存 强制刷新页面刷新页面转换语言
  if(i18n.global.locale.value != app.config.globalProperties.$config.locale) {
    i18n.global.locale.value = app.config.globalProperties.$config.locale
    localStorage.setItem('locale', i18n.global.locale.value)
    // console.log('18111111111111111111111111111111')
    window.location.reload('locale')
  }
  
  app.use(i18n);
}

// export default new VueI18n({
//   locale: localStorage.getItem('lang') || 'zh_CN', // set locale
//   messages, // set locale messages
// })

