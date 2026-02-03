<template>
	<div class="theme-switcher">
		<!-- TODO: 實作主題切換功能 -->
		<VaSelect
			v-model="currentTheme"
			:options="themeOptions"
			placeholder="選擇主題"
			@update:model-value="handleThemeChange"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentTheme = ref('light')

const themeOptions = [
	{ text: '亮色主題', value: 'light' },
	{ text: '深色主題', value: 'dark' },
	{ text: '自動', value: 'auto' },
]

const handleThemeChange = (newTheme: string) => {
	// TODO: 實作主題切換邏輯
	console.log('Changing theme to:', newTheme)
	currentTheme.value = newTheme
}
</script>

<style scoped>
.theme-switcher {
	width: 200px;
}
</style>