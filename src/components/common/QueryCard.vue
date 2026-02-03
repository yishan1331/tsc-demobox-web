<template>
	<VaCard class="query-card">
		<!-- 可摺疊標題 -->
		<button v-if="collapsible" class="collapsible-header" @click="toggleCollapse">
			<span class="header-title">
				<VaIcon v-if="icon" :name="icon" class="header-icon" />
				{{ title || t('filter.queryModule') }}
			</span>
			<VaIcon
				:name="isCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
				size="20px"
				class="collapse-icon"
			/>
		</button>

		<!-- 非摺疊標題 -->
		<div v-else-if="title" class="static-header">
			<VaIcon v-if="icon" :name="icon" class="header-icon" />
			{{ title }}
		</div>

		<!-- 內容區域 -->
		<VaCardContent
			class="query-content"
			:class="{ collapsed: collapsible && isCollapsed }"
			:style="collapsible ? { height: isCollapsed ? '0px' : 'auto', opacity: isCollapsed ? 0 : 1 } : {}"
		>
			<div class="query-form">
				<!-- 表單內容插槽 -->
				<slot />

				<!-- 操作按鈕區域 -->
				<div v-if="$slots.actions" class="form-actions">
					<slot name="actions" />
				</div>
			</div>
		</VaCardContent>
	</VaCard>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
	/** 卡片標題 */
	title?: string
	/** 標題圖標 */
	icon?: string
	/** 是否可摺疊 */
	collapsible?: boolean
	/** 初始是否摺疊 */
	initialCollapsed?: boolean
}>()

const { t } = useI18n()

const collapsible = toRef(props, 'collapsible')
const isCollapsed = ref(props.initialCollapsed ?? false)

const toggleCollapse = () => {
	isCollapsed.value = !isCollapsed.value
}

// 暴露控制方法給父組件
defineExpose({
	isCollapsed,
	toggleCollapse,
	expand: () => (isCollapsed.value = false),
	collapse: () => (isCollapsed.value = true),
})
</script>

<style lang="scss" scoped>
@use '@/scss/variables' as *;

.query-card {
	margin-bottom: 1.5rem;
}

// 可摺疊標題
.collapsible-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 0.75rem 1rem;
	background: $tsc-gradient-header;
	border: none;
	border-bottom: 1px solid $border-color-light;
	cursor: pointer;
	transition: background 0.2s ease;

	&:hover {
		background: linear-gradient(135deg, #f0f7fa 0%, #e8f4f8 100%);
	}

	&:focus-visible {
		outline: 2px solid $tsc-blue;
		outline-offset: -2px;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: $tsc-black;
	}

	.header-icon {
		color: $tsc-blue;
	}

	.collapse-icon {
		color: $tsc-grey-neutral;
		transition: transform 0.2s ease;
	}
}

// 靜態標題
.static-header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: $tsc-black;
	background: $tsc-gradient-header;
	border-bottom: 1px solid $border-color-light;

	.header-icon {
		color: $tsc-blue;
	}
}

// 內容區域
.query-content {
	overflow: hidden;
	transition:
		height 0.3s ease,
		opacity 0.3s ease;

	&.collapsed {
		padding: 0;
	}
}

// 表單佈局
.query-form {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	align-items: end;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
}

// 操作按鈕區域
.form-actions {
	display: flex;
	gap: 0.75rem;
	align-items: center;

	@media (max-width: 768px) {
		flex-direction: column;
		width: 100%;

		:deep(.va-button) {
			width: 100%;
		}
	}
}
</style>

<style lang="scss">
// ===== 暗色模式 =====
body.dark-mode .query-card,
body.va-dark .query-card,
.va-dark .query-card {
	.collapsible-header {
		background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
		border-bottom-color: #475569;

		&:hover {
			background: linear-gradient(135deg, #334155 0%, #475569 100%);
		}

		.header-title {
			color: #f8fafc;
		}

		.header-icon {
			color: #38bdf8;
		}

		.collapse-icon {
			color: #94a3b8;
		}
	}

	.static-header {
		background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
		border-bottom-color: #475569;
		color: #f8fafc;

		.header-icon {
			color: #38bdf8;
		}
	}
}
</style>
