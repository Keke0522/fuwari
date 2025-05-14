<template>
  <div>
    <br />
    <!-- 容器高度根据 collapsed 自动变化 -->
    <div
        :style="{
        display: 'flex',
        alignItems: 'center',
        height: collapsed ? '24px' : '70px',
        marginTop: collapsed ? '0px' : '0px',
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
    title: '舍得',
    ar: '王唯旖',
    img: '',
    src: 'https://cdn.jsdelivr.net/gh/Keke0522/music-storage/M5000037sebg23jTFg.mp3',
    lyric: '[00:06.48]制作人：仓雁彬\n[00:07.84]编曲：王鹏\n[00:09.32]弦乐：中国国家交响乐团\n[00:10.71]录音：曾嵘（飞凡耳 studio）\n[00:11.42]混音：仓雁彬（Kcyb studio）\n[00:15.63]mastering：Jstin L.（Tri studio）\n[00:22.43]忘了\n[00:23.72]谁先燃起战火\n[00:26.38]那无端的折磨\n[00:28.99]一切究竟为了什么\n[00:33.48]难道\n[00:34.87]像我这般爱你\n[00:37.59]就该学会放弃\n[00:40.39]让自己卑微到土里\n[00:44.81]可是爱已成两刃的利剑\n[00:49.84]了解彼此最能一挥就见血\n[00:54.32]用尽伤人的话去说\n[01:00.05]都没想能不能收得回啊\n[01:05.57]出口之后却更失落\n[01:09.52]也会更难过\n[01:13.08]这又是何苦呢\n[01:16.81]自问到底舍不舍得\n[01:22.82]舍不舍得爱一瞬都成恨了\n[01:28.58]眼泪究竟是为谁啊\n[01:32.23]谁输谁赢啊\n[01:35.09]谁又真的在乎呢\n[01:39.59]反正都伤了\n[01:52.78]难道\n[01:54.06]像我这般爱你\n[01:56.76]就该学会放弃\n[01:59.58]让自己卑微到土里\n[02:03.84]可是爱已成两刃的利剑\n[02:08.96]了解彼此最能一挥就见血\n[02:13.35]用尽伤人的话去说\n[02:19.23]都没想能不能收得回啊\n[02:24.99]出口之后却更失落\n[02:28.76]也会更难过\n[02:32.01]这又是何苦呢\n[02:35.93]自问到底舍不舍得\n[02:41.85]舍不舍得爱一瞬都成恨了\n[02:47.63]眼泪究竟是为谁啊\n[02:51.16]谁输谁赢啊\n[02:54.15]谁又真的在乎呢\n[02:58.80]反正都伤了\n[03:15.88]用尽伤人的话去说\n[03:21.51]都没想能不能收得回啊\n[03:27.27]出口之后却更失落\n[03:30.94]也会更难过\n[03:33.78]这又是何苦呢\n[03:38.02]自问到底舍不舍得\n[03:44.00]舍不舍得爱一瞬都成恨了\n[03:49.74]眼泪究竟是为谁啊\n[03:53.32]谁输谁赢啊\n[03:56.51]谁又真的在乎呢\n[04:01.21]反正都伤了'
  },
  {
    title: '认真的雪',
    ar: '薛之谦',
    img: '',
    src: 'https://cdn.jsdelivr.net/gh/Keke0522/music-storage/M500004KPWsJ22whcd.mp3',
    lyric: '[00:01.29]雪下得那么深 下得那么认真\n[00:06.67]倒映出我躺在雪中的伤痕\n[00:24.41]夜深人静 那是爱情\n[00:33.53]偷偷的控制着我的心\n[00:36.39]提醒我爱你要随时待命\n[00:42.78]音乐安静 还是爱情啊\n[00:51.38]一步一步吞噬着我的心\n[00:54.59]爱上你我失去了我自己\n[01:00.64]爱得那么认真 爱得那么认真\n[01:06.02]可还是听见了你说不可能\n[01:10.09]已经十几年 没下雪的上海\n[01:13.47]突然飘雪 就在你说了分手的瞬间\n[01:18.98]雪下得那么深 下得那么认真\n[01:24.29]倒映出我躺在雪中的伤痕\n[01:28.96]我并不在乎自己究竟多伤痕累累\n[01:33.62]可我在乎今后你有谁陪\n[02:05.00]音乐安静 还是爱情啊\n[02:13.91]一步一步吞噬着我的心\n[02:16.91]爱上你我失去了我自己\n[02:22.88]爱得那么认真 爱得那么认真\n[02:28.37]可还是听见了你说不可能\n[02:32.36]已经十几年 没下雪的上海\n[02:35.79]突然飘雪 就在你说了分手的瞬间\n[02:41.31]雪下得那么深 下得那么认真\n[02:46.61]倒映出我躺在雪中的伤痕\n[02:51.23]我并不在乎自己究竟多伤痕累累\n[02:55.87]可我在乎今后你让谁陪\n[03:02.13]爱得那么深 爱得那么认真\n[03:07.25]可还是听见了你说不可能\n[03:11.22]已经十几年 没下雪的上海\n[03:14.54]突然飘雪 就在你说了分手的瞬间\n[03:20.08]雪下得那么深 下得那么认真\n[03:25.45]倒映出我躺在雪中的伤痕\n[03:30.09]我并不在乎自己究竟多伤痕累累\n[03:34.69]可我在乎今后你让谁陪\n[03:41.03]爱得那么深 比谁都认真\n[03:46.12]可最后还是只剩我一个人\n[03:50.67]漫天风雪请别再把我的眼泪擦去\n[03:55.32]毕竟那是我最爱的女人\n[04:00.65]毕竟我曾是她深爱的人'  },
  {
    title: '勾指起誓',
    ar: '泠鸢yousa',
    img: '',
    src: 'https://cdn.jsdelivr.net/gh/Keke0522/music-storage/Hanser&泠鸢Yousa - 【冷冷】勾指起誓.mp3',
    lyric: '[00:02.65]编曲：ilem\n[00:11.15]洛天依调校：ilem\n[00:13.65]P V：PinoEliza(明暗像素)\n[00:16.65]原唱：洛天依\n[00:19.40]翻唱：泠鸢yousa\n[00:21.65]你是信的开头诗的内容\n[00:25.15]童话的结尾\n[00:27.15]你是理所当然的奇迹\n[00:30.65]你是月色真美\n[00:32.90]你是圣诞老人送给我\n[00:36.40]好孩子的礼物\n[00:38.40]你是三千美丽世界里\n[00:42.15]我的一瓢水\n[00:44.15]所以让我再靠近一点点\n[00:47.40]因为你太温暖\n[00:49.90]我会再变得坚强一点点\n[00:53.43]因为你太柔软\n[00:55.43]交换无名指金色的契约\n[00:58.93]给彼此岁月\n[01:01.18]说好从今以后都牵着手\n[01:04.68]因为要走很远\n[01:29.17]你是我万水千山的冒险\n[01:32.92]要找的标记点\n[01:35.07]你是我分割人生的线\n[01:38.32]又将它们相连\n[01:40.32]你是前世千次的回眸\n[01:44.32]虔诚牵的手\n[01:46.32]你是其余所有的一切\n[01:49.82]是我的世界\n[01:52.07]所以请你再闪亮一点点\n[01:55.32]尽管我太平凡\n[01:57.57]我会再变得柔软一点点\n[02:01.07]因为你太敏感\n[02:03.32]交换无名指金色的契约\n[02:06.82]给彼此岁月\n[02:09.07]说好从今以后都牵着手\n[02:12.07]不管要走多远\n[02:37.54]所以让我再靠近一点点\n[02:40.29]因为你太温暖\n[02:42.79]我会再变得坚强一点点\n[02:46.29]因为你太柔软\n[02:48.29]交换无名指金色的契约\n[02:52.04]给彼此岁月\n[02:54.29]说好从今以后都牵着手\n[02:57.79]因为要走很远'  },
  {
    title: '故梦',
    ar: '双笙',
    img: '',
    src: 'https://cdn.jsdelivr.net/gh/Keke0522/music-storage/双笙（陈元汐） - 故梦（一周年礼物）（Cover 橙翼）.mp3',
    lyric: '[00:00.19]原唱：橙翼\n[00:01.14]翻唱：双笙\n[00:01.29]旧忆就像一扇窗\n[00:06.30]推开了就再难合上\n[00:13.14]谁踩过枯枝轻响\n[00:16.79]萤火绘着画屏香\n[00:26.16]为谁拢一袖芬芳\n[00:31.68]红叶的信笺情意绵长\n[00:37.96]他说就这样去流浪\n[00:42.58]到美丽的地方\n[00:49.74]谁的歌声轻轻、轻轻唱\n[00:57.45]谁的泪水静静淌\n[01:03.85]那些年华都付作过往\n[01:10.21]他们偎依着彼此说好要面对风浪\n[01:16.96]又是一地枯黄\n[01:22.43]枫叶红了满面秋霜\n[01:28.94]这场故梦里\n[01:31.94]人生如戏唱\n[01:34.95]还有谁登场\n[02:31.76]昏黄烛火轻摇晃\n[02:38.20]大红盖头下谁彷徨\n[02:44.44]流泪的花和荣喜堂\n[02:49.30]静静放在一旁\n[02:56.30]回忆像默片播放\n[03:03.21]刻下一寸一寸旧时光\n[03:09.54]他说就这样去流浪\n[03:14.17]到美丽的地方\n[03:22.57]谁的歌声轻轻、轻轻唱\n[03:28.85]谁的泪水静静淌\n[03:35.50]愿化一双鸟儿去飞翔\n[03:41.35]任身后哭嚎嘶喊着也追不上\n[03:47.74]又一年七月晚风凉\n[03:54.10]斜阳渐矮只影长\n[04:00.55]这场故梦里\n[04:03.56]孤桨声远荡\n[04:06.64]去他乡 遗忘'  }
];

</script>


<style scoped>

</style>
