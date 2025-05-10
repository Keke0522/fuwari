// 公共接口文件

/**
 * 登录接口
 * @param
 *  {
        CMD: "Login",           // 指令名称 大驼峰
        ARGV: {                 // 入参对象  入参字段 小驼峰
            userName: String,   // 用户名
            password: String | Number,       // 密码
            temporaryAuthorization: Boolean  // 临时授权  默认false
        }
    }
 * @returns
    {
        CMD: "Login",               // 入参对象 与接口指令一致
        RESP: {                 // 返回结果对象 出参字段 小驼峰
            Code: "200",            // 接口状态码
            Msg: "登录成功",     // 接口返回消息说明
            Data:{                  // 接口返回数据对象
                id: "88",           // 数据id
                userName: "123",    // 用户名
                priority: "1",      // 权限数字或字符 0,1,2,3,4  4:临时授权
                temporaryAuthorization: Boolean  // 临时授权
                ... 其他
            },
        }
    }
*/
export const wsLogin = (params) => {
    let msg = {
        CMD: "Login",      // 指令名称
        LOCALE: localStorage.getItem('locale'),  //'zh' 中文  'en'英文
        ARGV: {...params}  // 指令参数
    }
    return JSON.stringify(msg)
}


/**
 * 频谱图数据
 * @param {*} params
 * @returns
 */
export const wsSpectrum = (params) => {
    let msg = {
        CMD: "Spectrum",
        LOCALE: localStorage.getItem('locale'),  //'zh' 中文  'en'英文
        ARGV: {...params}
    }
    return JSON.stringify(msg)
}


/**
 * 修改调试参数公用接口
 * @param {*} params
 * {
        paramsKey: "digitalLoopback"  // 修改字段名字
        value: false // 修改字段值
    }
 * @returns
 */
export const wsUpdateWireless = (params) => {
    let msg = {
        CMD: "UpdateWireless",
        LOCALE: localStorage.getItem('locale'),  //'zh' 中文  'en'英文
        ARGV: {...params}
    }
    return JSON.stringify(msg)
}


// 本地测试数据
let wsTestData = {
    // 指示面板数据
    Login: {
        "CMD": "Login",
        "RESP": {
            "Code": "200",
            "Msg": "登录成功",
            "Data": {
                "id": "88",
                "userName": "admin",
                "priority": "-1",
                "tempAuth": false,
            }
        }
    },
    wsUpdateWireless: {
        "CMD": "UpdateWireless",
        "RESP": {
            "Code": "200", // 成功200 错误20X
            "Msg": "修改成功", // 修改成功 || 修改失败或者失败原因
            "Data": {}
        }
    }
}

export const getWsTestData = (dataName) => {
    return wsTestData[dataName]
}


// 模拟ws动态数据
export const getWsCommonTestDataOnMessage = (dataName, fn, count=10, interval=1000) => {
    console.log("____getWsCommonTestDataOnMessage__1__")
    let countTemp = 1
    let timer = null
    if (!timer) {
        timer = setInterval(() => {
            if (countTemp >= count) {
              clearInterval(timer)
            }
            countTemp++
            fn && fn(wsTestData[dataName])

          }, interval)
    }
}








