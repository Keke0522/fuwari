<template>
  <div class="flex h-screen bg-white">
    <!-- 左侧侧边栏 -->
    <aside class="w-60 border-r bg-gray-50 p-4">
      <h2 class="text-blue-500 text-lg font-bold mb-4">我的订阅</h2>
      <div class="space-y-4">
        <SidebarItem
            v-for="site in siteList"
            :key="site.title"
            :icon="site.icon"
            :name="site.title"
            :class="{ 'text-blue-500': site.title === currentSite }"
            @click="selectSite(site.title)"
        />
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="flex-1 overflow-y-auto p-6">
      <!-- 顶部导航栏（可扩展分类） -->
      <nav class="flex space-x-6 text-gray-700 text-sm font-semibold mb-6">
        <span class="text-red-500">热搜榜</span>
      </nav>

      <!-- 热榜标题 -->
      <div class="flex items-center justify-between mb-4">
        <div class="text-lg font-bold flex items-center">
          <img src="https://www.autohome.com.cn/favicon.ico" class="w-6 h-6 mr-2" />
          {{ currentSite }}・热门榜
        </div>
        <div class="text-gray-400 text-sm">🛈</div>
      </div>

      <!-- 热榜列表 -->
      <ul class="space-y-3">
        <HotItem
            v-for="(item, index) in hotList"
            :key="item.id"
            :index="(index + 1).toString()"
            :title="item.title"
            :tag="item.desc || item.owner?.name"
            :highlight="index < 3"
        />
      </ul>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import SidebarItem from './SidebarItem.vue'
import HotItem from './HotItem.vue'

// 可选站点列表
const siteList = [
  { title: '哔哩哔哩', icon: '💬' },
  { title: '百度', icon: '🔍' },
  { title: '知乎', icon: '🧠' },
  { title: '百度贴吧', icon: '📌' },
  { title: '少数派', icon: '🧑‍💻' },
  { title: 'IT之家', icon: '💻' },
  { title: '澎湃新闻', icon: '🌊' },
  { title: '今日头条', icon: '📰' },
  { title: '微博热搜', icon: '🔥' },
  { title: '36氪', icon: '🚀' },
  { title: '稀土掘金', icon: '⛏️' },
  { title: '腾讯新闻', icon: '📣' }
]

// 当前站点和热榜数据
const currentSite = ref('哔哩哔哩')
const hotList = ref([])

const fetchHotList = async (title) => {
  try {
    const res = await axios.get(`https://api.pearktrue.cn/api/dailyhot/?title=${title}`)
    if (res.data.code === 200) {
      hotList.value = res.data.data
    } else {
      console.warn('接口返回失败：', res.data.message)
    }
  } catch (err) {
    console.error('请求失败：', err)
  }
}

// 切换站点
const selectSite = (title) => {
  currentSite.value = title
  fetchHotList(title)
}

// 初始加载默认站点
onMounted(() => {
  fetchHotList(currentSite.value)
})
</script>

<style scoped>
/* 当前选中站点高亮 */
.text-blue-500 {
  font-weight: bold;
}
</style>
