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
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import * as echarts from 'echarts'

// 接收父组件传递的 props
const props = defineProps({
  id: {type: String, required: true},
  title: {type: String, required: true},
  realtimeData: {type: Array, required: true} // 父组件传入的实时数据
})

// 自定义事件，用于通知父组件销毁图表
const emit = defineEmits(['destroy'])

const chartId = props.id
const modalChartId = `${chartId}-modal`
const myChart = ref(null)
const showModal = ref(false)
const isVisible = ref(true)

// 标识是否是百分比类型数据
const isPercentType = computed(() => {
  const percentKeywords = ['湿度', 'CPU', '内存', '硬盘']
  return percentKeywords.some(keyword => props.title.includes(keyword))
})

// 生成历史数据（仍然内部生成）
const generateHistoricalData = () => {
  const base = Date.now() - 24 * 60 * 60 * 1000
  const data = []
  let value = isPercentType.value ? Math.random() * 100 : 50

  for (let i = 0; i < 43200; i++) {
    const time = new Date(base + i * 60000)
    value += (Math.random() - 0.5) * 2
    if (isPercentType.value) value = Math.max(0, Math.min(100, value))
    data.push({time, value: Number(value.toFixed(2))})
  }
  return data
}

// 构建图表配置
const getChartOption = (data, isModal = false) => {
  const yAxisConfig = {
    type: 'value',
    axisLabel: {
      fontSize: 10,
      formatter: isPercentType.value ? '{value}%' : '{value}°C'
    },
    boundaryGap: [0, '10%']
  }

  if (isPercentType.value) {
    yAxisConfig.min = 0
    yAxisConfig.max = 100
  } else {
    const values = data.map(d => d.value)
    yAxisConfig.min = Math.floor(Math.min(...values) / 5) * 5
    yAxisConfig.max = Math.ceil(Math.max(...values) / 5) * 5
  }

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
        if (myChart.value) myChart.value.dispose()
        isVisible.value = false
        emit('destroy')
      }
    }
  }

  return {
    tooltip: {trigger: 'axis', position: pt => [pt[0], '10%']},
    title: {
      left: 'center',
      text: `${props.title}（${isModal ? '过去24小时' : '实时监测'}）`,
      textStyle: {fontSize: 14}
    },
    grid: {top: 40, left: '10%', right: '10%', bottom: 65},
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        fontSize: 10,
        formatter: value => new Date(value).toTimeString().slice(0, isModal ? 5 : 8)
      }
    },
    yAxis: yAxisConfig,
    dataZoom: [
      {type: 'inside', start: isModal ? 0 : 80, end: 100},
      {type: 'slider', start: isModal ? 0 : 80, end: 100, height: 20}
    ],
    series: [{
      name: props.title,
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
      data: data.map(d => [d.time.getTime(), d.value])
    }],
    toolbox: {
      itemSize: 12,
      right: '45px',
      feature: toolboxFeatures
    }
  }
}

let chartOption = null
const isUserZooming = ref(false)

const updateChart = () => {
  if (myChart.value && !isUserZooming.value) {
    if (!chartOption) {
      chartOption = getChartOption(props.realtimeData)
      myChart.value.setOption(chartOption)
    } else {
      chartOption.series[0].data = props.realtimeData.map(d => [d.time.getTime(), d.value])
      myChart.value.setOption({series: chartOption.series}, false)
    }
  }
}

let zoomResetTimeout = null

onMounted(() => {
  const dom = document.getElementById(chartId)
  if (dom) {
    myChart.value = echarts.init(dom)
    updateChart()

    myChart.value.on('dataZoom', () => {
      isUserZooming.value = true
      clearTimeout(zoomResetTimeout)
      zoomResetTimeout = setTimeout(() => {
        isUserZooming.value = false
      }, 3000)
    })
  }
})

// 监听传入的实时数据变化
watch(() => props.realtimeData, () => {
  updateChart()
}, {deep: true})

// 监听弹窗显示
watch(showModal, async (visible) => {
  if (visible) {
    await nextTick()
    const modalDom = document.getElementById(modalChartId)
    if (modalDom) {
      const modalChart = echarts.init(modalDom)
      modalChart.setOption(getChartOption(generateHistoricalData(), true))
      window.addEventListener('resize', () => modalChart.resize())
    }
  }
})

onBeforeUnmount(() => {
  if (myChart.value) myChart.value.dispose()
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
