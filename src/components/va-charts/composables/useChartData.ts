import { computed, ComputedRef } from 'vue'
import { useChartColors } from './useChartColors'
import { TChartData } from '@/components/va-charts/types'

export function useChartData<T extends TChartData>(dataProp: T, alfa?: number): ComputedRef<T> {
	// 包装输入数据为响应式
	const data = computed(() => dataProp)

	// 只在真正需要時才計算
	const datasetsColors = computed(() =>
		data.value.datasets.map((dataset) => dataset.backgroundColor as string)
	)

	const datasetsThemesColors = computed(() =>
		datasetsColors.value.map(
			(colors) =>
				useChartColors(colors, alfa)[alfa ? 'generatedHSLAColors' : 'generatedColors']
		)
	)

	return computed(() => {
		const datasets = data.value.datasets.map((dataset, idx) => ({
			...dataset,
			backgroundColor: datasetsThemesColors.value[idx].value,
		}))

		return { ...data.value, datasets } as T
	})
}
