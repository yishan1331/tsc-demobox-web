<template>
	<Bar :data="data" :options="options" />
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	LinearScale,
	CategoryScale,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, CategoryScale, ChartDataLabels)

defineProps<{
	data: any
	options?: ChartOptions<'bar'>
}>()
</script>
