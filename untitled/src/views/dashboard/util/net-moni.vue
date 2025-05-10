<template>
  <div style="width: 100%; aspect-ratio: 2 / 0.9;">
    <teleport to="body">
      <!-- 弹窗显示图表 -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div :id="modalChartId" style="width: 90vw; aspect-ratio: 2 / 0.9;"></div>
        </div>
      </div>
    </teleport>

    <!-- 主图表显示 -->
    <div :id="chartId" style="width: 100%; aspect-ratio: 2 / 0.9;"></div>
  </div>
</template>

<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import * as echarts from 'echarts'

// 接收父组件传递的 props
const props = defineProps({
  id: {type: String, required: true},
  title: {type: String, required: true} // 仅用于标题
})

// 自定义事件，用于通知父组件销毁图表
const emit = defineEmits(['destroy'])

// DOM元素ID
const chartId = props.id
const modalChartId = `${chartId}-modal`
const myChart = ref(null)

// 控制弹窗的显示与隐藏
const showModal = ref(false)
const isVisible = ref(true)

// 用于保存实时数据的数组
const realtimeData = ref({
  Rx: [],
  Tx: [],
  温度: []
})

// 定时器，实时数据更新
let dataInterval = null

// 生成模拟的实时数据
const generateRealtimeData = () => {
  const now = Date.now()
  const initialData = {Rx: [], Tx: [], 温度: []}

  for (let i = 0; i < 600; i++) {
    const time = new Date(now - (600 - i) * 1000)
    initialData.Rx.push({time, value: Math.random() * 100})
    initialData.Tx.push({time, value: Math.random() * 100})
    initialData.温度.push({time, value: Math.random() * 40})
  }
  return initialData
}

// 生成历史数据
const generateHistoricalData = () => {
  const base = Date.now() - 24 * 60 * 60 * 1000
  const data = {Rx: [], Tx: [], 温度: []}

  for (let i = 0; i < 43200; i++) {
    const time = new Date(base + i * 60000)
    data.Rx.push({time, value: Math.random() * 100})
    data.Tx.push({time, value: Math.random() * 100})
    data.温度.push({time, value: Math.random() * 40})
  }
  return data
}

// 根据数据和模式生成图表配置
const getChartOption = (data, isModal = false) => {

  // 图表工具栏功能设置
  const toolboxFeatures = {
    restore: {},
    saveAsImage: {},
    myZoom: {
      show: true,
      title: isModal ? '关闭弹窗' : '查看详情',
      icon: 'path://M512 128a384 384 0 1 1-384 384A384 384 0 0 1 512 128m0-64a448 448 0 1 0 448 448A448 448 0 0 0 512 64z',
      onclick: () => (showModal.value = !showModal.value) // 弹窗显示切换
    }
  }

  // 非弹窗模式下添加销毁图表按钮
  if (!isModal) {
    toolboxFeatures.myClose = {
      show: true,
      title: '销毁图表',
      icon: 'path://M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm138.3 586.3c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L512 557.3l-93 93c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l93-93-93-93c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l93 93 93-93c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L557.3 512l93 93z',
      onclick: () => {
        if (myChart.value) myChart.value.dispose()
        isVisible.value = false
        emit('destroy') // 通知父组件销毁
      }
    }
  }
// 主 Y 轴配置 (dBm)
  const yAxisConfigLeft = {
    type: 'value',
    axisLabel: {
      fontSize: 10,
      formatter: '{value} dBm'
    },
    boundaryGap: [0, '10%']
  }

// 副 Y 轴配置 (°C)
  const yAxisConfigRight = {
    type: 'value',
    boundaryGap: [0, '10%'],
    axisLine: {show: true},
    axisLabel: {
      show: true,
      fontSize: 10,
      formatter: '{value} °C'
    }
  }

  return {
    tooltip: {trigger: 'axis', position: pt => [pt[0], '10%']}, // 工具提示
    title: {
      left: 'center',
      text: `${props.title}`,
      textStyle: {fontSize: 14}
    },
    grid: {top: 60, left: '10%', right: '10%', bottom: 65},
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        fontSize: 10,
        formatter: value => new Date(value).toTimeString().slice(0, isModal ? 5 : 8)
      }
    },
    yAxis: [
      yAxisConfigLeft, // 左侧 Y 轴（dBm）
      yAxisConfigRight // 右侧 Y 轴（°C）
    ],
    dataZoom: [
      {type: 'inside', start: isModal ? 0 : 80, end: 100},
      {type: 'slider', start: isModal ? 0 : 80, end: 100, height: 20}
    ],
    series: [
      {
        name: 'Rx',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {color: '#5470C6'},
        lineStyle: {width: 1},
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: 'rgba(84, 112, 198, 0.6)'},
            {offset: 1, color: 'rgba(84, 112, 198, 0.1)'}
          ])
        },
        data: data.Rx.map(d => [d.time.getTime(), d.value]),
        yAxisIndex: 0 // 使用左侧 Y 轴（dBm）
      },
      {
        name: 'Tx',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {color: '#91CC75'},
        lineStyle: {width: 1},
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: 'rgba(145, 204, 117, 0.6)'},
            {offset: 1, color: 'rgba(145, 204, 117, 0.1)'}
          ])
        },
        data: data.Tx.map(d => [d.time.getTime(), d.value]),
        yAxisIndex: 0 // 使用左侧 Y 轴（dBm）
      },
      {
        name: '温度',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {color: '#F3A4B5'},
        lineStyle: {width: 1},
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: 'rgba(243, 164, 181, 0.6)'},
            {offset: 1, color: 'rgba(243, 164, 181, 0.1)'}
          ])
        },
        data: data.温度.map(d => [d.time.getTime(), d.value]),
        yAxisIndex: 1 // 使用右侧 Y 轴（°C）
      }
    ],
    legend: {
      top: '25px',
      data: ['Rx', 'Tx', '温度'],
      selected: {
        'Rx': true,  // 默认显示
        'Tx': true,  // 默认显示
        '温度': true  // 默认显示
      }
    },
    toolbox: {
      itemSize: 12,
      right: '45px',
      feature: toolboxFeatures
    }
  }
}
let chartOption = null
const isUserZooming = ref(false) // 用户是否正在操作 dataZoom

const updateChart = () => {
  // 判断是否用户操作了 dataZoom，若是则不更新图表
  if (myChart.value && !isUserZooming.value) {
    if (!chartOption) {
      chartOption = getChartOption(realtimeData.value)
      myChart.value.setOption(chartOption)
    } else {
      chartOption.series.forEach((serie, index) => {
        serie.data = realtimeData.value[serie.name].map(d => [d.time.getTime(), d.value])
      })
      myChart.value.setOption({series: chartOption.series}, false)
    }
  }
}

onMounted(() => {
  const dom = document.getElementById(chartId)
  if (dom) {
    myChart.value = echarts.init(dom)
    realtimeData.value = generateRealtimeData() // 初始化实时数据
    updateChart()

    // 监听 dataZoom 事件，暂停数据更新
    myChart.value.on('dataZoom', () => {
      isUserZooming.value = true
      clearTimeout(zoomResetTimeout)
      zoomResetTimeout = setTimeout(() => {
        isUserZooming.value = false
      }, 3000) // 用户停止拖动 3 秒后才恢复更新
    })

    // 定时更新数据
    dataInterval = setInterval(() => {
      ['Rx', 'Tx', '温度'].forEach(type => {
        const lastValue = realtimeData.value[type][realtimeData.value[type].length - 1].value
        let newValue = lastValue + (Math.random() - 0.5) * 2
        if (type === '温度') newValue = Math.max(0, Math.min(50, newValue))
        realtimeData.value[type].push({
          time: new Date(),
          value: Number(newValue.toFixed(2))
        })

        if (realtimeData.value[type].length > 600) {
          realtimeData.value[type].shift()
        }
      })

      updateChart()
    }, 1000)
  }
})

// 监听弹窗显示
watch(showModal, async (visible) => {
  if (visible) {
    await nextTick()
    const modalDom = document.getElementById(modalChartId)
    if (modalDom) {
      const modalChart = echarts.init(modalDom)
      modalChart.setOption(getChartOption(generateHistoricalData(), true))
      window.addEventListener('resize', () => modalChart.resize()) // 弹窗中图表自适应
    }
  }
})

onBeforeUnmount(() => {
  if (dataInterval) clearInterval(dataInterval) // 清理定时器
  if (myChart.value) myChart.value.dispose() // 销毁图表实例
})

// 关闭弹窗和销毁图表
const closeModal = () => {
  showModal.value = false
  const modalDom = document.getElementById(modalChartId)
  if (modalDom) {
    const modalChart = echarts.getInstanceByDom(modalDom)
    if (modalChart) modalChart.dispose()
  }
}
</script>

<style scoped>
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
