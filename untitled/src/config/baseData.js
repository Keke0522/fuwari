
const baseData = {
    // 温度 温度范围-50~+100℃，温度范围内分为四挡：
    // 1)<-33℃：低温告警；
    // 2)-33~+55℃：正常温度范围
    // 3)-55~+70℃：高温警告
    // 4)>70℃：严重警告
    temperatureRange:{
        min: -50,
        max: 100
    },
    // 湿度 
    humidityRange:{
        min: -50,
        max: 100
    },
    // 无线配置 信道带宽/MHz 下拉框
    bandwidth:[
        { id: 1, label: '28MHz', value: 8 },
        { id: 2, label: '56MHz', value: 12 },
        { id: 3, label: '112MHz', value: 15 }
    ],
    // 无线配置 调制模式/QAM 下拉框
    modulation:[
			{id: 0, label:'Auto', value: 0},
			{id: 0, label:'QPSK', value: 2},
			{id: 0, label:'8QAM', value: 3},
			{id: 0, label:'16QAM', value: 4},
			{id: 0, label:'32QAM', value: 5},
			{id: 0, label:'64QAM', value: 6},
			{id: 0, label:'128QAM', value: 7},
			{id: 0, label:'256QAM', value: 8},
			{id: 0, label:'512QAM', value: 9},
			{id: 0, label:'1024QAM', value: 10}
    ],
    // 无线配置 数据源 下拉框
    dataSource:[
        { id: 1, label: 'Ethernet', value: 0},
        { id: 2, label: 'PRBS', value: 1},
        { id: 3, label: 'UserDefined', value: 2},
    ],
    // 无线配置 发送功率 范围
    transmissionPower: {
        min: 0,
        max: 25
    },
    // 无线配置 接受增益 范围
    receiverGain: {
        min: 0,
        max: 25
    },
//网口配置
    list1tab:{
        zt: [{
            value: 'UP',
            label: 'UP'
        },{
            value: 'Down',
            label: 'Down'
        }],
        sl: [{
            value: '100ME',
            label: '100ME'
        },{
            value: 'GE',
            label: 'GE'
        },{
            value: '10GE',
            label: '10GE'
        },{
            value: 'FE',
            label: 'FE'
        }]
    },
    logErrNo: {
        0: {rank: {label:'非告警',value: 0},partition: '无告警',suggest: '无建议'},
        1: {rank: {label:'紧急故障',value: 1},partition: '设备不可达（ping不通）',suggest: '检查设备电源、网线、设备状态等'},
        2: {rank: {label:'紧急故障',value: 1},partition: '北向接口未启用',suggest: '检查设备配置'},
        3: {rank: {label:'紧急故障',value: 1},partition: '基带文件丢失',suggest: '检查设备配置'},
        4: {rank: {label:'紧急故障',value: 1},partition: '基带驱动异常',suggest: '检查设备配置'},
        5: {rank: {label:'紧急故障',value: 1},partition: '基带运行异常',suggest: '检查设备配置'},
        6: {rank: {label:'紧急故障',value: 1},partition: '基带不匹配（异常丢包）',suggest: '检查设备配置'},
        7: {rank: {label:'紧急故障',value: 1},partition: '数据库文件缺失',suggest: '检查设备配置'},
        8: {rank: {label:'紧急故障',value: 1},partition: '数据库驱动异常',suggest: '检查设备配置'},
        9: {rank: {label:'紧急故障',value: 1},partition: '数据库驱动异常',suggest: '检查设备配置'},
        10: {rank: {label:'紧急故障',value: 1},partition: '微波驱动异常',suggest: '检查设备配置'},
        11: {rank: {label:'紧急故障',value: 1},partition: '微波频率失锁',suggest: '检查设备配置'},
        12: {rank: {label:'紧急故障',value: 1},partition: '信道带宽失配',suggest: '检查设备配置'},
        13: {rank: {label:'紧急故障',value: 1},partition: '微波发射功放故障',suggest: '检查设备配置'},
        14: {rank: {label:'紧急故障',value: 1},partition: '微波本端发送异常',suggest: '检查设备配置'},
        15: {rank: {label:'紧急故障',value: 1},partition: '微波本端接收异常',suggest: '检查设备配置'},
        16: {rank: {label:'紧急故障',value: 1},partition: '微波对端发射异常',suggest: '检查设备配置'},
        17: {rank: {label:'紧急故障',value: 1},partition: '同步丢失',suggest: '检查设备配置'},
        18: {rank: {label:'紧急故障',value: 1},partition: '信号中断',suggest: '检查设备配置'},
        19: {rank: {label:'紧急故障',value: 1},partition: '物理端口down',suggest: '检查设备配置'},


        50: {rank: {label:'一般故障',value: 2},partition: '连续登录失败',suggest: '检查设备配置'},
        51: {rank: {label:'一般故障',value: 2},partition: '空口交互数据失败',suggest: '检查设备配置'},
        52: {rank: {label:'一般故障',value: 2},partition: 'SyncE同步失败',suggest: '检查设备配置'},
        53: {rank: {label:'一般故障',value: 2},partition: '光口无连接',suggest: '检查设备配置'},
        54: {rank: {label:'一般故障',value: 2},partition: '微空口速率过低',suggest: '检查设备配置'},
        55: {rank: {label:'一般故障',value: 2},partition: '更新失败',suggest: '检查设备配置'},
        56: {rank: {label:'一般故障',value: 2},partition: 'SyncE配置失败',suggest: '检查设备配置'},
        57: {rank: {label:'一般故障',value: 2},partition: '1588V2配置失败',suggest: '检查设备配置'},
        58: {rank: {label:'一般故障',value: 2},partition: 'XPIC配置失败',suggest: '检查设备配置'},
        59: {rank: {label:'一般故障',value: 2},partition: 'MIMO配置失败',suggest: '检查设备配置'},
        60: {rank: {label:'一般故障',value: 2},partition: '命令执行失败',suggest: '检查设备配置'},


        101: {rank: {label:'一般故障',value: 2},partition: '发信功率不足',suggest: '检查设备配置'},
        102: {rank: {label:'一般故障',value: 2},partition: '发信功率过高',suggest: '检查设备配置'},
        103: {rank: {label:'一般故障',value: 2},partition: '接收光功过高',suggest: '检查设备配置'},
        104: {rank: {label:'一般故障',value: 2},partition: '接收光功过低',suggest: '检查设备配置'},
        105: {rank: {label:'一般故障',value: 2},partition: 'BER值偏高',suggest: '检查设备配置'},
        106: {rank: {label:'一般故障',value: 2},partition: '壳体温度过高',suggest: '检查设备配置'},
        107: {rank: {label:'一般故障',value: 2},partition: '壳体湿度过高',suggest: '检查设备配置'},
        108: {rank: {label:'一般故障',value: 2},partition: 'CPU利用率过高',suggest: '检查设备配置'},
        109: {rank: {label:'一般故障',value: 2},partition: '硬盘使用率过高',suggest: '检查设备配置'},
        110: {rank: {label:'一般故障',value: 2},partition: '空口载荷比偏高',suggest: '检查设备配置'},
    },
    //下拉框
    "rank": [
        { label:  "全部", value: 0},
        { label:  "紧急告警", value: 1},
        { label:  "一般故障", value: 2},
        { label:  "风险警告", value: 3},
        { label:  "正常", value: 4 }
    ],
    status:[
        { label: "全部", value: "0"},
        { label: "已读", value: "1"},
        { label: "未读", value: "2"},
        { label: "已关闭", value: "3"},
        { label: "未关闭", value: "4"},
        { label: "已处理", value: "5"},
        { label: "未处理", value: "6"}
    ],
    //左侧统计
    statisticsStatus:{
        1:{ label: "紧急", color: "darkred"},
        2:{ label: "一般", color: "red"},
        3:{ label: "风险", color: "yellow"},
        4:{ label: "未关闭", color: "#F56C6C"},
        5:{ label: "未处理", color: "#67C23A"},
        6:{ label: "未读", color: "#67C23A"}
    },
    // 频谱图坐标  频谱图：横坐标：【0,200,20】，单位MHz； 纵坐标【-110,10,20】，单位dB 星座图，最大范围是【-32,32,2】，根据接收调制来进行缩放
    spectrumAxis: {
        xAxis: {
            min: 0,
            max: 1024,
            // interval: 20,
        },
        yAxis: {
          min: -110,
          max: 10,
        //   interval: 20,
        }
    },
    graph:{
        // 频谱图
		spectrum: {
			min: 0,
			max: 200,
			step: 20,
			Unit: "MHz",
		},
        // 星座图
		constel: {
			min: -32,
			max: 32,
			step: 2,
			Unit: "",
		}
	}
}

// 获取基础数据方法 参数：对象对应属性名
const getBaseData = (dataName) => {
    return baseData[dataName]
}

export {
    getBaseData
}
