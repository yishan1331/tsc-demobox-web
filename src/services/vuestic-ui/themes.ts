// 🎨 TSC 系統主題配置
// 根據 CLAUDE.md 色彩規範，統一使用 $tsc- 色彩系統
// Logo 檔案位置：src/assets/tsc_logo.png

export default {
	presets: {
		light: {
			// 主要背景色
			backgroundPrimary: '#FFFFFF',
			backgroundSecondary: '#F4F6F8',
			backgroundCardPrimary: '#F7F9F9',
			backgroundCardSecondary: '#ECFDE6',
			backgroundTsc: '#daddde', // tsc-grey

			// TSC 品牌主色系 (呼應 Logo 青藍色調)
			tsc: '#75daee', // 主青藍色 - 主要品牌色
			tscDark: '#4ab8dc', // 深青藍色 - hover/active狀態
			tscMedium: '#5bc2e5', // 中青藍色 - 次要按鈕

			// TSC Logo 延伸色系
			tscDeepBlue: '#1a4b8c', // Logo 深藍色 - 深色強調
			tscSkyBlue: '#4fc3dc', // Logo 天藍色 - 漸層過渡
			tscPurple: '#7b2d8e', // Logo 紫色 - 特殊強調
			tscMagenta: '#e91e63', // Logo 洋紅色 - 警示強調
			tscPurpleText: '#6a1b9a', // Logo 文字紫色

			// TSC 輔助色系
			tscGrey: '#daddde', // 輔助灰色
			tscGreyLight: '#f8f9fa', // 極淺灰
			tscGreyNeutral: '#6c757d', // 中性灰
			tscBlack: '#000000', // 純黑色 - 主要文字色

			// 機台狀態色彩
			machineRunning: '#4CAF50', // 運行中 - 綠色
			machineIdle: '#9E9E9E', // 待機 - 灰色
			machineWarning: '#FF9800', // 警告 - 橙色
			machineError: '#F44336', // 異常 - 紅色

			// 系統狀態色
			success: '#4CAF50',
			info: '#4fc3dc',
			danger: '#F44336',
			warning: '#FF9800',
		},
		dark: {
			// 暗色主題配置
			backgroundCardPrimary: '#111827',
			backgroundCardSecondary: '#0f172a',
			backgroundTsc: '#1f2937',

			// TSC 暗色主題色彩
			tsc: '#75daee',
			tscDark: '#4ab8dc',
			tscMedium: '#5bc2e5',
			tscGrey: '#374151',
			tscGreyLight: '#1f2937',
			tscGreyNeutral: '#9ca3af',
		},
	},
}
