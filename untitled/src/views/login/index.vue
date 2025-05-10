<template>
  <div class="login-conr">
    <div class="login-conrs"></div>
    <div class="login-container">
      <!-- 左侧背景 -->
      <div class="login-left">
        <!-- logo -->
        <div class="login-logo"></div>
        <!-- 版权信息 -->
        <div class="login-footer">© 2025 yatagers. All rights reserved.</div>
      </div>
      <!-- 右侧登录框 -->
      <div class="login-right">
        <div class="login-box">
          <!-- 系统名称 -->
          <h2 class="login-title">{{ systemName }}</h2>
          <h2 class="login-title1">登录以继续</h2>
          <!-- 登录表单 -->
          <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" class="login-form">
            <el-form-item prop="userName">
              <el-input
                  v-model.trim="loginFormData.userName"
                  placeholder="请输入用户名"
                  size="large"
                  type="text"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  v-model.trim="loginFormData.password"
                  placeholder="请输入密码"
                  show-password
                  size="large"
                  type="password"
              />
            </el-form-item>
            <el-button
                :disabled="!loginFormData.userName || !loginFormData.password"
                :loading="loading"
                class="login-btn"
                size="large"
                type="primary"
                @click="handleLogin"
            >登 录
            </el-button>
          </el-form>
          <h2 class="login-footers">
            推荐使用 Chrome、Microsoft Edge 等浏览器，以获得最佳体验。
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, reactive, ref} from "vue"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus"
import {getWsTestData, wsLogin} from "@/api/common.js";

const loginFormRules = {
  userName: [{required: true, message: "请输入用户名", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}]
}
const router = useRouter()

const {proxy} = getCurrentInstance();

const {appName, appInfo} = proxy.$config

let logo = ref()
logo.value = new URL(`/src/assets/img/logo_${appName}.png`, import.meta.url).href

let loginBg = ref()
loginBg.value = new URL(`/public/login_bg.png`, import.meta.url).href
let loginBgUndefined = ref(true)
loginBgUndefined = loginBg.value.indexOf('undefined') == -1 ? true : false

const systemName = ref(appInfo[appName]['systemName'])

systemName.value = appInfo[appName]['systemName']
// 配置数据
const {Debug} = proxy.$config
// console.log("proxy",proxy.$WebSoket.ws.url);
/** 登录表单元素的引用 */
const loginFormRef = ref()

/** 登录按钮 Loading */
const loading = ref(false)


/** 登录表单数据 */
const loginFormData = reactive({
  userName: "",   // 123
  password: "",  // 123
  tempAuth: false
})


// 获取测试数据
const getTestData = async () => {
  let Res = getWsTestData('Login')
  setData(Res)
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// ws 获取页面数据
const getWsData = async () => {

  // console.log("__11111111111111____",▼☺☹㉿▤▼☺▼▦→♦☹☺▼)


  const formattedDate = formatTimestamp(new Date().getTime());
  console.log(formattedDate);
  // 页面初始化 获取数据指令
  proxy.$WebSoket.send(wsLogin({
    userName: loginFormData.userName,
    password: loginFormData.password,
    date: formatTimestamp(new Date().getTime()),
    tempAuth: loginFormData.tempAuth

  }))

  // proxy.$WebSoket.send({CMD: "GetDataDictionary",ARGV: {}})


  // 监听ws返回消息
  proxy.$WebSoket.onmessage((msg) => {
    console.log("-wsLogin-onmessage-msg", msg)

    try {
      const Res = JSON.parse(msg);
      setData(Res)
    } catch (e) {
      // 转换出错，抛出异常
      ElMessage.error(proxy.$t('common.Incorrectdataformat'))
    }

    // 解析响应数据
    // const Res = JSON.parse(msg);
    // setData(Res)
  })

  // 监听ws返回消息
  proxy.$WebSoket.onerror((msg) => {
    Debug && console.log("-wsLogin-onerror-msg", msg)
  })
}

// 处理数据
const setData = (Res) => {
  // 解析响应数据

  if (Res.RESP.Code == 200) {

    // 保存登录信息到本地存储
    localStorage.setItem('user', JSON.stringify(Res.RESP.Data));
    // ElMessage({
    //   message: proxy.$t('common.success'),
    //   type: 'success',
    // });
    // 跳转到主页
    loading.value = false
    router.push({path: "/"});
  } else {
    loading.value = false
    // 清空密码字段
    loginFormData.password = "";
    loginFormData.tempAuth = "";

    //提示${proxy.$t('common.errorMessage')}
    ElMessage({
      message: `${proxy.$t('common.errorMessage')}：${Res.RESP.Msg}`,
      type: 'error',
    })
  }
}

const handleLogin = async () => {
  loginFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      //延迟 1 秒
      setTimeout(() => {
        // if(!Debug) {
        //   console.log("模拟登录")
        //   getTestData()
        // } else {
        //   console.log("ws登录")
        //   getWsData()
        // }
        //先模拟判断用户名密码
        if (loginFormData.userName == 'admin' && loginFormData.password == 'admin123') {
          getWsData()
        } else {
          ElMessage({
            message: proxy.$t('common.mima'),
            type: 'error',
          })
        }
      }, 1500);

    }


  })
}
</script>

<style scoped>
/* 清除所有默认样式 */
/* 清除所有默认样式 */
.login-conr {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(45deg, #5E9BD5, #FFFFFF);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-conrs {
  width: 100%;
  height: 1px;
}

/* 🌟 页面整体布局 */
.login-container {
  display: flex;
  width: calc(100% - 180px);
  height: calc(100% - 180px);
  margin: 90px;
  background-color: rgba(245, 245, 245, 0.7);
  border-radius: 15px;
  box-sizing: border-box; /* 确保 margin 不影响元素的尺寸 */
}

/* 左侧背景 */
.login-left {
  flex: 5;
  background-image: url("/20250312101842.gif"); /* 确保 public 目录下有 login_bg.png */
  background-size: cover;
  background-position: center;
  position: relative; /* 设置父元素为相对定位 */
}

/* logo 样式 */
.login-logo {
  position: absolute;
  top: 20px; /* 距离顶部 20px */
  left: 20px; /* 距离左边 20px */
  width: 200px; /* 设置 logo 宽度 */
  height: 60px; /* 设置 logo 高度 */
  background-image: url('/ico.png'); /* 设置 logo 图片路径 */
  background-size: contain; /* 确保图片完整显示 */
  background-position: center;
  background-repeat: no-repeat; /* 防止图片重复 */
}

/* 底部版权信息 */
.login-footer {
  position: absolute;
  bottom: 20px; /* 距离底部 20px */
  left: 20px; /* 距离左边 20px */
  font-size: 14px;
  color: #333;
}

/* 右侧登录区域 */
.login-right {
  flex: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-top-right-radius: 15px; /* 右上角 */
  border-bottom-right-radius: 15px; /* 右下角 */
}

/* 登录框 */
.login-box {
  width: 400px;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  background-color: #f5f5f5;
}

/* 标题 */
.login-title {
  font-size: 26px;
  font-weight: 400;
  margin-bottom: 20px;
  color: #333;
  text-align: left;
}

.login-title1 {
  font-size: 16px;
  margin-bottom: 20px;
  color: rgba(51, 51, 51, 0.7);
  text-align: left;
}

.login-footers {
  font-size: 12px;
  margin-bottom: 20px;
  margin-top: 10px;
  color: rgba(51, 51, 51, 0.7);
  text-align: left;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  margin-top: 10px;
}
</style>
