<template>
	<div class="auto-refresh-control mb-2">
		<div class="flex items-center xs:justify-start justify-between">
			<VaButton
				preset="secondary"
				:icon="isActive ? 'close' : 'sync'"
				:color="isActive ? 'danger' : 'tsc'"
				:disabled="disabled"
				@click="handleToggle"
			/>
			<div v-if="lastUpdateTime" class="text-sm text-secondary">
				{{ t('common.lastUpdate') }}: {{ lastUpdateTime }}
			</div>
			<VaProgressCircle
				v-if="isActive"
				size="1rem"
				indeterminate
				color="tscGreyNeutral"
				class="ml-1"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
	isActive: boolean
	lastUpdateTime?: string
	disabled?: boolean
}

interface Emits {
	(e: 'toggle'): void
}

const props = withDefaults(defineProps<Props>(), {
	isActive: false,
	lastUpdateTime: '',
	disabled: false,
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

const handleToggle = () => {
	if (!props.disabled) {
		emit('toggle')
	}
}
</script>

<style scoped lang="scss">
.auto-refresh-control {
	.text-secondary {
		color: var(--va-secondary);
	}
}
</style>
