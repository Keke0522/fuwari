
// 应用配置文件
const  appConfig = {
    // 应用基本数据 如： 名字等
    info: {
        deviceName: 'HC8000型IP微波',
        logo: ''
    },
    // 是否本地测试数据模式 按页面开启 true 走本地数据 false 走嵌入式ws数据
    testData: {
        login: true,
        // 指示面板
        dashboard: false,
        // 网口状态
        netStaus: false,
        //告警日志
        deviceLogs: false,
        // 无线状态  本端
        wirelessStatusLocal: true,
        // 无线状态  对端
        wirelessStatusRemotes: true,
        // 无线配置
        wireless: true,
         // 天线对焦
        antennaFocusing: true,
    }
}


export {
    appConfig
}

