<template>
  <div v-html="htmlContent"></div>
</template>

<script>
export default {
  name: 'AboutContent',
  data() {
    return {
      htmlContent: ''
    }
  },
  mounted() {
    // 假设你的 about.html 放在 public 目录下
    fetch('/zuji/index.html')
        .then(response => response.text())
        .then(html => {
          this.htmlContent = html;
        })
        .catch(err => {
          console.error('加载 HTML 文件失败:', err);
        });
  }
}
</script>

<style scoped>
/* 可以加点样式让它好看点 */
</style>
