<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch, withDefaults, defineProps, defineOptions, nextTick } from "vue";

defineOptions({
  name: "MusicPlayer"
});

const audioRef = ref<HTMLAudioElement | null>(null);
const progressRef = ref<HTMLDivElement | null>(null);
const progresscontainerRef = ref<HTMLDivElement | null>(null);
const lyricContainerRef = ref<HTMLDivElement | null>(null);

interface MusicItem {
  title: string;
  img: string;
  src: string;
  lyric: string;
  ar: string;
}

interface AudioPlayerProps {
  musicList?: MusicItem[];
  diskHW?: string;
  progressColor?: string;
  lyricColor?: string;
  lyricSize?: string;
  currentLyricSize?: string;
  offsetY?: number;
  darkTheme?: boolean;
}

const props = withDefaults(defineProps<AudioPlayerProps>(), {
  musicList: () => [],
  diskHW: () => '120px',
  lyricSize: () => '14px',
  currentLyricSize: () => '16px',
  lyricColor: () => '#1890ff',
  offsetY: () => 25,
  progressColor: () => '#1890ff',
  darkTheme: () => false,
});

const { musicList, offsetY, lyricColor, lyricSize, currentLyricSize, progressColor, darkTheme } = toRefs(props);

const ci= ref(true);
const songIndex = ref(0);
const currentLyc = ref(0);
const lyricList = ref<{ time: string; lyc: string }[]>([]);
const lycStyle = ref<Record<string, string>>({});
const lineHeights = ref<number[]>([]);

const playSongSrc = computed(() => {
  return musicList.value?.[songIndex.value] || {} as MusicItem;
});

const paused = ref(true);

const geci =() => {
  console.log(ci.value);
  ci.value = !ci.value;
};

// 新增：进度条更新逻辑
const updateProgress = () => {
  if (!audioRef.value || !progressRef.value) return;
  const { duration, currentTime } = audioRef.value;
  if (duration > 0 && !isNaN(duration)) {
    const progressPercent = (currentTime / duration) * 100;
    progressRef.value.style.width = `${progressPercent}%`;
  }
};

const calculateLyricPosition = () => {
  const container = lyricContainerRef.value;
  const allLines = container?.querySelectorAll("p");
  if (!container || !allLines || currentLyc.value >= allLines.length) return 0;
  const currentLineEl = allLines[currentLyc.value] as HTMLElement;
  const currentTop = currentLineEl.offsetTop;
  const containerHeight = container.clientHeight;
  const lineHeight = currentLineEl.offsetHeight;
  return currentTop - containerHeight / 2 + lineHeight / 2;
};

const updateLyricPosition = () => {
  const offset = calculateLyricPosition();
  lycStyle.value = {
    transform: `translateY(-${offset}px)`,
    transition: 'transform 0.3s ease-out'
  };
};

const getLyric = () => {
  const result = (playSongSrc.value?.lyric || '');
  if (result.trim()) {
    const lines = result.split('\n');
    const lyricData: { time: string; lyc: string }[] = [];
    lines.forEach(line => {
      const match = line.match(/\[(\d{2}:\d{2}(?:\.\d{2})?)\](.*)/);
      if (match) {
        lyricData.push({ time: match[1], lyc: match[2].trim() });
      }
    });
    lyricList.value = lyricData;
    lineHeights.value = lyricData.map(() => offsetY.value);
  } else {
    lyricList.value = [{
      time: '00:01:00',
      lyc: playSongSrc.value.title
    }];
    lineHeights.value = [offsetY.value];
  }
  nextTick(updateLyricPosition);
};

const getTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// 修改后的时间更新函数
const timeUpdate = () => {
  updateProgress(); // 新增进度条更新
  if (!playSongSrc.value.lyric || !audioRef.value || lyricList.value.length === 0) return;

  const currentTime = getTime(audioRef.value.currentTime);
  let newIndex = 0;

  for (let i = lyricList.value.length - 1; i >= 0; i--) {
    if (currentTime >= lyricList.value[i].time) {
      newIndex = i;
      break;
    }
  }

  if (currentLyc.value !== newIndex) {
    currentLyc.value = newIndex;
    updateLyricPosition();
  }
};

watch(currentLyc, (newVal, oldVal) => {
  if (oldVal !== undefined) {
    lineHeights.value[oldVal] = parseInt(lyricSize.value);
  }
  lineHeights.value[newVal] = parseInt(currentLyricSize.value);
});

watch(playSongSrc, (newVal) => {
  if (newVal?.src && audioRef.value) {
    audioRef.value.src = newVal.src;
    getLyric();
    audioRef.value.play().then(() => paused.value = false);
  }
});

onMounted(() => {
  if (audioRef.value && playSongSrc.value?.src) {
    audioRef.value.src = playSongSrc.value.src;
    getLyric();

    // 确保事件监听器正确添加
    audioRef.value.addEventListener("timeupdate", timeUpdate);
    audioRef.value.addEventListener("ended", () => switchSong(true));

    // 初始播放状态同步
    paused.value = audioRef.value.paused;
  }

  window.addEventListener('resize', updateLyricPosition);
});

const playSong = () => {
  if (!audioRef.value) return;
  paused.value ? audioRef.value.play() : audioRef.value.pause();
  paused.value = !paused.value;
};

const switchSong = (isNext: boolean) => {
  const length = musicList.value.length;
  songIndex.value = isNext
      ? (songIndex.value + 1) % length
      : (songIndex.value - 1 + length) % length;
};

const setProgress = (clickX: number, width: number) => {
  if (!audioRef.value) return;
  const duration = audioRef.value.duration;
  if (duration > 0) {
    audioRef.value.currentTime = (clickX / width) * duration;
  }
};

const setProgressBtn = (e: MouseEvent) => {
  if (!progresscontainerRef.value) return;
  const rect = progresscontainerRef.value.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  setProgress(clickX, rect.width);
};
</script>

<template>
  <div class="music-player-wrapper">
    <audio ref="audioRef"></audio>
    <div class="left-panel">
      <div class="control-style">
        <div class="control_btn" @click="switchSong(false)">
          <slot name="last">⏮</slot>
        </div>
        <div class="control_btn" @click="playSong">
          <slot v-if="paused" name="play">▶</slot>
          <slot v-else name="pause">⏸</slot>
        </div>
        <div class="control_btn" @click="switchSong(true)">
          <slot name="next">⏭</slot>
        </div>
        <div class="control_btn" style="font-size: 12px;padding-right: 10px" :class="{ active: ci }" @click="geci()">
          词
        </div>

        <div class="song-name">
          {{ playSongSrc.title }} - {{ playSongSrc.ar }}
        </div>
      </div>

      <!-- 修正后的进度条结构 --><!-- 进度条 -->
      <div
          class="progress-wrapper"
          ref="progresscontainerRef"
          @click="setProgressBtn"
          :style="{ opacity: darkTheme ? 0.6 : 1 }"
      >
        <div class="progress-bg"></div>
        <div
            ref="progressRef"
            class="progress"
            :style="{ backgroundColor: progressColor }"
        ></div>
      </div>

      <!-- 当前一句歌词，仅在小屏显示 -->
      <p class="mobile-lyric-line" v-if="ci">{{ lyricList[currentLyc]?.lyc }}</p>
    </div>

    <div class="lyricBox" v-if="ci" ref="lyricContainerRef" >
      <div class="lyricStyle"  :style="lycStyle">
        <p
            v-for="(item, index) in lyricList"
            :key="index"
            :style="{
            color: currentLyc === index ? lyricColor : darkTheme ? '#888' : '#444',
            fontSize: currentLyc === index ? currentLyricSize : lyricSize,
            fontWeight: currentLyc === index ? 'bold' : 'normal',
            lineHeight: `${lineHeights[index]}px`
          }"
        >
          {{ item.lyc }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.music-player-wrapper {
  display: flex;
  gap: 20px;
  padding: 10px;
  height: 120px;
  background-color: transparent;
}

.left-panel {
  height: 100px;
  border-radius: 12px;
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  margin-top: -10px;
  padding-left: 20px;
  padding-right: 22px;
}

.control-style {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.control_btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1); /* 暗色背景适配 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 0;
  padding-left: 8px;
  color: #fff; /* 白色图标文字 */
}

.control_btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

.song-name {
  font-size: 14px;
  color: #fff; /* 暗色主题白色文字 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100px;
}

.progress-wrapper {
  width: 100%;
  height: 6px;
  background: #333; /* 深色背景的进度条轨道 */
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  margin-top: 8px;
}

.progress-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 3px;
}

.progress {
  position: absolute;
  height: 100%;
  width: 0%;
  border-radius: 3px;
  transition: width 0.1s linear;
  background-color: #1890ff; /* 播放进度颜色 */
}

.lyricBox {
  border-radius: 0 12px 12px 0;
  min-width: 250px;
  flex: 1;
  height: 80px;
  margin-top: -10px;
  overflow: hidden;
  position: relative;
  margin-left: -31px;
}

.lyricStyle {
  padding-left: 30px;
  position: absolute;
  width: 100%;
  transition: transform 0.3s ease;
}

.lyricStyle p {
  margin: 5px 0;
  transition: all 0.3s;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #aaa; /* 默认歌词颜色 */
  text-align: center;
}

.lyricStyle p.active {
  color: #1890ff; /* 高亮歌词颜色 */
  font-weight: bold;
}

.control_btn.active {
  background: #1890ff;
  color: #fff;
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.6);
}

.mobile-lyric-line {
  display: none;
  text-align: center;
  margin-top: 3px;
  font-size: 14px;
  font-weight: bold;
  color: #1890ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  .mobile-lyric-line {
    display: block;
  }

  .left-panel {
    margin-top: -20px;
    width: 100%;
    flex: none;
  }

  .lyricBox {
    display: none;
  }
}
</style>
