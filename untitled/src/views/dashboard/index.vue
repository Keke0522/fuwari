<template>
  <div class="app-container">
    <el-form
        ref="queryForm"
        :inline="true"
        :model="queryParams"
        class="form-wrapper"
        label-width="68px"
        size="small"

    >
      <div class="form-left">
        <el-form-item>
          <el-tag type="success"> 在线设备数：{{ onlineCount }}</el-tag>
          <!--          //{-->
          <!--          "startIp": "192.168.1.1",-->
          <!--          "endIp": "192.168.1.254"-->
          <!--          }-->
          <div style="margin-left: 10px">
            <el-input
                v-model="queryParams.startIp"
                clearable
                placeholder="192.168.1.0"
                size="small"
                style="width: 100px; height: 20px; line-height: 20px;"
            />
            -
            <el-input
                v-model="queryParams.endIp"
                clearable
                placeholder="192.168.1.254"
                size="small"
                style="width: 100px; height: 20px; line-height: 20px;"
            />
            <el-button icon="refresh" size="small" style="color: #ffffff" type="text" @click="handleRefresh">扫描
            </el-button>
          </div>

        </el-form-item>
      </div>

      <div class="form-right">
        <el-form-item prop="ipaddress">
          <template #label>
            <span style="color: #ffffff">ip 查询</span>
          </template>
          <el-input
              v-model="queryParams.ipaddress"
              clearable
              placeholder="请输入查询 ip"
              style="width: 100px; height: 20px; line-height: 20px;"
          />
        </el-form-item>
        <el-form-item>
          <!--          <div v-if="queryParams.ipaddress!=''&&listData.length==0">-->
          <!--            <el-button style="margin-right: 10px"  size="small" icon="plus" @click="handleQuery"  >添加</el-button>-->
          <!--          </div>-->
          <el-button icon="refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button icon="setting" size="small" @click="showColumnSettings">列设置</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table
        v-loading="loading"
        :data="listData"
        :expand-row-keys="expandedRows"
        :header-cell-style="{ backgroundColor: ' rgba(158, 141, 204, 0.8)', color: 'white', fontWeight: 'bold' }"
        :row-class-name="tableRowClassName"
        :row-key="rowKey"
        height="calc(100vh - 100px)"
        size="small"
        stripe
        style="width: 100%;"
        @expand-change="handleExpandChange"
    >
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template #default="{ row }">

          <el-button :disabled="!Object.values(visibleCharts).includes(false)" style="margin-left: 20px" type="text"
                     @click="handleCreate">
            <el-icon style="margin-right: 3px">
              <Refresh/>
            </el-icon>
            恢复
          </el-button>
          <div class="chart-container">


            <!--            <echars v-if="visibleCharts['mem']"-->
            <!--                    id="mem"-->
            <!--                    :realtimeData="row._chartData?.mem ?? []"-->
            <!--                    title="内存"-->
            <!--                    @destroy="handleDestroy('mem')"/>-->
            <!--            <echars v-if="visibleCharts['disk']"-->
            <!--                    id="disk"-->
            <!--                    :realtimeData="row._chartData?.disk ?? []"-->
            <!--                    title="硬盘"-->
            <!--                    @destroy="handleDestroy('disk')"/>-->
            <!--            <echars v-if="visibleCharts['qtwd']"-->
            <!--                    id="qtwd"-->
            <!--                    :realtimeData="row._chartData?.qtwd ?? []"-->
            <!--                    title="腔体温度"-->
            <!--                    @destroy="handleDestroy('qtwd')"/>-->
            <!--            <echars v-if="visibleCharts['spwd']"-->
            <!--                    id="spwd"-->
            <!--                    :realtimeData="row._chartData?.spwd ?? []"-->
            <!--                    title="射频温度"-->
            <!--                    @destroy="handleDestroy('spwd')"/>-->
            <!--            <echars v-if="visibleCharts['qtsd']"-->
            <!--                    id="qtsd"-->
            <!--                    :realtimeData="row._chartData?.qtsd ?? []"-->
            <!--                    title="腔体湿度"-->
            <!--                    @destroy="handleDestroy('qtsd')"/>-->
            <net v-if="visibleCharts['yj1']"
                 id="yj1"
                 :mac="row.MAC"
                 :realtimeData="row._chartData?.yj1 ?? { name: ['cpu', '内存', '硬盘'], cpu: [], 内存: [], 硬盘: [] }"
                 title="系统资源"
                 @destroy="handleDestroy('yj1')"/>
            <net v-if="visibleCharts['yj2']"
                 id="yj2"
                 :mac="row.MAC"
                 :realtimeData="row._chartData?.yj2 ?? { name: ['腔体温度', '射频温度', '腔体湿度'], 腔体温度: [], 射频温度: [], 腔体湿度: [] }"
                 title="环境健康"
                 @destroy="handleDestroy('yj2')"/>

            <net v-if="visibleCharts['net1'] && row.NET1.status !== 'linkdown'"
                 id="NET1"
                 :mac="row.MAC"
                 :realtimeData="row._chartData?.NET1 ?? { name:['Rx', 'Tx', '温度'],Rx: [], Tx: [], 温度: [] }"
                 title="NET1"
                 @destroy="handleDestroy('net1')"/>

            <net v-if="visibleCharts['net2'] && row.NET2.status !== 'linkdown'"
                 id="NET2"
                 :mac="row.MAC"
                 :realtimeData="row._chartData?.NET2 ?? { name:['Rx', 'Tx', '温度'],Rx: [], Tx: [], 温度: [] }"
                 title="NET2"
                 @destroy="handleDestroy('net2')"/>

            <net v-if="visibleCharts['net3'] && row.NET3.status !== 'linkdown'"
                 id="NET3"
                 :mac="row.MAC"
                 :realtimeData="row._chartData?.NET3 ?? { name:['Rx', 'Tx', '温度'],Rx: [], Tx: [], 温度: [] }"
                 title="NET3"
                 @destroy="handleDestroy('net3')"/>

            <net v-if="visibleCharts['net4'] && row.NET4.status !== 'linkdown'"
                 id="NET4"
                 :mac="row.MAC"
                 :realtimeData="row._chartData?.NET4 ?? { name:['Rx', 'Tx', '温度'],Rx: [], Tx: [], 温度: [] }"
                 title="NET4"
                 @destroy="handleDestroy('net4')"/>
          </div>
        </template>
      </el-table-column>
      <!-- 序号列 -->
      <el-table-column :width="80" align="center" label="序号" type="index">
        <template #default="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <!-- 动态列 -->
      <el-table-column
          v-for="column in visibleColumns"
          :key="column.prop"
          :align="column.align"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
      >
        <template #default="{ row }">
          <!-- IP地址可点击 -->
          <a
              v-if="column.prop === 'ipaddress'"
              style="cursor: pointer;"
              @click="handleIpClick(row.ipaddress)"
          >
            {{ row.ipaddress }}
          </a>

          <!-- 状态字段特殊处理 -->
          <template v-else-if="column.prop === 'status'">
  <span
      v-if="row.status === 0"
      class="status-dot online"
  ></span>
            <span
                v-else-if="row.status === 1"
                class="status-dot offline"
            ></span>
            <span
                v-else
                style="color: orange; cursor: pointer;"
                @click="handleVerify(row)"
            >
    需验证
  </span>
          </template>
          <template v-else-if="['NET1', 'NET2', 'NET3', 'NET4'].includes(column.prop)">
            <div>

              <el-text v-if="row[column.prop]?.status === 'linkup'" size="small" type="primary">
                ⬇️ {{ row[column.prop]?.Rx || '0' }} |
                ⬆️ {{ row[column.prop]?.Tx || '0' }} |
                🌡 {{ row[column.prop]?.Tem || 'N/A' }}
              </el-text>
              <el-text
                  v-else-if="row[column.prop]?.status === 'linkdown'"
                  size="small"
                  type="warning"
              >
                未连接
              </el-text>
              <el-text v-else size="small" type="info">
                未知状态
              </el-text>
            </div>
          </template>

          <!-- 其他字段默认展示 -->
          <span v-else>{{ row[column.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          label="详情"
          width="120"
      >
        <template #default="{ row }">
          <el-button size="small" type="text" @click="handleViewDetails(row)">详情</el-button>


          <el-dropdown trigger="click" @command="command => handleMoreActions(command, row)"
          >
            <template #default>
              <el-button size="small" type="text">
                <el-icon>
                  <More/>
                </el-icon>
              </el-button>
            </template>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="forceLogout">强退</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 列设置对话框 -->
    <el-dialog v-model="columnSettingsVisible" :teleport="false" title="列设置">
      <el-checkbox-group v-model="selectedColumns" class="checkbox-group">
        <div v-for="column in allColumns" :key="column.prop" class="checkbox-item">
          <el-checkbox :label="column.prop">{{ column.label }}</el-checkbox>
        </div>
      </el-checkbox-group>

      <template #footer>
        <el-button @click="columnSettingsVisible = false">取消</el-button>
        <el-button type="primary" @click="applyColumnSettings">保存</el-button>
      </template>
    </el-dialog>

    <!-- 设备详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="设备详情" width="60vw">
      <el-descriptions
          :column="4"
          border
          content-align="center"
          label-align="center"
          style="width: 100%; text-align: center;"
      >
        <el-descriptions-item align="center" label="IP地址">{{ detailRow.ipaddress }}</el-descriptions-item>
        <el-descriptions-item align="center" label="状态">{{ detailRow.status }}</el-descriptions-item>
        <el-descriptions-item :span="2" align="center" label="MAC地址">{{ detailRow.MAC }}</el-descriptions-item>

        <el-descriptions-item align="center" label="基带版本">{{ detailRow.BBVersion }}</el-descriptions-item>
        <el-descriptions-item align="center" label="射频版本">{{ detailRow.Wb_version }}</el-descriptions-item>
        <el-descriptions-item :span="2" align="center" label="内核版本">{{ detailRow.Kernel }}</el-descriptions-item>
        <el-descriptions-item align="center" label="cpu">{{ detailRow.cpu_usage }}</el-descriptions-item>
        <el-descriptions-item align="center" label="内存">{{ detailRow.memory_usage }}</el-descriptions-item>
        <el-descriptions-item :span="2" align="center" label="硬盘">{{ detailRow.dist_usage }}</el-descriptions-item>
        <el-descriptions-item align="center" label="腔体温度">{{ detailRow.tem }}</el-descriptions-item>
        <el-descriptions-item align="center" label="射频温度">{{ detailRow.tem_wb }}</el-descriptions-item>
        <el-descriptions-item :span="2" align="center" label="腔体湿度">{{ detailRow.hum }}</el-descriptions-item>

        <el-descriptions-item :span="2" align="center" label="NET1">
          <el-text v-if="detailRow.NET1?.status === 'linkup'" size="small" type="primary">
            ⬇️ {{ detailRow.NET1?.Rx || '0' }} |
            ⬆️ {{ detailRow.NET1?.Tx || '0' }} |
            🌡 {{ detailRow.NET1?.Tem || 'N/A' }}
          </el-text>
          <el-text
              v-else-if="detailRow.NET1?.status === 'linkdown'"
              size="small"
              type="warning"
          >
            未连接
          </el-text>
        </el-descriptions-item>
        <el-descriptions-item :span="2" align="center" label="NET2">
          <el-text v-if="detailRow.NET2?.status === 'linkup'" size="small" type="primary">
            ⬇️ {{ detailRow.NET2?.Rx || '0' }} |
            ⬆️ {{ detailRow.NET2?.Tx || '0' }} |
            🌡 {{ detailRow.NET2?.Tem || 'N/A' }}
          </el-text>
          <el-text
              v-else-if="detailRow.NET2?.status === 'linkdown'"
              size="small"
              type="warning"
          >
            未连接
          </el-text>
        </el-descriptions-item>
        <el-descriptions-item :span="2" align="center" label="NET3">
          <el-text v-if="detailRow.NET3?.status === 'linkup'" size="small" type="primary">
            ⬇️ {{ detailRow.NET3?.Rx || '0' }} |
            ⬆️ {{ detailRow.NET3?.Tx || '0' }} |
            🌡 {{ detailRow.NET3?.Tem || 'N/A' }}
          </el-text>
          <el-text
              v-else-if="detailRow.NET3?.status === 'linkdown'"
              size="small"
              type="warning"
          >
            未连接
          </el-text>
        </el-descriptions-item>
        <el-descriptions-item :span="2" align="center" label="NET4">
          <el-text v-if="detailRow.NET4?.status === 'linkup'" size="small" type="primary">
            ⬇️ {{ detailRow.NET4?.Rx || '0' }} |
            ⬆️ {{ detailRow.NET4?.Tx || '0' }} |
            🌡 {{ detailRow.NET4?.Tem || 'N/A' }}
          </el-text>
          <el-text
              v-else-if="detailRow.NET4?.status === 'linkdown'"
              size="small"
              type="warning"
          >
            未连接
          </el-text>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, nextTick, onMounted, reactive, ref, watch} from 'vue'
import {ElNotification} from 'element-plus'
import net from './util/net.vue'
import axios from "axios";

const {proxy} = getCurrentInstance();
const expandedRows = ref([])
const rowKey = (row) => row.ipaddress

// 初始化图表可见性控制
let visibleCharts = reactive({
  yj1: true,
  yj2: true,
  net1: true,
  net2: true,
  net3: true,
  net4: true,
})
const handleCreate = () => {
  visibleCharts = {
    yj1: true,
    yj2: true,
    net1: true,
    net2: true,
    net3: true,
    net4: true,
  }
  // 重新触发视图更新
  nextTick(() => {
    console.log('Chart created:'); // 确认创建后视图更新
  });
};
const handleDestroy = (chartKey) => {
  visibleCharts[chartKey] = false;
  // 重新触发视图更新
  nextTick(() => {
    console.log('Chart destroyed:', chartKey); // 确认销毁后视图更新
  });
};

function handleExpandChange(row) {
  // 判断当前点击行是否已展开
  const currentKey = row.ipaddress
  if (expandedRows.value.includes(currentKey)) {
    // 已展开则关闭
    expandedRows.value = []
  } else {
    // 未展开则只保留当前行
    expandedRows.value = [currentKey]
  }
}


// 状态数据
const loading = ref(true)
const total = ref(0)
const savedList = ref([])

// 用 computed 派生出 listData（用于表格展示
const listData = computed(() => {
  const keyword = queryParams.value.ipaddress?.trim();
  if (!keyword) return savedList.value;
  return savedList.value.filter(item => item.ipaddress?.includes(keyword));
})

const pageNum = ref(1)
const pageSize = ref(10)
const parseNetInfo = (netString) => {
  return {
    status: netString.match(/status:\s*'([^']+)'/)?.[1] ?? 'unknown',
    Rx: netString.match(/Rx:\s*'([^']+)'/)?.[1] ?? 'unknown',
    Tx: netString.match(/Tx:\s*'([^']+)'/)?.[1] ?? 'unknown',
    Tem: netString.match(/Tem:\s*'([^']+)'/)?.[1] ?? 'unknown',
  };
};
const queryParams = ref({
  ipaddress: undefined,
  userName: undefined,
  startIp: '192.168.1.0',
  endIp: '192.168.1.254',
})

const allColumns = ref([
  {label: 'IP地址', prop: 'ipaddress', align: 'center', width: '100'},
  {label: '状态', prop: 'status', align: 'center'},
  {label: 'MAC地址', prop: 'MAC', align: 'center', width: '130'},
  {label: 'NET1', prop: 'NET1', align: 'center', width: '250'},
  {label: 'NET2', prop: 'NET2', align: 'center', width: '250'},
  {label: 'NET3', prop: 'NET3', align: 'center', width: '250'},
  {label: 'NET4', prop: 'NET4', align: 'center', width: '250'},
  {label: '基带版本', prop: 'BBVersion', align: 'center', width: '130'},
  {label: '射频版本', prop: 'Wb_version', align: 'center', width: '130'},
  {label: '内核版本', prop: 'Kernel', align: 'center', width: '130'},
  {label: 'CPU', prop: 'cpu_usage', align: 'center'},
  {label: '内存', prop: 'memory_usage', align: 'center'},
  {label: '硬盘', prop: 'dist_usage', align: 'center'},
  {label: '腔体温度', prop: 'tem', align: 'center'},
  {label: '射频温度', prop: 'tem_wb', align: 'center'},
  {label: '腔体湿度', prop: 'hum', align: 'center'},
])

const selectedColumns = ref([
  'ipaddress',
  'status',
  'MAC',
  'cpu_usage',
  'memory_usage',
  'dist_usage',
  'tem',
  'tem_wb',
  'hum',
])

const columnSettingsVisible = ref(false)
const detailDialogVisible = ref(false)
const detailRow = ref({})

// 计算属性
const visibleColumns = computed(() =>
    allColumns.value.filter((col) => selectedColumns.value.includes(col.prop))
)

const onlineCount = computed(() =>
    savedList.value.filter((item) => item.status === 0).length
)


function resetQuery() {
  queryParams.value = {ipaddress: undefined, userName: undefined}
}

function handleForceLogout(row) { /* 保持原逻辑 */
}

function showColumnSettings() {
  columnSettingsVisible.value = true
}

function applyColumnSettings() {
  //将selectedColumns.value存到浏览器缓存
  localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns.value));

  columnSettingsVisible.value = false
}

function handleIpClick(ipaddress) {
  //跳转
  window.open(`http://${ipaddress}`, '_blank');
}

function handleViewDetails(row) {
  detailRow.value = row;
  detailDialogVisible.value = true
}

function handleMoreActions(command, row) { /* 保持原逻辑 */
}

function handleDelete(row) { /* 保持原逻辑 */
}

function handleEdit(row) {
  alert(`编辑 ${row.userName}`)
}

function handlePing(row) { /* 模拟 ping */
}

function handleVerify(row) { /* 弹出验证框 */
}

function tableRowClassName({row}) {
  return row.status === 2 ? 'verify-row' : ''
}

function handleRefresh() {
  // 构建请求参数
  let params = {
    startIp: queryParams.value.startIp,
    endIp: queryParams.value.endIp,
  };

  // 可选刷新接口逻辑
  console.log(params);

  // 修改请求 URL 为正确的地址和端口
  axios.post('http://192.168.2.28:8001/ssdp/scan-range', params)
      .then(response => {
        console.log('扫描成功:', response.data);
      })
      .catch(error => {
        console.error('扫描失败:', error);
      });
}


const setData = (Res) => {
  const updateDeviceData = (item, data) => {
    console.log("====", data);
    item.status = 0;

    // 更新静态字段
    Object.assign(item, {
      MAC: data.MAC ?? item.MAC,
      BBVersion: data.BBVersion ?? item.BBVersion,
      Wb_version: data.Wb_version ?? item.Wb_version,
      Kernel: data.Kernel ?? item.Kernel,
      cpu_usage: data.cpu_usage !== undefined ? (data.cpu_usage * 100).toFixed(1) + "%" : item.cpu_usage,
      memory_usage: data.memory_usage !== undefined ? (data.memory_usage * 100).toFixed(1) + "%" : item.memory_usage,
      dist_usage: data.dist_usage !== undefined ? (data.dist_usage * 100).toFixed(1) + "%" : item.dist_usage,
      tem: data.tem !== undefined ? data.tem + "°C" : item.tem,
      tem_wb: data.tem_wb !== undefined ? data.tem_wb + "°C" : item.tem_wb,
      hum: data.hum !== undefined ? data.hum + "%" : item.hum,
      NET1: parseNetInfo(data.Net1),
      NET2: parseNetInfo(data.Net2),
      NET3: parseNetInfo(data.Net3),
      NET4: parseNetInfo(data.Net4),
    });

// ✅ 正确地单独初始化 _chartData（Object.assign 外）
    if (!item._chartData) {
      item._chartData = {
        yj1: {
          name: ['cpu', '内存', '硬盘'],
          cpu: [],
          内存: [],
          硬盘: [],
        },
        yj2: {
          name: ['腔体温度', '射频温度', '腔体湿度'],
          腔体温度: [],
          射频温度: [],
          腔体湿度: [],
        },
        NET1: {
          name: ['Rx', 'Tx', '温度'],
          Rx: [],
          Tx: [],
          温度: []
        },
        NET2: {
          name: ['Rx', 'Tx', '温度'],
          Rx: [],
          Tx: [],
          温度: []
        },
        NET3: {
          name: ['Rx', 'Tx', '温度'],
          Rx: [],
          Tx: [],
          温度: []
        },
        NET4: {
          name: ['Rx', 'Tx', '温度'],
          Rx: [],
          Tx: [],
          温度: []
        }
      }
    }

// ✅ 添加实时数据点（保持最多 600 个）
    const now = new Date()

// 改造后的 pushData 支持分组结构
    const pushData = (group, key, rawValue) => {
      const value = Number(rawValue?.toFixed?.(1) ?? rawValue ?? 0)
      const arr = item._chartData[group][key]

      arr.push({time: now, value})

      // 如果数量少于 600，就用首值填充前面
      while (arr.length < 600) {
        arr.unshift({time: new Date(now - (600 - arr.length) * 1000), value})
      }

      if (arr.length > 600) arr.shift()
    }

// ✅ 按照分组结构调用
    pushData('yj1', 'cpu', data.cpu_usage * 100)
    pushData('yj1', '内存', data.memory_usage * 100)
    pushData('yj1', '硬盘', data.dist_usage * 100)

    pushData('yj2', '腔体温度', data.tem)
    pushData('yj2', '射频温度', data.tem_wb)
    pushData('yj2', '腔体湿度', data.hum)

    // ✅ 网络口数据（Rx、Tx、温度）统一追加函数
    const pushNetData = (netKey, rxRaw, txRaw, temRaw) => {
      const netGroup = item._chartData[netKey]
      const push = (arr, value) => {
        value = Number(value?.toFixed?.(1) ?? value ?? 0)
        arr.push({time: now, value})
        while (arr.length < 600) {
          arr.unshift({time: new Date(now - (600 - arr.length) * 1000), value})
        }
        if (arr.length > 600) arr.shift()
      }

      push(netGroup.Rx, rxRaw)
      push(netGroup.Tx, txRaw)
      push(netGroup.温度, temRaw)
    }

// ✅ 解析并追加数据
    const net1 = parseNetInfo(data.Net1)
    const net2 = parseNetInfo(data.Net2)
    const net3 = parseNetInfo(data.Net3)
    const net4 = parseNetInfo(data.Net4)

    pushNetData('NET1', parseFloat(net1.Rx), parseFloat(net1.Tx), parseFloat(net1.Tem))
    pushNetData('NET2', parseFloat(net2.Rx), parseFloat(net2.Tx), parseFloat(net2.Tem))
    pushNetData('NET3', parseFloat(net3.Rx), parseFloat(net3.Tx), parseFloat(net3.Tem))
    pushNetData('NET4', parseFloat(net4.Rx), parseFloat(net4.Tx), parseFloat(net4.Tem))

// ✅ 限制长度
    for (const key in item._chartData) {
      const chartItem = item._chartData[key]
      if (Array.isArray(chartItem)) {
        // 普通数组图表字段
        if (chartItem.length > 600) chartItem.shift()
      } else if (typeof chartItem === 'object' && chartItem !== null) {
        // 网络口图表 NET1~NET4
        for (const subKey in chartItem) {
          if (Array.isArray(chartItem[subKey]) && chartItem[subKey].length > 600) {
            chartItem[subKey].shift()
          }
        }
      }
    }
    console.log("🚀 ~ file: index.vue:107 ~ setData ~ item:", item);
  };

  if (Res.type === "设备回复") {
    lastResponseTime = Date.now(); // ✅ 更新最后响应时间
    notified.value = false;
    try {
      const Data = JSON.parse(Res.message);
      const linkinfos = Data?.RESP?.Data?.linkinfos;
      if (!linkinfos) return;
      const cleanMac = Res.mac.replace(/^"|"$/g, ""); // 去掉首尾的引号
      const item = savedList.value.find(item => item.ipaddress === Res.ip && item.MAC === cleanMac);
      if (item) {
        updateDeviceData(item, linkinfos);
      } else {
        savedList.value.push({
          ipaddress: Res.ip,
          status: 0,
          MAC: linkinfos.MAC,
          BBVersion: linkinfos.BBVersion,
          Wb_version: linkinfos.Wb_version,
          Kernel: linkinfos.Kernel,
          cpu_usage: linkinfos.cpu_usage * 100 + "%",
          memory_usage: linkinfos.memory_usage * 100 + "%",
          dist_usage: linkinfos.dist_usage * 100 + "%",
          tem: linkinfos.tem + "°C",
          tem_wb: linkinfos.tem_wb + "°C",
          hum: linkinfos.hum + "%",
          NET1: parseNetInfo(linkinfos.Net1),
          NET2: parseNetInfo(linkinfos.Net2),
          NET3: parseNetInfo(linkinfos.Net3),
          NET4: parseNetInfo(linkinfos.Net4),
        });
      }
    } catch (err) {
      console.error("解析设备回复失败：", err);
    }

  } else if (Res.type === "设备上线") {
    lastResponseTime = Date.now(); // ✅ 更新最后响应时间
    notified.value = false;
    ElNotification({
      title: '设备上线！' + `${Res.ip}`,
      message: `MAC: ${Res.mac}`,
      type: 'success',
      dangerouslyUseHTMLString: true
    })
  } else if (Res.type === "设备离线") {
    lastResponseTime = Date.now(); // ✅ 更新最后响应时间
    notified.value = false;
    const item = savedList.value.find(item => item.ipaddress === Res.ip);
    if (item) item.status = 1;
    ElNotification({
      title: '设备离线！' + `${Res.ip}`,
      message: `MAC: ${Res.mac}`,
      type: 'info',
      dangerouslyUseHTMLString: true
    })
  }
};

function getWs() {
  proxy.$WebSoket.onmessage((msg) => {
    try {
      const Res = JSON.parse(msg);
      setData(Res);
    } catch (err) {
      setData(msg);
    }
  })
}

let lastResponseTime = Date.now()
let notified = ref(false) // 用更语义化的变量名更清晰

// 定时检查是否超时未收到设备响应
setInterval(() => {
  const now = Date.now()
  if (now - lastResponseTime > 2000 && !notified.value) {
    //判断 savedList.value里面有设备在线的
    if (savedList.value.some(item => item.status === 0)) {
      // 提示网络中断
      savedList.value.forEach(item => {
        if (item.status !== 1) {
          item.status = 1
        }
      })
    }
    notified.value = true

  }
}, 1000)
//监听queryParams.ipaddress
watch(
    () => queryParams.value.ipaddress,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        if (newVal && newVal.trim() !== '') {
          // 模糊匹配筛选
          listData.value = savedList.value.filter(item =>
              item.ipaddress && item.ipaddress.includes(newVal)
          )
        } else {
          // 为空则恢复全部数据
          listData.value = [...savedList.value]
        }
      }
    }
)
onMounted(() => {
  const savedStr = localStorage.getItem('selectedColumns')
  if (savedStr) {
    selectedColumns.value = JSON.parse(savedStr)
  }
  getWs()
  loading.value = false
})
</script>

<style scoped>
.app-container {
  min-width: 850px;
  padding-top: 30px; /* 表单高度 + 点余量，防止遮挡表格 */
  overflow-y: hidden; /* 隐藏垂直滚动条 */
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.form-wrapper {
  position: fixed;
  top: 35px;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(158, 141, 204, 0.8);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  height: 35px;
  min-width: 850px;
}

.form-left {
  flex: 3;
  min-width: 415px;
  margin-left: 10px;
}

.form-right {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex: 2.8;
}

::v-deep .verify-row {
  background-color: #fff9e6 !important;
}

.status-dot {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 5px;
  margin-bottom: -2px;
}

.status-dot.online {
  background-color: #a18cd1;
  animation: pulse 1.4s infinite;
}

.status-dot.offline {
  background-color: gray;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.4) translateY(1px); /* 稍微放大并下移2px */
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.chart-container {
  width: 100vw;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 每行显示3个组件 */
  gap: 10px; /* 元素间的间隙 */
}

.chart-container > * {
  width: calc(100%); /* 使每个组件的宽度填满各自的网格单元 */
}

</style>
