<template>
	<div class="theme-switcher">
		<VaButton
			preset="plain"
			class="theme-switcher__btn"
			:aria-label="isDark ? t('settings.buttonSelect.light') : t('settings.buttonSelect.dark')"
			@click="toggleTheme"
		>
			<VaIcon :name="isDark ? 'light_mode' : 'dark_mode'" size="20px" color="textSecondary" />
		</VaButton>
	</div>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'

const { applyPreset, currentPresetName } = useColors()
const { t } = useI18n()

const isDark = computed(() => currentPresetName.value === 'dark')

// 手動在 body 上添加/移除 dark mode class
const updateBodyClass = (dark: boolean) => {
	if (dark) {
		document.body.classList.add('va-dark', 'dark-mode')
		document.documentElement.classList.add('va-dark', 'dark-mode')
	} else {
		document.body.classList.remove('va-dark', 'dark-mode')
		document.documentElement.classList.remove('va-dark', 'dark-mode')
	}
}

// 監聽主題變化
watch(isDark, (newVal) => {
	updateBodyClass(newVal)
}, { immediate: true })

// 初始化時設定
onMounted(() => {
	updateBodyClass(isDark.value)
})

const toggleTheme = () => {
	applyPreset(isDark.value ? 'light' : 'dark')
}
</script>

<style lang="scss" scoped>
// === ThemeSwitcher - Light Mode 預設樣式 ===
.theme-switcher {
	&__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 8px;
		transition: all 0.15s ease;

		&:hover {
			background-color: #f1f5f9;
		}
	}
}
</style>

<style lang="scss">
// === ThemeSwitcher - Dark Mode 樣式 (非 scoped) ===
body.dark-mode,
body.va-dark {
	.theme-switcher__btn:hover {
		background-color: #334155 !important;
	}
}
</style>
