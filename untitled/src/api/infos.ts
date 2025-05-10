import {http} from "../utils/http";
//ExcelJS
// import ExcelJS from "exceljs";

type Result = {
    data: Array<any>;
};
export const infosList = (data?: object, params?: object) => {
    return http.request<Result>("post", "/infos/list", {
        data
    });
};
export const ShippingListId = (data?: object, params?: object) => {
    return http.request<Result>("post", "/scxt/shipping-list/getById", {
        params,
        data
    });
};
export const ShippingListAdd = (data?: object, params?: object) => {
    return http.request<Result>("post", "/scxt/shipping-list/add", {
        params,
        data
    });
};
export const ShippingListUpdate = (data?: object) => {
    return http.request<Result>("post", "/scxt/shipping-list/update", {data});
};
export const ShippingListDelete = (data?: object) => {
    return http.request<Result>("post", "/scxt/shipping-list/delete", {
        data
    });
};

export const ShippingInfoList = (data?: object, params?: object) => {
    return http.request<Result>("post", "/scxt/shipping-info/list", {
        params,
        data
    });
};
export const ShippingInfoId = (data?: object, params?: object) => {
    return http.request<Result>("post", "/scxt/shipping-info/getById", {
        params,
        data
    });
};
export const ShippingInfoAdd = (data?: object, params?: object) => {
    return http.request<Result>("post", "/scxt/shipping-info/add", {
        params,
        data
    });
};
export const ShippingInfoUpdate = (data?: object) => {
    return http.request<Result>("post", "/scxt/shipping-info/update", {data});
};
export const ShippingInfoDelete = (data?: object) => {
    return http.request<Result>("post", "/scxt/shipping-info/delete", {
        data
    });
};
export const ShippingOut = (data?: object, params?: object) => {
    return http.request<Result>("post", "/scxt/shipping-info/out", {
        params,
        data
    });
};
