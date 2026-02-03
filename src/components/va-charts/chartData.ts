import { ChartDataset } from 'chart.js'
import { TChartData } from '@/components/va-charts/types'

export const chartData = (data: { datasets: ChartDataset[]; labels?: any[] }): TChartData => {
	return {
		labels: data?.labels ?? [],
		datasets: data.datasets,
	} as TChartData
}
