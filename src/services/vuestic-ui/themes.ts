// 🎨 TSC 系統主題配置 - 科技簡約風格
// 根據 CLAUDE.md 色彩規範，統一使用 $tsc- 色彩系統
// Logo 檔案位置：src/assets/tsc_logo.png
// 設計風格：Tech Minimalist (Flat Design)
// Light Mode: 淺色背景 + 白色 Navbar
// Dark Mode: 深色背景 + 深色 Navbar

export default {
	presets: {
		light: {
			// === Light Mode - 主要背景色 ===
			backgroundPrimary: '#FFFFFF',
			backgroundSecondary: '#F8FAFC', // 極淺科技灰
			backgroundCardPrimary: '#FFFFFF',
			backgroundCardSecondary: '#F1F5F9',
			backgroundTsc: '#F8FAFC', // 科技淺灰背景
			backgroundSidebar: '#FFFFFF', // Light: 白色側邊欄
			backgroundNavbar: '#FFFFFF', // Light: 白色導航欄

			// === TSC 品牌主色系 (科技青藍) ===
			tsc: '#0EA5E9', // 科技藍 - 主要品牌色
			tscDark: '#0284C7', // 深科技藍 - hover/active
			tscMedium: '#38BDF8', // 淺科技藍 - 次要元素
			primary: '#0EA5E9', // Vuestic primary

			// === TSC Logo 延伸色系 ===
			tscDeepBlue: '#1E293B', // 深灰藍 - 深色元素
			tscSkyBlue: '#0EA5E9', // Light: 與 primary 一致
			tscPurple: '#8B5CF6', // 現代紫 - 特殊強調
			tscMagenta: '#EC4899', // 粉紅 - 警示強調
			tscPurpleText: '#7C3AED', // 紫色文字

			// === Light Mode - 輔助色系 ===
			tscGrey: '#E2E8F0', // 邊框灰
			tscGreyLight: '#F8FAFC', // 極淺灰
			tscGreyNeutral: '#64748B', // 中性灰 (說明文字)
			tscBlack: '#0F172A', // 深色文字 (非純黑)

			// === 文字色彩 ===
			textPrimary: '#0F172A', // 主要文字
			textSecondary: '#475569', // 次要文字 (提高對比度)
			textMuted: '#64748B', // 淡化文字 (提高對比度)
			textInverse: '#FFFFFF', // 反色文字 (深色背景用)

			// === 機台狀態色彩 (科技風) ===
			machineRunning: '#22C55E', // 運行中 - 科技綠
			machineIdle: '#94A3B8', // 待機 - 淺灰
			machineWarning: '#F59E0B', // 警告 - 琥珀色
			machineError: '#EF4444', // 異常 - 紅色

			// === 系統狀態色 ===
			success: '#22C55E',
			info: '#0EA5E9',
			danger: '#EF4444',
			warning: '#F59E0B',

			// === Light Mode 特殊變數 ===
			borderColor: '#E2E8F0',
			shadowColor: 'rgba(15, 23, 42, 0.08)',
			hoverBg: '#F1F5F9',
			activeBg: '#E0F2FE',

			// === Sidebar 專用變數 (Light Mode) ===
			sidebarBg: '#FFFFFF',
			sidebarBorder: '#E2E8F0',
			sidebarText: '#475569',
			sidebarTextActive: '#0EA5E9',
			sidebarItemHover: '#F1F5F9',
			sidebarItemActive: 'rgba(14, 165, 233, 0.1)',

			// === Navbar 專用變數 (Light Mode) ===
			navbarBg: '#FFFFFF',
			navbarBorder: '#E2E8F0',
			navbarText: '#0F172A',
			navbarTextSecondary: '#475569',
		},
		dark: {
			// === Dark Mode - 主要背景色 ===
			backgroundPrimary: '#0F172A', // 深藍黑
			backgroundSecondary: '#1E293B', // 次深色
			backgroundCardPrimary: '#1E293B',
			backgroundCardSecondary: '#334155',
			backgroundTsc: '#0F172A',
			backgroundSidebar: '#0F172A', // Dark: 最深側邊欄
			backgroundNavbar: '#1E293B', // Dark: 深色導航欄

			// === 品牌色彩 (暗色適配) ===
			tsc: '#38BDF8', // 亮科技藍 (Dark 需提高亮度)
			tscDark: '#0EA5E9',
			tscMedium: '#7DD3FC',
			primary: '#38BDF8',

			// === Logo 延伸色系 (暗色) ===
			tscDeepBlue: '#0F172A',
			tscSkyBlue: '#38BDF8', // Dark: 高亮藍
			tscPurple: '#A78BFA',
			tscMagenta: '#F472B6',
			tscPurpleText: '#C4B5FD',

			// === Dark Mode - 輔助色系 ===
			tscGrey: '#334155',
			tscGreyLight: '#1E293B',
			tscGreyNeutral: '#94A3B8',
			tscBlack: '#F8FAFC', // 暗色模式文字為淺色

			// === 文字色彩 (暗色) ===
			textPrimary: '#F8FAFC',
			textSecondary: '#CBD5E1',
			textMuted: '#94A3B8',
			textInverse: '#0F172A',

			// === 機台狀態色彩 (暗色適配) ===
			machineRunning: '#4ADE80',
			machineIdle: '#64748B',
			machineWarning: '#FBBF24',
			machineError: '#F87171',

			// === 系統狀態色 (暗色) ===
			success: '#4ADE80',
			info: '#38BDF8',
			danger: '#F87171',
			warning: '#FBBF24',

			// === Dark Mode 特殊變數 ===
			borderColor: '#334155',
			shadowColor: 'rgba(0, 0, 0, 0.3)',
			hoverBg: '#334155',
			activeBg: '#0C4A6E',

			// === Sidebar 專用變數 (Dark Mode) ===
			sidebarBg: '#0F172A',
			sidebarBorder: 'rgba(255, 255, 255, 0.08)',
			sidebarText: '#94A3B8',
			sidebarTextActive: '#38BDF8',
			sidebarItemHover: 'rgba(255, 255, 255, 0.05)',
			sidebarItemActive: 'rgba(56, 189, 248, 0.15)',

			// === Navbar 專用變數 (Dark Mode) ===
			navbarBg: '#1E293B',
			navbarBorder: '#334155',
			navbarText: '#F8FAFC',
			navbarTextSecondary: '#94A3B8',
		},
	},
}
