
import { defineStore } from 'pinia';
import {areaChart} from "@/api/common.js";
import {nextTick} from "vue";
import {ElMessage} from "element-plus";
// import { getCurrentInstance } from "vue";

// const {proxy} = getCurrentInstance();
export const useDemoStore = defineStore("deviceDetection", {
    state: () => {
        return {
            aChart: {
                xAxis: [],
                series: []
            },
            bChart: {
                xAxis: [],
                series: []
            }
        }
    },
    actions: {
        getData() {
            // console.log('demo', proxy)


        }
    }
})

