<template>
  <div class="layout__container">
    <div :style="{ backgroundColor: themeInfo[theme]?.color || '#409eff' }" class="layout__header">
      <div class="header__left">
        <div class="logo__box">
          <img :src="logo" alt=""/>
        </div>
        <div class="company__name">
          <span>{{ appInfo[appName].deviceName }}</span>
        </div>
      </div>
      <div class="header__user">
        <div class="header__user-name" style=" display: flex;
  align-items: center;
  justify-content: center;
">{{ userStore.userName }}
        </div>
        <el-popconfirm
            :cancel-button-text="$t('common.no')"
            :confirm-button-text="$t('common.yes')"
            :title="$t('common.surelogOut')"
            @confirm="logOut"
        >
          <template #reference>
            <div class="header__exit">
              <img alt="" src="../assets/icons/svg/log-out.svg"/>
            </div>
          </template>
        </el-popconfirm>

        <!--        <div class="header__theme">-->
        <!--          <el-switch-->
        <!--              v-model="themeDark"-->
        <!--              @change="changeTheme"-->
        <!--              inline-prompt-->
        <!--              style="&#45;&#45;el-switch-on-color: #021434; &#45;&#45;el-switch-off-color: #ccc"-->
        <!--              active-text="D"-->
        <!--              inactive-text="L"-->
        <!--          />-->
        <!--        </div>-->
      </div>
    </div>

    <div class="layout__main">
      <div class="layout__left">
        <!--        <el-scrollbar height="calc(100vh - 60px)">-->
        <!--&lt;!&ndash;          <el-button @click="isCollapsea" style="border: none; display: block; margin: 0 auto;">&ndash;&gt;-->
        <!--&lt;!&ndash;            <el-icon v-if="isCollapse"><Fold /></el-icon>&ndash;&gt;-->
        <!--&lt;!&ndash;            <el-icon v-else><Expand /></el-icon>&ndash;&gt;-->
        <!--&lt;!&ndash;          </el-button>&ndash;&gt;-->
        <!--          <Navigator :collapse="isCollapse"/>-->
        <!--        </el-scrollbar>-->
      </div>

      <div class="layout__right">
        <div class="layout__routerview">
          <div class="layout__toop">
            <RouterView/>
          </div>
          <div class="layout__footer">
            © 2025 雅泰歌思（上海）通讯科技有限公司 &nbsp&nbsp {{ appInfo[appName].deviceName }} -V{{ appVersion }}
          </div>
        </div>

        <!-- 添加底部信息 -->

      </div>
    </div>

    <!-- 底部固定按钮 -->
    <!--    <div class="fixed-button">-->
    <!--&lt;!&ndash;      <el-button @click="handleButtonClick" style="width: 100%; max-width: 200px;">&ndash;&gt;-->
    <!--&lt;!&ndash;        按钮&ndash;&gt;-->
    <!--&lt;!&ndash;      </el-button>&ndash;&gt;-->


    <!--      <el-menu-->
    <!--          default-active="2"-->
    <!--          class="el-menu-vertical-demo"-->
    <!--          @open="handleOpen"-->
    <!--          @close="handleClose"-->
    <!--          :collapse="isCollapse"-->
    <!--          router-->
    <!--      >-->
    <!--        <el-sub-menu index="1">-->
    <!--          <template #title>-->
    <!--            <el-icon><Postcard /></el-icon>-->
    <!--            <span>操作日志</span>-->
    <!--          </template>-->
    <!--          <el-menu-item-group>-->
    <!--            <el-menu-item index="1-2" :route="{ path: '/deviceLogs/gaojing' }">-->
    <!--              <el-icon><Warning /></el-icon>-->
    <!--              告警日志-->
    <!--            </el-menu-item>-->
    <!--          </el-menu-item-group>-->
    <!--          <el-menu-item-group>-->
    <!--            <el-menu-item index="1-3" :route="{ path: '/deviceLogs/caozuo' }">-->
    <!--              <el-icon><Pointer /></el-icon>-->
    <!--              操作日志-->
    <!--            </el-menu-item>-->
    <!--          </el-menu-item-group>-->
    <!--        </el-sub-menu>-->
    <!--      </el-menu>-->

    <!--    </div>-->
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from 'vue';
import {useRouter} from "vue-router"
import {useUserStore} from "@/stores/moduls/user.js";
import {getActiveThemeName} from "@/utils/cache/localStorage.js";
import {useTheme} from "@/hooks/useTheme.js";

const {proxy} = getCurrentInstance();
const {appName, appInfo, theme, themeInfo, appVersion} = proxy.$config;

let logo = ref();
logo.value = new URL(`/public/logo.png`, import.meta.url).href;

let locale = ref();
locale.value = localStorage.getItem('locale');

const changeLocal = () => {
  localStorage.setItem('locale', locale.value);
  window.location.reload();
};


const {setTheme} = useTheme();
const router = useRouter();
const userStore = useUserStore();

const isCollapse = ref(true);
const isCollapsea = () => {
  isCollapse.value = !isCollapse.value
}
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
const themeDark = ref(false);
themeDark.value = getActiveThemeName() == 'nomarl' ? false : true;

const changeTheme = () => {
  let themeName = getActiveThemeName();
  themeDark.value = themeName == 'nomarl' ? true : false;
  setTheme(themeName == 'nomarl' ? 'dark' : 'nomarl');
};

const handleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

// 退出登录
const logOut = () => {
  proxy.$WebSoket.close();
  userStore.logOut();
};

// 按钮点击事件
const handleButtonClick = () => {
  console.log("底部按钮被点击了");
};
</script>

<style lang="scss" scoped>
.layout__container {
  height: 100%;
}

.layout__header {
  width: 100vw;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  height: 40px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
}

.header__left {
  display: flex;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
}

.logo__box {
  line-height: 8px;
  overflow: hidden;
  height: 100%;
}

.logo__box img {
  display: inline-block;
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}

.company__name {
  width: 300px;
  padding-left: 10px;
  white-space: nowrap;
  font-weight: bold;

  span {
    line-height: 30px;
    font-size: 16px;
    color: var(--app-nav-text-color);
  }
}

.header__user {
  display: flex;
  padding-right: 20px;
  color: var(--app-nav-text-color);
}

.header__user-name {
  padding: 0 20px;
  line-height: 20px;
}

.header__exit {
  height: 30px;
  line-height: 10px;
  margin-top: 5px;
  padding: 0px 10px;
  cursor: pointer;
}

.header__exit:hover {
  background-color: var(--app-chart-color-light-4);
}

.header__exit span {
  color: var(--app-nav-text-color);
}

.header__theme {
  margin-left: 20px;
  line-height: 20px;
}

.layout__main {
  height: 100%;
  overflow: hidden;
  display: flex;
}

.layout__left {
  border-right: 1px solid #ccc;
  background-color: var(--app-color-section-background);
}

.layout__left .el-menu {
  border-right: none;
}

.layout__right {
  flex-grow: 1;
  overflow-x: auto;
}

.layout__routerview {
  height: calc(100% - 30px);
  overflow-y: auto;
  color: var(--app-text-color);
  background-color: #ffffff;
}

/* 固定按钮样式 */
.fixed-button {
  position: fixed;
  bottom: 10px;
  z-index: 10;
  max-width: 150px;
}

.el-menu-item a:hover {
  text-decoration: none;
  box-shadow: none;
}

.layout__footer {
  height: 38px;
  text-align: center;
  font-size: 12px;
  color: #666;
  line-height: 38px;
  border-top: 1px solid rgba(71, 157, 218, 0.3);;
  //background-color: rgba(71, 157, 218, 0.1);
}

.layout__toop {
  height: calc(100% - 40px);
  overflow: hidden;
}
</style>
