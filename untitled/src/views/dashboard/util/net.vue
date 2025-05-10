<template>
  <div style="width: 100%; aspect-ratio: 2 / 1.2;">
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="nav-arrow left" @click="switchData(-1)">←</div>
          <div class="nav-arrow right" @click="switchData(1)">→</div>
          <div :id="modalChartId" class="chart-container"></div>
        </div>
      </div>
    </teleport>
    <div :id="chartId" class="chart-container"></div>
  </div>
</template>

<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import * as echarts from 'echarts'
import {infosList} from "../../../api/infos";

// Props & Emits
const props = defineProps({
  id: String,
  title: String,
  realtimeData: Object,
  mac: String,
})
const emit = defineEmits(['destroy'])
// 新增响应式变量
const titlesList = ['系统资源', '环境健康', 'NET1', 'NET2', 'NET3', 'NET4']
const currentModalIndex = ref(-1)
// Ref 定义
const chartId = props.id
const modalChartId = `${chartId}-modal`
const mainChart = ref(null)
const modalChart = ref(null)
const showModal = ref(false)
const isVisible = ref(true)
const isUserZooming = ref(false)

// Y轴配置项
const yAxisConfigs = {
  percent: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: {fontSize: 10, formatter: '{value} %'},
    boundaryGap: [0, '10%']
  },
  dBm: {
    type: 'value',
    axisLabel: {fontSize: 10, formatter: '{value} dBm'},
    boundaryGap: [0, '10%']
  },
  temp: {
    type: 'value',
    boundaryGap: [0, '10%'],
    axisLine: {show: true},
    axisLabel: {show: true, fontSize: 10, formatter: '{value} °C'}
  }
}

// 动态获取 Y 轴
const getYAxis = () => {
  const axisMap = {
    percent: ['cpu', '内存', '硬盘', '腔体湿度'],
    temp: ['腔体温度', '射频温度', '温度'],
    dBm: ['Rx', 'Tx']
  }

  const yAxisUsed = new Set()

  props.realtimeData.name.forEach(name => {
    for (const [key, fields] of Object.entries(axisMap)) {
      if (fields.includes(name)) {
        yAxisUsed.add(key)
      }
    }
  })

  return [...yAxisUsed].map(key => yAxisConfigs[key])
}

// 获取对应 Y 轴索引
const getYAxisIndex = (name, yAxisIndexMap) => {
  if (['cpu', '内存', '硬盘', '腔体湿度'].includes(name)) return yAxisIndexMap.get('percent')
  if (['腔体温度', '射频温度', '温度'].includes(name)) return yAxisIndexMap.get('temp')
  if (['Rx', 'Tx'].includes(name)) return yAxisIndexMap.get('dBm')
  return 0
}

// 图表配置
const getChartOption = (data, isModal = false) => {
  const yAxes = getYAxis()

  // 建立yAxis对应关系
  const yAxisIndexMap = new Map()
  yAxes.forEach((axis, idx) => {
    if (axis === yAxisConfigs.percent) yAxisIndexMap.set('percent', idx)
    if (axis === yAxisConfigs.temp) yAxisIndexMap.set('temp', idx)
    if (axis === yAxisConfigs.dBm) yAxisIndexMap.set('dBm', idx)
  })

  const colors = ['#5470C6', '#91CC75', '#F3A4B5', '#FAC858', '#EE6666']

  const createSeries = (name, color, yAxisIndex) => ({
    name,
    type: 'line',
    symbol: 'none',
    sampling: 'lttb',
    large: true,
    largeThreshold: 200,
    itemStyle: {color},
    lineStyle: {
      width: 1 // 这里设置线条宽度
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {offset: 0, color: `${color}99`},
        {offset: 1, color: `${color}1A`}
      ])
    },
    data: data[name].map(d => [d.time.getTime(), d.value]),
    yAxisIndex
  })

  const toolboxFeatures = {
    restore: {},
    saveAsImage: {},
    myZoom: {
      show: true,
      title: isModal ? '关闭弹窗' : '查看详情',
      icon: 'path://M512 128a384 384 0 1 1-384 384A384 384 0 0 1 512 128m0-64a448 448 0 1 0 448 448A448 448 0 0 0 512 64z',
      onclick: () => (showModal.value = !showModal.value)
    }
  }

  if (!isModal) {
    toolboxFeatures.myClose = {
      show: true,
      title: '销毁图表',
      icon: 'path://M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm138.3 586.3c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L512 557.3l-93 93c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l93-93-93-93c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l93 93 93-93c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L557.3 512l93 93z',
      onclick: () => {
        mainChart.value?.dispose()
        isVisible.value = false
        emit('destroy')
      }
    }
  }

  return {
    tooltip: {trigger: 'axis', position: pt => [pt[0], '10%']},
    title: {
      left: 'center',
      text: props.title,
      textStyle: {fontSize: 14}
    },

    legend: {top: '25px', data: data.name},
    grid: {top: 60, left: '10%', right: '10%', bottom: 65},
    xAxis: {
      type: 'time',
      boundaryGap: false,
      min: 'dataMin',
      max: 'dataMax',
      axisLabel: {
        fontSize: 10,
        formatter: v => new Date(v).toTimeString().slice(0, isModal ? 5 : 8)
      }
    },
    yAxis: yAxes,
    dataZoom: [
      {type: 'inside', start: isModal ? 90 : 80, end: 100},
      {type: 'slider', start: isModal ? 90 : 80, end: 100, height: 20}
    ],
    series: data.name.map((name, i) =>
        createSeries(name, colors[i % colors.length], getYAxisIndex(name, yAxisIndexMap))
    ),
    toolbox: {
      itemSize: 12,
      top: '10px',
      right: '1px',
      feature: {...toolboxFeatures}
    },
  }
}

// 初始化主图表
const initMainChart = () => {
  const dom = document.getElementById(chartId)
  if (!dom) return
  mainChart.value = echarts.init(dom)
  mainChart.value.setOption(getChartOption(props.realtimeData))

  mainChart.value.on('dataZoom', () => {
    isUserZooming.value = true
    clearTimeout(window._zoomTimeout)
    window._zoomTimeout = setTimeout(() => {
      isUserZooming.value = false
    }, 3000)
  })
}

// 实时数据更新
const updateMainChart = () => {
  if (!mainChart.value || isUserZooming.value) return

  const seriesData = props.realtimeData.name.map(name => {
    return {
      name,
      data: props.realtimeData[name].map(d => [d.time.getTime(), d.value])
    }
  })

  mainChart.value.setOption({
    series: seriesData
  })
}

// 生命周期
onMounted(initMainChart)
onBeforeUnmount(() => {
  mainChart.value?.dispose()
  modalChart.value?.dispose()
})

// 监听实时数据
watch(() => props.realtimeData, updateMainChart, {deep: true})


// 模拟24小时历史数据生成器
// 生成历史数据
const generateHistoricalData = (title) => {
  const params = {
    mac: props.mac,
    time: new Date().getTime() - 24 * 60 * 60 * 1000
  };

  return infosList(params).then(res => {
    if (res.code === 200) {
      const rawList = res.data;

      const data1 = {
        name: ['cpu', '内存', '硬盘'],
        cpu: [],
        内存: [],
        硬盘: []
      };
      const data2 = {
        name: ['腔体温度', '射频温度', '腔体湿度'],
        腔体温度: [],
        射频温度: [],
        腔体湿度: []
      };
      const data3 = {
        name: ['Rx', 'Tx', '温度'],
        Rx: [],
        Tx: [],
        温度: []
      };
      const data4 = {
        name: ['Rx', 'Tx', '温度'],
        Rx: [],
        Tx: [],
        温度: []
      };
      const data5 = {
        name: ['Rx', 'Tx', '温度'],
        Rx: [],
        Tx: [],
        温度: []
      };
      const data6 = {
        name: ['Rx', 'Tx', '温度'],
        Rx: [],
        Tx: [],
        温度: []
      };

      rawList.forEach(item => {
        const time = new Date(item.time);  // 👈 强制转成 Date 对象
        data1.cpu.push({time, value: Number(item.cpu) * 100});  // 顺便把 value 转成数字
        data1.内存.push({time, value: Number(item.memory) * 100});
        data1.硬盘.push({time, value: Number(item.disk) * 100});
        data2.腔体温度.push({time, value: Number(item.tem)});
        data2.射频温度.push({time, value: Number(item.temWb)});
        data2.腔体湿度.push({time, value: Number(item.hum)});
        data3.Rx.push({time, value: Number(item.net1Rx)});
        data3.Tx.push({time, value: Number(item.net1Tx)});
        data3.温度.push({time, value: Number(item.net1Tem)});
        data4.Rx.push({time, value: Number(item.net2Rx)});
        data4.Tx.push({time, value: Number(item.net2Tx)});
        data4.温度.push({time, value: Number(item.net2Tem)});
        data5.Rx.push({time, value: Number(item.net3Rx)});
        data5.Tx.push({time, value: Number(item.net3Tx)});
        data5.温度.push({time, value: Number(item.net3Tem)});
        data6.Rx.push({time, value: Number(item.net4Rx)});
        data6.Tx.push({time, value: Number(item.net4Tx)});
        data6.温度.push({time, value: Number(item.net4Tem)});
      });
      switch (title) {
        case '系统资源':
          return data1;
        case '环境健康':
          return data2;
        case 'NET1':
          return data3;
        case 'NET2':
          return data4;
        case 'NET3':
          return data5;
        case 'NET4':
          return data6;
        default:
          return data1;
      }
      return data;
    } else {
      console.error("获取历史数据失败：", res.msg);
      // 请求失败，返回空数据结构
      return {
        name: ['cpu', 'memory', 'disk'],
        cpu: [],
        memory: [],
        disk: []
      };
    }
  });
};

// 修改弹窗图表逻辑
watch(showModal, async (visible) => {
  if (visible) {
    const index = titlesList.indexOf(props.title)
    currentModalIndex.value = index !== -1 ? index : 0
    await nextTick()
    const modalDom = document.getElementById(modalChartId)
    if (modalDom) {
      modalChart.value = echarts.init(modalDom)
      await loadModalData()
      window.addEventListener('resize', handleModalResize)
    }
  } else {
    currentModalIndex.value = -1
    window.removeEventListener('resize', handleModalResize)
  }
})

// 新增切换数据方法
const switchData = (delta) => {
  currentModalIndex.value = (currentModalIndex.value + delta + titlesList.length) % titlesList.length
  loadModalData()
}

// 新增加载弹窗数据方法
const loadModalData = async () => {
  const data = await generateHistoricalData(titlesList[currentModalIndex.value])
  const option = getChartOption(data, true)
  option.title.text = `${titlesList[currentModalIndex.value]} - 历史数据(24h)`
  modalChart.value.setOption(option)
}

// 新增弹窗 resize 处理
const handleModalResize = () => {
  modalChart.value?.resize()
}

// 修改关闭弹窗方法
const closeModal = () => {
  showModal.value = false
  modalChart.value?.dispose()
  modalChart.value = null
}

</script>

<style scoped>
/* 新增箭头样式 */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 24px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  user-select: none;
  z-index: 1;
}

.nav-arrow:hover {
  background: rgba(0, 0, 0, 0.2);
}

.nav-arrow.left {
  left: 10px;
}

.nav-arrow.right {
  right: 10px;
}

/* 调整弹窗尺寸 */
.modal-content {
  width: 90vw;
  height: 80vh;
  max-width: 1200px;
  padding: 20px;
}

.modal-content .chart-container {
  height: calc(100% - 40px);
}

.chart-container {
  width: 100%;
  aspect-ratio: 2 / 1.2;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.modal-content {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  position: relative;
}
</style>
