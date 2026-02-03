<template>
	<div class="form-group">
		<label v-if="label" class="form-label">{{ label }}</label>
		<slot />
	</div>
</template>

<script setup lang="ts">
defineProps<{
	/** 欄位標籤 */
	label?: string
}>()
</script>

<style lang="scss" scoped>
// === FormGroup - 使用 CSS 變數支援 Light/Dark Mode ===
.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-label {
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--va-text-secondary);
}
</style>
