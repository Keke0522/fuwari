import Axios, {type AxiosInstance, type AxiosRequestConfig, type CustomParamsSerializer} from "axios";
import type {PureHttpError, PureHttpRequestConfig, PureHttpResponse, RequestMethods} from "./types.d";
import {stringify} from "qs";
import NProgress from "./progress";
import {ElNotification} from 'element-plus';

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_URL,
    // 请求超时时间
    timeout: 10000,
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
    },
    // 数组格式参数序列化
    paramsSerializer: {
        serialize: stringify as unknown as CustomParamsSerializer
    }
};

class PureHttp {
    /** 初始化配置对象 */
    private static initConfig: PureHttpRequestConfig = {};
    /** 保存当前Axios实例对象 */
    private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

    constructor() {
        this.httpInterceptorsRequest();
        this.httpInterceptorsResponse();
    }

    /** 通用请求工具函数 */
    public request<T>(
        method: RequestMethods,
        url: string,
        param?: AxiosRequestConfig,
        axiosConfig?: PureHttpRequestConfig,
    ): Promise<T> {
        const config = {
            method,
            url,
            ...param,
            ...axiosConfig
        } as PureHttpRequestConfig;

        return new Promise((resolve, reject) => {
            PureHttp.axiosInstance
                .request(config)
                .then((response) => {
                    console.log('PureHttp.axiosInstance response:', response);
                    resolve(response);  // ✅ 改这里！
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public requests<T>(
        method: RequestMethods,
        url: string,
        data?: any,
        axiosConfig?: PureHttpRequestConfig,
    ): Promise<T> {
        const config = {
            method,
            url,
            data,
            ...axiosConfig
        } as PureHttpRequestConfig;

        return new Promise((resolve, reject) => {
            PureHttp.axiosInstance
                .request(config)
                .then((response) => {
                    console.log('PureHttp.axiosInstance response:', response);
                    resolve(response);  // ✅ 改这里！
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /** 单独抽离的post工具函数 */
    public post<T, P>(
        url: string,
        params?: AxiosRequestConfig<T>,
        config?: PureHttpRequestConfig
    ): Promise<P> {
        return this.request<P>("post", url, params, config);
    }

    /** 单独抽离的get工具函数 */
    public get<T, P>(
        url: string,
        params?: AxiosRequestConfig<T>,
        config?: PureHttpRequestConfig
    ): Promise<P> {
        return this.request<P>("get", url, params, config);
    }

    /** 请求拦截 */
    private httpInterceptorsRequest(): void {
        PureHttp.axiosInstance.interceptors.request.use(
            async (config: PureHttpRequestConfig): Promise<any> => {
                // 开启进度条动画
                NProgress.start();
                // 自定义请求前回调
                if (typeof config.beforeRequestCallback === "function") {
                    config.beforeRequestCallback(config);
                    return config;
                }
                if (PureHttp.initConfig.beforeRequestCallback) {
                    PureHttp.initConfig.beforeRequestCallback(config);
                    return config;
                }
                // 直接返回 config，不做 token 校验
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
    }

    /** 响应拦截 */
    private httpInterceptorsResponse(): void {
        const instance = PureHttp.axiosInstance;
        instance.interceptors.response.use(
            (response: PureHttpResponse) => {
                const $config = response.config;
                // 关闭进度条动画
                NProgress.done();
                if (typeof $config.beforeResponseCallback === "function") {
                    $config.beforeResponseCallback(response);
                    return response.data;
                }
                if (PureHttp.initConfig.beforeResponseCallback) {
                    PureHttp.initConfig.beforeResponseCallback(response);
                    return response.data;
                }
                return response.data;
            },
            (error: PureHttpError) => {
                const $error = error;
                console.log("error", error);
                $error.isCancelRequest = Axios.isCancel($error);
                NProgress.done();

                let errorMsg = {
                    code: error.response ? error.response.status : error.code,
                    msg: error.response ? error.response.statusText : error.message,
                    url: error.response ? error.response.config.url : error.config?.url,
                };

                ElNotification({
                    title: `Error: ${errorMsg.code}`,
                    message: `[${errorMsg.url}] ${errorMsg.msg}`,
                    type: 'error',
                });

                return Promise.reject($error);
            }
        );
    }
}

export const http = new PureHttp();
