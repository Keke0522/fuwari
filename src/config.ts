import type {
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	CommentConfig
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Ke.ke",
	subtitle: "Demo Site",
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th' 语言设置
	themeColor: {
		hue: 250, // 主题色的色调范围从0到360。例如：红色：0，青色：200，蓝色：250，粉色：345
		fixed: false, // 是否隐藏主题颜色选择器，访客可见
	},
	banner: {
		enable: true, // 是否启用横幅
		src: "https://keke0420-1330580499.cos.ap-shanghai.myqcloud.com/img/%E5%9C%A8%E5%B1%B1%E7%9A%84%E9%82%A3%E8%BE%B94K%E9%A3%8E%E6%99%AF%E5%A3%81%E7%BA%B83840x2160_%E5%BD%BC%E5%B2%B8%E5%9B%BE%E7%BD%91.jpg?imagevanblog", // 横幅图片的路径，相对于 /src 目录，如果路径以 / 开头则相对于 /public 目录
		position: "center", // 横幅位置，对应 object-position 属性，只支持 'top', 'center', 'bottom'，默认为 'center'
		credit: {
			enable: true, // 是否显示横幅图片的版权信息
			text: "在山的那边", // 显示的版权文字
			url: "https://pic.netbian.com/tupian/36636.html", // （可选）指向原始艺术作品或艺术家页面的 URL 链接
		},
	},
	toc: {
		enable: true, // 是否在文章右侧显示目录
		depth: 2, // 显示目录的最大标题深度，从 1 到 3
	},
	favicon: [
		// 留空数组以使用默认的 favicon
		// {
		//   src: '/favicon/icon.png',    // favicon 的路径，相对于 /public 目录
		//   theme: 'light',              // （可选）设置为 'light' 或 'dark'，仅当有不同的 favicon 时才设置
		//   sizes: '32x32',              // （可选）favicon 的尺寸，仅当有不同尺寸的 favicon 时设置
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Series,
		LinkPreset.Zuji,
		LinkPreset.Zsk,
		LinkPreset.About,
		// {
		// 	name: "GitHub",
		// 	url: "https://github.com/saicaca/fuwari", // 内部链接不应包括基础路径，系统会自动添加
		// 	external: true, // 显示外部链接图标，且会在新标签页中打开
		// },
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.png", // 头像路径，相对于 /src 目录，如果路径以 / 开头则相对于 /public 目录
	name: "Ke.ke",
	bio: "凡是过往，皆为序章.", // 个人简介
	links: [
		// 微信
		{
			name: "WeChat",
			icon: "fa6-brands:weixin",
			url: "https://keke0420-1330580499.cos.ap-shanghai.myqcloud.com/img/weixinhaoyou.JPG?imagevanblog",
		},
		// QQ
		{
			name: "QQ",
			icon: "fa6-brands:qq",
			url: "https://qm.qq.com/q/smIYQggkWA",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Keke0522",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true, // 是否启用许可证
	name: "CC BY-NC-SA 4.0", // 许可证名称
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/", // 许可证的 URL 链接
};
export const commentConfig: CommentConfig = {
	twikoo: {
		envId: 'https://keke0420.online:6776',
	},
}
