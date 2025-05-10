import type { App } from "vue";
import axios from "axios";

let config: object = {};
// const { VITE_PUBLIC_PATH } = import.meta.env;

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

const getConfig = (key?: string) => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach(v => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};

/** 获取项目动态全局配置 */
export const getPlatformConfig = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig();
  return axios({
    method: "get",
    url: `/appConfig.json`
  })
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config;
     
      // 自动注入项目配置
      if (app && $config && typeof config === "object") {
        $config = Object.assign($config, config);
        config.Debug && console.log("__appConfig___", $config)

        app.config.globalProperties.$config = $config;

        // 设置全局配置
        setConfig($config);
      }
      return $config;
    })
    .catch(() => {
      throw "请在public文件夹下添加platform-config.json配置文件";
    });
};


/** 获取项目动态全局配置 */
export const getPlatformConfig2 = async (): Promise<undefined> => {
  return axios({
    method: "get",
    url: `/appConfig.json`
  })
    .then(({ data: config }) => {
      let $config = config
     
      // 自动注入项目配置
      if ( typeof config === "object") {
        config.Debug && console.log("getPlatformConfig2", config)

      }
      return $config;
    })
    .catch(() => {
      throw "请在public文件夹下添加platform-config.json配置文件";
    });
};

/** 本地响应式存储的命名空间 */
const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;

export { getConfig, setConfig, responsiveStorageNameSpace };
