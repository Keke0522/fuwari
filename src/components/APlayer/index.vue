<template>
  <div>
    <br />
    <!-- 容器高度根据 collapsed 自动变化 -->
    <div
        :style="{
        display: 'flex',
        alignItems: 'center',
        height: collapsed ? '24px' : '70px',
        marginTop: collapsed ? '0px' : '-5px',
        transition: 'height 0.3s ease, margin-top 0.3s ease',
      }"
    >
      <!-- 收起/展开按钮 -->
      <button
          @click="collapsed = !collapsed"
          :style="collapsed ? collapsedBtnStyle : expandedBtnStyle"
      >
        <Icon
            :icon="collapsed ? 'lucide:music' : 'lucide:chevron-left'"
            :style="collapsed ? iconSmallStyle : iconLargeStyle"
        />
      </button>

      <!-- Music Player -->
      <div v-show="!collapsed" style="display: inline-block;">
        <MusicPlayer
            :dark-theme="true"
            :musicList="musicList"
            :offsetY="32"
            diskHW="40px"
            :progressColor="'#0d6efd'"
            :lyricColor="'#00ffcc'"
            lyricSize="14px"
        >
          <template #next>
            <Icon icon="lucide:skip-forward" style="margin-right: 8px; vertical-align: middle; font-size: 20px" />
          </template>

          <template #last>
            <Icon icon="lucide:skip-back" style="margin-right: 8px; vertical-align: middle; font-size: 20px" />
          </template>

          <template #pause>
            <Icon icon="lucide:pause" style="margin-right: 8px; vertical-align: middle; font-size: 20px" />
          </template>

          <template #play>
            <Icon icon="lucide:play" style="margin-right: 8px; vertical-align: middle; font-size: 20px" />
          </template>

          <template #lyric>
            <Icon icon="lucide:list-music" style="margin-right: 8px; vertical-align: middle; font-size: 20px" />
          </template>
        </MusicPlayer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MusicPlayer from './MusicPlayer.vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const collapsed = ref(true)

const baseBtnStyle = {
  backgroundColor: '#ffffffcc',
  color: '#222',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
}

const collapsedBtnStyle = {
  ...baseBtnStyle,
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  marginTop: '-22px',

}

const expandedBtnStyle = {
  ...baseBtnStyle,
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  marginRight: '12px',
}

const iconSmallStyle = {
  fontSize: '16px',
  color: '#222',

}

const iconLargeStyle = {
  fontSize: '20px',
  color: '#222',
}
const musicList = [
  {
    title: '三年二班',
    ar: '周杰伦',
    img: 'https://img.zhangpingguo.com/apple_Article_Head/vae/7e6361a6-58f7-4abb-997e-bdd88dd1dc06.jpg',
    src: 'https://img.zhangpingguo.com/music/%E5%91%A8%E6%9D%B0%E4%BC%A6%20-%20%E4%B8%89%E5%B9%B4%E4%BA%8C%E7%8F%AD.mp3',
    lyric: '[ti:三年二班]\n' +
        '[ar:周杰伦]\n' +
        '[al:叶惠美]\n' +
        '....\n' +
        '[00:00.30]三年二班\n' +
        '[00:01.30]作词：方文山  作曲：周杰伦\n' +
        '[00:02.30]演唱：周杰伦\n' +
        '[00:03.30]...\n' +
        '[00:06.45]训导处报告 训导处报告\n' +
        '[00:09.27]三年二班 周杰伦\n' +
        '[00:11.46]马上到训导处来\n' +
        '[00:12.71]...\n' +
        '[00:40.05]眼睛你要擦亮 记住我的模样\n' +
        '[00:42.71]表情不用太紧张\n' +
        '[00:44.02]我是 三年二班\n' +
        '[00:45.37]我专心打球的侧脸还满好看\n' +
        '[00:47.52]黑板是吸收知识的地方\n' +
        '[00:49.40]只是教室的阳光\n' +
        '[00:50.66]那颜色我不太喜欢\n' +
        '[00:51.97]没有操场的自然\n' +
        '[00:53.32]为何比较漂亮的都是在隔壁班\n' +
        '[00:56.04]还有考卷的答案\n' +
        '[00:57.34]我刚好都不会算\n' +
        '[00:58.64]没关系 再继续努力 没关系\n' +
        '[01:01.28]为什么上课时举手很难\n' +
        '[01:03.89]为什么拿线上宝物简单\n' +
        '[01:06.69]为什么女生不喜欢太胖\n' +
        '[01:09.22]为什么都别人手机在响\n' +
        '[01:11.81]正手发长球的打法只是初级乒乓\n' +
        '[01:14.71]反手短打再狠狠杀球是高级乒乓\n' +
        '[01:17.27]回转技巧乒乓 前场速攻乒乓\n' +
        '[01:19.95]对墙壁 在练习 乒乓 乒乓\n' +
        '[01:22.64]这第一名到底要多强\n' +
        '[01:25.93]（不用问 一定有人向你挑战）\n' +
        '[01:27.94]到底还要过多少关\n' +
        '[01:31.14]（不用怕 告诉他们谁是男子汉）\n' +
        '[01:33.46]可不可以不要这个奖\n' +
        '[01:36.51]（不想问 我只想要流一点汗）\n' +
        '[01:38.79]我当我自己的裁判\n' +
        '[01:41.86]（不想说 选择对手跟要打的仗）\n' +
        '[01:44.11]这第一名到底要多强\n' +
        '[01:46.95]（不用问 一定有人向你挑战）\n' +
        '[01:49.24]到底还要过多少关\n' +
        '[01:52.57]（不用怕 告诉他们谁是男子汉）\n' +
        '[01:54.80]可不可以不要这个奖\n' +
        '[01:57.84]（不想问 我只想要流一点汗）\n' +
        '[02:00.10]我当我自己的裁判\n' +
        '[02:03.10]（不想说 选择对手跟要打的仗）\n' +
        '[02:05.28]...\n' +
        '[02:08.13]全体师生注意\n' +
        '[02:09.46]今天我要表扬一位同学\n' +
        '[02:11.97]他为校争光\n' +
        '[02:13.44]我们要向他看齐\n' +
        '[02:15.03]...\n' +
        '[02:28.06]我不想 就这样一直走\n' +
        '[02:30.34]每天都遇上 充满敌意那种眼光\n' +
        '[02:33.43]等机会 就是要打倒对方\n' +
        '[02:36.10]这种结果我不要 这虚荣的骄傲\n' +
        '[02:38.93]这目的很好笑\n' +
        '[02:40.21]我其实都知道 你只是想炫耀\n' +
        '[02:42.90]我永远做不到 你永远赢不了\n' +
        '[02:45.50]我永远做不到\n' +
        '[02:46.79]你永远赢不了 永远都赢不了\n' +
        '[02:49.58]走下乡 寻找哪有花香\n' +
        '[02:52.07]（为什么 这么简单你做不到）\n' +
        '[02:54.88]坐车厢 朝着南下方向\n' +
        '[02:57.32]（为什么 这种速度你追不到）\n' +
        '[03:00.31]鸟飞翔 穿过这条小巷\n' +
        '[03:02.80]（为什么 这么简单你做不到）\n' +
        '[03:05.60]仔细想 这种生活安详\n' +
        '[03:08.07]（为什么 这种速度你追不到）\n' +
        '[03:10.93]不好笑 不好笑 不好笑\n' +
        '[03:12.71]不好笑 不好笑 不好笑\n' +
        '[03:14.57]...\n' +
        '[03:32.15]这第一名到底要多强\n' +
        '[03:35.31]（不用问 一定有人向你挑战）\n' +
        '[03:37.48]到底还要过多少关\n' +
        '[03:40.59]（不用怕 告诉他们谁是男子汉）\n' +
        '[03:42.92]可不可以不要这个奖\n' +
        '[03:45.90]（不想问 我只想要流一点汗）\n' +
        '[03:48.14]我当我自己的裁判\n' +
        '[03:51.25]（不想说 选择对手跟要打的仗）\n' +
        '[03:53.99]我不想 就这样一直走\n' +
        '[03:56.04]每天都遇上 充满敌意那种眼光\n' +
        '[03:58.79]等机会 就是要打倒对方\n' +
        '[04:01.82]这种结果我不要 这虚荣的骄傲\n' +
        '[04:04.17]我不想 就这样一直走\n' +
        '[04:06.34]每天都遇上 充满敌意那种眼光\n' +
        '[04:09.34]等机会 就是要打倒对方\n' +
        '[04:12.11]这种结果我不要 这虚荣的骄傲\n' +
        '[04:14.81]走下乡 寻找哪有花香\n' +
        '[04:17.14]...\n' +
        '[04:20.24]坐车厢 朝着南下方向\n' +
        '[04:22.45]...\n' +
        '[04:25.62]鸟飞翔 穿过这条小巷\n' +
        '[04:27.96]...\n' +
        '[04:30.80]仔细想 这种生活安详\n' +
        '[04:33.06]...'
  },
  {
    title: '舍得',
    ar: '王唯旖',
    img: 'https://img.zhangpingguo.com/apple_Article_Head/vae/7e6361a6-58f7-4abb-997e-bdd88dd1dc06.jpg',
    src: 'https://cdn.jsdelivr.net/gh/Keke0522/music-storage/M5000037sebg23jTFg.mp3',
    lyric: '[00:06.48]制作人：仓雁彬\n[00:07.84]编曲：王鹏\n[00:09.32]弦乐：中国国家交响乐团\n[00:10.71]录音：曾嵘（飞凡耳 studio）\n[00:11.42]混音：仓雁彬（Kcyb studio）\n[00:15.63]mastering：Jstin L.（Tri studio）\n[00:22.43]忘了\n[00:23.72]谁先燃起战火\n[00:26.38]那无端的折磨\n[00:28.99]一切究竟为了什么\n[00:33.48]难道\n[00:34.87]像我这般爱你\n[00:37.59]就该学会放弃\n[00:40.39]让自己卑微到土里\n[00:44.81]可是爱已成两刃的利剑\n[00:49.84]了解彼此最能一挥就见血\n[00:54.32]用尽伤人的话去说\n[01:00.05]都没想能不能收得回啊\n[01:05.57]出口之后却更失落\n[01:09.52]也会更难过\n[01:13.08]这又是何苦呢\n[01:16.81]自问到底舍不舍得\n[01:22.82]舍不舍得爱一瞬都成恨了\n[01:28.58]眼泪究竟是为谁啊\n[01:32.23]谁输谁赢啊\n[01:35.09]谁又真的在乎呢\n[01:39.59]反正都伤了\n[01:52.78]难道\n[01:54.06]像我这般爱你\n[01:56.76]就该学会放弃\n[01:59.58]让自己卑微到土里\n[02:03.84]可是爱已成两刃的利剑\n[02:08.96]了解彼此最能一挥就见血\n[02:13.35]用尽伤人的话去说\n[02:19.23]都没想能不能收得回啊\n[02:24.99]出口之后却更失落\n[02:28.76]也会更难过\n[02:32.01]这又是何苦呢\n[02:35.93]自问到底舍不舍得\n[02:41.85]舍不舍得爱一瞬都成恨了\n[02:47.63]眼泪究竟是为谁啊\n[02:51.16]谁输谁赢啊\n[02:54.15]谁又真的在乎呢\n[02:58.80]反正都伤了\n[03:15.88]用尽伤人的话去说\n[03:21.51]都没想能不能收得回啊\n[03:27.27]出口之后却更失落\n[03:30.94]也会更难过\n[03:33.78]这又是何苦呢\n[03:38.02]自问到底舍不舍得\n[03:44.00]舍不舍得爱一瞬都成恨了\n[03:49.74]眼泪究竟是为谁啊\n[03:53.32]谁输谁赢啊\n[03:56.51]谁又真的在乎呢\n[04:01.21]反正都伤了'
  }
];

</script>


<style scoped>

</style>
