import dayjs from "dayjs"
// import { removeConfigLayout } from "@/utils/cache/localStorage"

/** 格式化时间 */
export const formatDateTime = (time) => {
  return time ? dayjs(new Date(time)).format("YYYY-MM-DD HH:mm:ss") : "N/A"
}

/** 用 JS 获取全局 css 变量 */
export const getCssVariableValue = (cssVariableName) => {
  let cssVariableValue = ""
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** 用 JS 设置全局 CSS 变量 */
export const setCssVariableValue = (cssVariableName, cssVariableValue) => {
  try {
    document.documentElement.style.setProperty(cssVariableName, cssVariableValue)
  } catch (error) {
    console.error(error)
  }
}

/** 重置项目配置 */
export const resetConfigLayout = () => {
  // removeConfigLayout()
  location.reload()
}

// 生成随机数
export const randomNum = (max, min) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return num
}



// 返回数组平均值
export const averageArr = (arr) => {
  const average = arr.reduce((sum, value) => sum + value, 0) / arr.length;
  return parseFloat(average)
}

// 散点图随机坐标
export const getPoints = (qam)=>{
  let data = []
  var minX = -qam; // x 轴最小值
  var maxX = qam; // x 轴最大值
  var minY = -qam; // y 轴最小值
  var maxY = qam; // y 轴最大值

  // 计算网格单元格的宽度和高度
  var gridWidth = (maxX - minX) / qam*2; // 默认为 10x10 的网格
  var gridHeight = (maxY - minY) / qam*2;

  for (let i = 0; i < 1024; i++) {
      var randomX = Math.random() * (maxX - minX) + minX;
      var randomY = Math.random() * (maxY - minY) + minY;
      
      // 根据网格单元格的宽度和高度调整坐标位置
      var adjustedX = Math.floor((randomX - minX) / gridWidth) * gridWidth + gridWidth / 2;
      var adjustedY = Math.floor((randomY - minY) / gridHeight) * gridHeight + gridHeight / 2;

      if(i<250) {
        data.push([adjustedX-1 + randomNum(50, -50)/100  , adjustedY-1 + randomNum(50, -50)/100]);
      }

      if(i>250 && i<500 ) {
        data.push([-adjustedX+1 +  randomNum(50, -50)/100, adjustedY-1 +  randomNum(50, -50)/100]);
      }

      if(i>500 && i<750) {
        data.push([adjustedX-1 +  randomNum(50, -50)/100, -adjustedY+1 +  randomNum(50, -50)/100]);
      }

      if(i>750) {
        data.push([-adjustedX+1 +  randomNum(50, -50)/100, -adjustedY+1 +  randomNum(50, -50)/100]);
      }
     
  }
  // console.log("---", data)
  return data
}


// n组数数据  求n组数据里面 某一下标对应数据的平均值
export const getAverageOfElements = (arrays, index) => {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      sum += parseInt(arrays[i][index])
      count++;
    }
  }
  return count > 0 ? parseInt(sum / count) : 0;
}

// 转布尔值
export const toBoolean = (word) =>{
  switch(word.toLowerCase().trim()){
      case "yes": case "true": case "1": return true;
      case "no": case "false": case "0": case null: return false;
      default: return Boolean(word);
  }
}

export const isNullOrEmpty = (data) => {
  if (data === null || data === undefined) {
    return true;
  }
  if (typeof data === 'string' && data.trim() === '') {
    return true;
  }
  if (Array.isArray(data) && data.length === 0) {
    return true;
  }
  if (typeof data === 'object' && Object.keys(data).length === 0) {
    return true;
  }
  return false;
}

// 根据数组 字段重组通用options
export const toOptions = (list, valueKey, lableKey) => {
  let arr  = []
  if(!list.length) {
      return arr
  }
  list.forEach(element => {
      arr.push({
          label: element[lableKey],
          value: element[valueKey]
      })
  });
  return arr 
}

// 根据id查找options对应label 单个
export const toOptionsLable = (options, valueId, keyName = '') => {
  let label  = ''
  if(isNullOrEmpty(options) || isNullOrEmpty(valueId) ) {
      return label
  }
  let item = options.find(element => element.value == valueId);
  return label = item? isNullOrEmpty(keyName)? item.label: item[keyName] : ''
}

// 根据id查找options对应label 多个
export const toOptionsLableMultiple = (options, valueIds) => {

  let label  = ''
  if(isNullOrEmpty(options) || isNullOrEmpty(valueIds)) {
      return label
  }
  let items = options.filter(item => valueIds.includes(item.value));
  items.forEach(item=>{label = label + ' ' + item.label})
  return label 
}



