/**
 * useDashboardLayout - 儀表板區塊佈局管理
 *
 * 職責：
 * - 管理區塊順序、可見性和寬度
 * - 拖放排序邏輯
 * - 用戶偏好持久化 (localStorage)
 */

import { ref, computed, watch } from 'vue'
import type { SensorType } from '@/services/SensorService'

/** 區塊類型定義 */
export type BlockType =
	| 'machine-info'
	| 'worktime'
	| 'count'
	| 'heat-treatment'
	| 'threading-rate'
	| 'sensor-lights'

/** 欄位寬度 (1-4) */
export type ColSpan = 1 | 2 | 3 | 4

/** 區塊配置 */
export interface DashboardBlock {
	id: BlockType
	label: string
	visible: boolean
	/** 欄位寬度 (1-4 欄) */
	colSpan: ColSpan
	/** 適用的感測器類型，空陣列表示全部適用 */
	applicableTo: SensorType[]
	/** 預設欄寬 */
	defaultColSpan: ColSpan
}

/** localStorage key */
const STORAGE_KEY = 'demobox-dashboard-layout'

/** 預設區塊配置 */
const getDefaultBlocks = (): DashboardBlock[] => [
	{
		id: 'machine-info',
		label: '機台資訊',
		visible: true,
		colSpan: 4,
		defaultColSpan: 4,
		applicableTo: [],
	},
	{
		id: 'worktime',
		label: '工時狀態',
		visible: true,
		colSpan: 4,
		defaultColSpan: 4,
		applicableTo: [],
	},
	{
		id: 'count',
		label: '支數',
		visible: true,
		colSpan: 2,
		defaultColSpan: 2,
		applicableTo: ['heading', 'threading'],
	},
	{
		id: 'sensor-lights',
		label: '感測燈號',
		visible: true,
		colSpan: 2,
		defaultColSpan: 2,
		applicableTo: [],
	},
	{
		id: 'heat-treatment',
		label: '溫度數據',
		visible: true,
		colSpan: 4,
		defaultColSpan: 4,
		applicableTo: ['heat_treatment'],
	},
	{
		id: 'threading-rate',
		label: '速率數據',
		visible: true,
		colSpan: 2,
		defaultColSpan: 2,
		applicableTo: ['threading'],
	},
]

export const useDashboardLayout = () => {
	// ===== 狀態 =====
	const blocks = ref<DashboardBlock[]>(getDefaultBlocks())
	const isEditMode = ref(false)

	// ===== 初始化 =====
	const loadFromStorage = () => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				const parsed = JSON.parse(stored) as DashboardBlock[]
				// 合併儲存的設定與預設設定（處理新增的區塊）
				const defaultBlocks = getDefaultBlocks()
				const mergedBlocks = defaultBlocks.map((defaultBlock) => {
					const storedBlock = parsed.find((b) => b.id === defaultBlock.id)
					if (storedBlock) {
						return {
							...defaultBlock,
							visible: storedBlock.visible,
							colSpan: storedBlock.colSpan || defaultBlock.defaultColSpan,
						}
					}
					return defaultBlock
				})

				// 保持儲存的順序
				const orderedBlocks: DashboardBlock[] = []
				parsed.forEach((storedBlock) => {
					const block = mergedBlocks.find((b) => b.id === storedBlock.id)
					if (block) {
						orderedBlocks.push(block)
					}
				})
				// 加入新增的區塊
				mergedBlocks.forEach((block) => {
					if (!orderedBlocks.find((b) => b.id === block.id)) {
						orderedBlocks.push(block)
					}
				})

				blocks.value = orderedBlocks
			}
		} catch (e) {
			console.warn('Failed to load dashboard layout from storage:', e)
		}
	}

	const saveToStorage = () => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks.value))
		} catch (e) {
			console.warn('Failed to save dashboard layout to storage:', e)
		}
	}

	// 初始載入
	loadFromStorage()

	// 監聽變化並自動保存
	watch(
		blocks,
		() => {
			saveToStorage()
		},
		{ deep: true }
	)

	// ===== 計算屬性 =====

	/**
	 * 根據感測器類型過濾可見的區塊
	 */
	const getVisibleBlocks = (sensorType: SensorType | null) => {
		return computed(() => {
			if (!sensorType) return []
			return blocks.value.filter((block) => {
				// 檢查是否適用於當前感測器類型
				const isApplicable =
					block.applicableTo.length === 0 || block.applicableTo.includes(sensorType)
				return block.visible && isApplicable
			})
		})
	}

	/**
	 * 根據感測器類型取得所有適用的區塊（含隱藏的）
	 */
	const getApplicableBlocks = (sensorType: SensorType | null) => {
		return computed(() => {
			if (!sensorType) return []
			return blocks.value.filter((block) => {
				return block.applicableTo.length === 0 || block.applicableTo.includes(sensorType)
			})
		})
	}

	// ===== 方法 =====

	/**
	 * 切換編輯模式
	 */
	const toggleEditMode = () => {
		isEditMode.value = !isEditMode.value
	}

	/**
	 * 切換區塊可見性
	 */
	const toggleBlockVisibility = (blockId: BlockType) => {
		const block = blocks.value.find((b) => b.id === blockId)
		if (block) {
			block.visible = !block.visible
		}
	}

	/**
	 * 設定區塊欄寬
	 */
	const setBlockColSpan = (blockId: BlockType, colSpan: ColSpan) => {
		const block = blocks.value.find((b) => b.id === blockId)
		if (block) {
			block.colSpan = colSpan
		}
	}

	/**
	 * 更新區塊順序（拖放後呼叫）
	 */
	const updateBlockOrder = (newBlocks: DashboardBlock[]) => {
		blocks.value = newBlocks
	}

	/**
	 * 重置為預設佈局
	 */
	const resetToDefault = () => {
		blocks.value = getDefaultBlocks()
		saveToStorage()
	}

	/**
	 * 移動區塊
	 */
	const moveBlock = (fromIndex: number, toIndex: number) => {
		const item = blocks.value.splice(fromIndex, 1)[0]
		blocks.value.splice(toIndex, 0, item)
	}

	return {
		// 狀態
		blocks,
		isEditMode,

		// 計算屬性
		getVisibleBlocks,
		getApplicableBlocks,

		// 方法
		toggleEditMode,
		toggleBlockVisibility,
		setBlockColSpan,
		updateBlockOrder,
		resetToDefault,
		moveBlock,
	}
}
