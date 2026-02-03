<template>
	<div class="home-page flex flex-col justify-between h-screen items-center">
		<div class="flex flex-col items-center gap-6 px-4 my-8">
			<h3 class="welcome-text text-center text-base">{{ t('home.welcomeMessage') }}</h3>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

import { useGlobalStore } from '@/stores/global.store'

const { t } = useI18n()

const GlobalStore = useGlobalStore()

onMounted(() => {
	console.log('Home mounted')
	GlobalStore.toggleSidebar(false)
})
</script>

<style scoped lang="scss">
// === Home Page - 使用 CSS 變數支援 Light/Dark Mode ===
.welcome-text {
	color: var(--va-text-primary);
}
</style>
