<template>
	<div class="language-switcher">
		<!-- TODO: 實作語言切換功能 -->
		<VaSelect
			v-model="currentLanguage"
			:options="languageOptions"
			placeholder="選擇語言"
			@update:model-value="handleLanguageChange"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLanguage = ref(locale.value)

const languageOptions = [
	{ text: '繁體中文', value: 'zh-TW' },
	{ text: 'English', value: 'en' },
]

const handleLanguageChange = (newLang: string) => {
	// TODO: 實作語言切換邏輯
	locale.value = newLang
}
</script>

<style scoped>
.language-switcher {
	width: 200px;
}
</style>