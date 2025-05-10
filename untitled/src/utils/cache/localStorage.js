/** 统一处理 localStorage */
// import { ThemeName } from "@/hooks/useTheme.js"

// 正在应用的主题名称
export const getActiveThemeName = () => {
  return localStorage.getItem('appThemeName' || null)
}
export const setActiveThemeName = (themeName) => {
  localStorage.setItem('appThemeName', themeName)
}


