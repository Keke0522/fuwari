<template>
  <div id="app">
    <div id="map"></div>

    <button class="add-btn" @click="showForm = true">➕ 添加足迹</button>

    <div v-if="showForm" class="form-popup">
      <h3>添加足迹</h3>
      <label>
        备注：
        <input v-model="form.note" type="text" />
      </label>
      <label>
        上传图片：
        <input type="file" @change="onImageChange" accept="image/*" />
      </label>
      <div class="btns">
        <button @click="addFootprint">✅ 确认</button>
        <button @click="cancelAdd">❌ 取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import L from 'leaflet'
import { ref, onMounted } from 'vue'

const map = ref(null)
const showForm = ref(false)
const form = ref({
  note: '',
  image: '',
})
const lastLatLng = ref(null)

// 手动添加默认的足迹数据
const footprints = ref([
  {
    latlng: L.latLng(31.2304, 121.4737),  // 默认足迹的经纬度
    note: '这是上海的一个足迹',
    time: '2025-04-10 10:00:00',  // 固定时间
    image: '/assets/images/footprint_1.jpg',  // 图片路径
  },
  {
    latlng: L.latLng(39.9042, 116.4074),  // 默认足迹的经纬度
    note: '这是北京的一个足迹',
    time: '2025-04-10 12:00:00',  // 固定时间
    image: '/assets/images/footprint_2.jpg',  // 图片路径
  },
])

let polyline = null

onMounted(() => {
  map.value = L.map('map')

  // 设置地图显示区域
  const chinaBounds = L.latLngBounds(
      [22.0, 90.0],   // 更靠近中国中部，稍微放大
      [48.0, 120.0]   // 向左移动一点点，增加西边范围
  )
  map.value.fitBounds(chinaBounds)

  // 添加地图图层
  L.tileLayer('https://t{s}.tianditu.gov.cn/vec_w/wmts?tk=0cd4c9f45e435f078847140a7728f8ab&service=wmts&request=GetTile&version=1.0.0&layer=vec&style=default&tilematrixSet=w&format=tiles&tilematrix={z}&tilecol={x}&tilerow={y}', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    attribution: '© 天地图',
    opacity: 0.3,
  }).addTo(map.value)

  // 加载并添加中国边界
  fetch('https://geo.datav.aliyun.com/areas/bound/100000_full.json')
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data, {
          style: {
            color: '#ffb699',
            weight: 1,
            fillColor: '#ffebcc',
            fillOpacity: 0.2,
          }
        }).addTo(map.value)
      })

  // 添加标注图层
  L.tileLayer('https://t{s}.tianditu.gov.cn/cva_w/wmts?tk=0cd4c9f45e435f078847140a7728f8ab&service=wmts&request=GetTile&version=1.0.0&layer=cva&style=default&tilematrixSet=w&format=tiles&tilematrix={z}&tilecol={x}&tilerow={y}', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    minZoom: 5,
    maxZoom: 15,
    opacity: 0.5,
  }).addTo(map.value)

  // 显示默认足迹
  footprints.value.forEach(footprint => {
    const marker = L.circleMarker(footprint.latlng, {
      radius: 6,
      color: '#1976d2',
      fillColor: '#1976d2',
      fillOpacity: 0.8,
    }).addTo(map.value)

    marker.bindPopup(`
      <b>🕒 ${footprint.time}</b><br>
      📝 ${footprint.note}<br>
      ${footprint.image ? `<img src="${footprint.image}" style="max-width: 150px;">` : ''}
    `)
  })

  // 地图点击事件
  map.value.on('click', (e) => {
    lastLatLng.value = e.latlng
    showForm.value = true
  })
})

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      // 生成图片的路径（你可以手动将图片添加到 assets 文件夹中）
      const imageName = 'footprint_' + Date.now() + '.jpg'
      const imagePath = `/assets/images/${imageName}`

      form.value.image = imagePath

      // 手动将图片保存到 assets 文件夹
      // 这部分你可以使用构建工具将图片放到对应路径下
    }
    reader.readAsDataURL(file)
  }
}

const addFootprint = () => {
  if (!lastLatLng.value) return alert('请点击地图选择位置')
  const time = new Date().toLocaleString()

  const point = {
    latlng: lastLatLng.value,
    note: form.value.note,
    time,
    image: form.value.image,
  }

  footprints.value.push(point)

  const marker = L.circleMarker(lastLatLng.value, {
    radius: 6,
    color: '#1976d2',
    fillColor: '#1976d2',
    fillOpacity: 0.8,
  }).addTo(map.value)

  // 添加 tooltip 显示足迹详情
  marker.bindTooltip(`
    <b>🕒 ${time}</b><br>
    📝 ${form.value.note}<br>
    ${form.value.image ? `<img src="${form.value.image}" style="max-width: 150px;">` : ''}
  `, { permanent: false, direction: 'top' })

  // 打印 footprints 数组
  console.log(footprints.value)

  // 更新路径
  // drawLine()

  showForm.value = false
  form.value = { note: '', image: '' }
}

const cancelAdd = () => {
  showForm.value = false
  form.value = { note: '', image: '' }
}

const drawLine = () => {
  const latlngs = footprints.value.map(f => f.latlng)
  if (polyline) map.value.removeLayer(polyline)
  polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map.value)
}
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}

.add-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 18px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  z-index: 1001; /* 新增 */
}

.form-popup {
  position: fixed;
  bottom: 100px;
  right: 20px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  width: 250px;
  z-index: 1002; /* 新增，保证高于地图 */
}
#map {
  z-index: 0;
}
.form-popup input {
  width: 100%;
  margin-bottom: 10px;
}

.btns {
  display: flex;
  justify-content: space-between;
}
</style>
