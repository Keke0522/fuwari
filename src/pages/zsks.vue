<template>
  <div class="container">

    <div class="search-bar">
      <input
          type="text"
          placeholder="按任意键直接开始搜索"
          v-model="searchQuery"
      />
    </div>

    <div class="filters">
      <button
          class="filter-btn"
          :class="{ active: activeFilter === filter }"
          v-for="filter in filters"
          :key="filter"
          @click="setFilter(filter)"
      >
        {{ filter }}
      </button>
    </div>

    <div class="grid">
      <div
          class="card"
          v-for="tool in filteredTools"
          :key="tool.name"
      >
        <component
            :is="tool.url ? 'a' : 'div'"
            :href="tool.url || null"
            class="card-link"
            target="_blank"
            :style="tool.url ? '' : 'cursor: not-allowed;'"
            :title="tool.url ? '' : '暂未开放哦'"
        >
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1; padding: 10px;">
              <img class="icon" :src="tool.image" :alt="tool.name" style="width: 100%; height: auto; object-fit: cover;" />
            </div>
            <div style="flex: 1; padding: 10px;">
              <div class="tags">
                <span
                    class="tag"
                    v-for="tag in tool.tags"
                    :key="tag"
                >
                  {{ tag }}
                </span>
              </div>
              <h3>{{ tool.name }}</h3>
            </div>
          </div>
          <div class="content">
            <p>{{ tool.description }}</p>
          </div>
        </component>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const tools = [
  {
    name: '前端笔记',
    description: '前端日常，随手记...',
    image: 'http://124.222.48.45/static/img/1396a2291e98754084d259d6e06657c9.iShot_2025-01-09_14.14.10.webp',
    tags: ['前端', '笔记'],
    url: 'https://keke0420.yuque.com/hyo9om/md9yhx'
  },
  {
    name: 'java笔记',
    description: 'java笔记...',
    image: 'http://124.222.48.45/static/img/1396a2291e98754084d259d6e06657c9.iShot_2025-01-09_14.14.10.webp',
    tags: ['java', '笔记'],
    url: 'https://mrjokersince1997.github.io/My-Notes/#/?id=java-se'
  },
  {
    name: '今天吃什么',
    description: '吃点什么好呢🤔',
    image: 'http://124.222.48.45/static/img/1396a2291e98754084d259d6e06657c9.iShot_2025-01-09_14.14.10.webp',
    tags: ['生活'],
     url: '/html/chi/index.html'
  },
  {
    name: '******',
    description: '还没想好...',
    image: 'http://124.222.48.45/static/img/1396a2291e98754084d259d6e06657c9.iShot_2025-01-09_14.14.10.webp',
    tags: ['vue']
  }
];

const filters = ['全部', '前端', '笔记', 'Java', '生活','效率'];

const activeFilter = ref('全部');
const searchQuery = ref('');

const filteredTools = computed(() => {
  let result = tools;
  if (activeFilter.value !== '全部') {
    result = result.filter(tool =>
        tool.tags.some(tag => tag.toLowerCase() === activeFilter.value.toLowerCase())
    );
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    result = result.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  return result;
});

const setFilter = (filter) => {
  activeFilter.value = filter;
};
</script>
<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-bar input {
  width: 60%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.search-bar input:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #ddd;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.filters button:hover {
  background-color: #aaa;
  color: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.2);
}

/* 图片部分样式 */
.card .icon {
  width: 85px;
  height: 85px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 20px;  /* 图片与文字间的间隔 */
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 文字部分样式 */
.card .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tags {
  display: flex;
  gap: 3px;
  margin-bottom: 5px;
}

.card .tag {
  background-color: #eee;
  color: #666;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 5px;
}

.card .tag.dev {
  background-color: #ffd700;
}

.card .tag.tool {
  background-color: #7fffd4;
}

.card .tag.learn {
  background-color: #87cefa;
}

.card h3 {
  font-size: 14px;
  margin: 0;
  margin-bottom: 5px;
}

.card p {
  color: #666;
  font-size: 12px;
  margin: 0;
}

.footer {
  text-align: center;
  margin-top: 20px;
  color: #aaa;
}

/* 去除链接下划线 */
.card-link {
  text-decoration: none;
  color: inherit; /* 确保文字颜色继承自父元素 */
}

/* 返回按钮样式 */
.back-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>
