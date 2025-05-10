// 指示面板接口

/**
 * 指示面板数据 获取所有数据
 * @param
 *  {
 CMD: "Dashboard",
 ARGV: {}  // 入参为空
 }
 * @returns
 * 参考 wsTestData.js 对应指令返回模拟数据范本
 */

export const getDevice_Msg = (params) => {
    let msg = {
        CMD: "getDevice_Msg",
        LOCALE: localStorage.getItem('locale'),  //'zh' 中文  'en'英文
        ARGV: {...params}
    }
    return JSON.stringify(msg)
}


// 本地数据
let wsTestData = {
    // 指示面板数据
    Dashboard: {
        "CMD": "getDevice_Msg", // 命令类型，表示请求设备信息
        "RESP": {
            "Data": {
                "linkinfos": {
                    "ipaddress": "192.168.1.220",
                    "MAC": "00:0A:35:00:07:35",
                    "BBVersion": " ",
                    "Wb_version": "",
                    "Kernel": " ",
                    "cpu_usage": "0.03",
                    "memory_usage": "0.02",
                    "dist_usage": "0.32",
                    "tem": "61.75",
                    "tem_wb": "0.00",
                    "hum": "9.97",                      // 当前湿度
                    "Net1": "Net_1  status: 'linkdown' , Rx: 'linkdown' , Tx: 'linkdown' , Tem: '0.00°C'",
                    "Net2": "Net_2  status: 'linkdown' , Rx: 'linkdown' , Tx: 'linkdown' , Tem: '0.00°C'",
                    "Net3": "Net_3  status: 'linkdown' , Rx: '-40.00dBm' , Tx: '-6.01dBm' , Tem: '51.00°C'",
                    "Net4": "Net_4  status: 'linkdown' , Rx: 'linkdown' , Tx: 'linkdown' , Tem: '0.00°C'"
                }
            }
        }
    }
}

export const getWsTestData = (dataName) => {
    return wsTestData[dataName]
}


