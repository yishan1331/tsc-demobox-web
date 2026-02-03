<template>
	<VaCollapse :value="isExpanded" @toggle="toggle">
		<template #header="{ value: isCollapsed }">
			<div
				class="sidebar-item"
				:class="{
					'sidebar-item--active': isActive,
					'sidebar-item--has-children': navigationRoute.children,
				}"
				@click="handleClick"
			>
				<!-- 圖標 -->
				<div class="sidebar-item__icon">
					<VaIcon
						v-if="'meta' in navigationRoute && navigationRoute.meta.icon"
						:name="navigationRoute.meta.icon"
						size="20px"
						:color="isActive ? 'tscSkyBlue' : 'textMuted'"
					/>
				</div>

				<!-- 標題 -->
				<span class="sidebar-item__title">
					{{ t(navigationRoute.displayName) }}
				</span>

				<!-- 展開箭頭 -->
				<VaIcon
					v-if="navigationRoute.children"
					:name="isCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
					size="18px"
					class="sidebar-item__arrow"
					color="textMuted"
				/>
			</div>
		</template>

		<template #body>
			<div v-if="navigationRoute.children" class="sidebar-item__children">
				<VaAccordion v-model="itemsRoutingMenuStatus" multiple>
					<AppSidebarItems
						v-for="(childRoute, index) in navigationRoute.children"
						:key="index"
						:navigationRoute="childRoute"
						class="sidebar-item--child"
					/>
				</VaAccordion>
			</div>
		</template>
	</VaCollapse>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { routeHasActiveChild, type INavigationRoute } from './NavigationRoutes'

export default defineComponent({
	name: 'AppSidebarItems',
	props: {
		navigationRoute: { type: Object as () => INavigationRoute, required: true },
		mobile: { type: Boolean, default: false },
	},
	emits: ['update:visible'],
	setup(props) {
		const { t } = useI18n()
		const router = useRouter()

		const isExpanded = ref(false)
		const nowRoute = useRoute()

		const itemsRoutingMenuStatus = ref<boolean[]>([])

		const isActive = computed(() => routeHasActiveChild(nowRoute, props.navigationRoute))

		const toggle = () => {
			if (props.navigationRoute.children) {
				isExpanded.value = !isExpanded.value
			}
		}

		const handleClick = () => {
			if (!props.navigationRoute.children && props.navigationRoute.name) {
				router.push({ name: props.navigationRoute.name })
			} else {
				toggle()
			}
		}

		const setActiveExpand = () => {
			if ('children' in props.navigationRoute && props.navigationRoute.children) {
				itemsRoutingMenuStatus.value = props.navigationRoute.children.map(
					(route: INavigationRoute) => routeHasActiveChild(nowRoute, route)
				)
			}
		}

		watch(() => nowRoute.fullPath, setActiveExpand, { immediate: true })

		return {
			t,
			itemsRoutingMenuStatus,
			isExpanded,
			isActive,
			toggle,
			handleClick,
			nowRoute,
			routeHasActiveChild,
		}
	},
})
</script>

<style lang="scss" scoped>
// === Sidebar Items - Light Mode 預設樣式 ===
.sidebar-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	margin: 0.125rem 0.5rem;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.15s ease;
	color: #475569;

	&:hover {
		background: #f1f5f9;
		color: #0f172a;
	}

	// === 活躍狀態 ===
	&--active {
		background: rgba(14, 165, 233, 0.1);
		color: #0ea5e9;

		.sidebar-item__icon {
			color: #0ea5e9;
		}

		&:hover {
			background: rgba(14, 165, 233, 0.15);
		}
	}

	// === 圖標 ===
	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}

	// === 標題 ===
	&__title {
		flex: 1;
		font-size: 0.875rem;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// === 箭頭 ===
	&__arrow {
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	// === 子項目容器 ===
	&__children {
		margin-left: 0.5rem;
		padding-left: 1rem;
		border-left: 1px solid #e2e8f0;
	}

	// === 子項目樣式 ===
	&--child {
		.sidebar-item {
			padding: 0.625rem 1rem;
			margin: 0.125rem 0.25rem;

			&__icon {
				width: 20px;
				height: 20px;
			}

			&__title {
				font-size: 0.8125rem;
			}
		}
	}
}

// === 覆蓋 Vuestic Collapse 預設樣式 ===
:deep(.va-collapse) {
	background: transparent !important;
}

:deep(.va-collapse__header) {
	padding: 0 !important;
	background: transparent !important;
}

:deep(.va-collapse__body) {
	padding: 0 !important;
	background: transparent !important;
}

:deep(.va-collapse__body-wrapper) {
	background: transparent !important;
}

// === 覆蓋 Vuestic Accordion 預設樣式 ===
:deep(.va-accordion) {
	background: transparent !important;
}
</style>

<style lang="scss">
// === Sidebar Items - Dark Mode 樣式 (非 scoped) ===
body.dark-mode,
body.va-dark {
	.sidebar-item {
		color: #94a3b8 !important;

		&:hover {
			background: rgba(255, 255, 255, 0.05) !important;
			color: #f8fafc !important;
		}

		&--active {
			background: rgba(56, 189, 248, 0.15) !important;
			color: #38bdf8 !important;

			.sidebar-item__icon {
				color: #38bdf8 !important;
			}

			&:hover {
				background: rgba(56, 189, 248, 0.2) !important;
			}
		}

		&__children {
			border-left-color: rgba(255, 255, 255, 0.08) !important;
		}
	}
}
</style>
