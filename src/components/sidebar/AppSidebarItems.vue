<template>
	<VaCollapse :value="isExpanded" @toggle="toggle">
		<template #header="{ value: isCollapsed }">
			<VaSidebarItem
				:to="navigationRoute.children ? undefined : { name: navigationRoute.name }"
				:active="routeHasActiveChild(nowRoute, navigationRoute)"
				:active-color="activeColor"
				:text-color="textColor(navigationRoute)"
				:aria-label="`${navigationRoute.children ? 'Open category ' : 'Visit'} ${t(navigationRoute.displayName)}`"
				role="button"
				hover-opacity="0.10"
			>
				<VaSidebarItemContent class="py-3 pr-2 pl-4 item-content">
					<VaIcon
						v-if="'meta' in navigationRoute && navigationRoute.meta.icon"
						aria-hidden="true"
						size="20px"
						:color="iconColor(navigationRoute)"
						:component="VaIconComponent"
						:icon="navigationRoute.meta.icon"
					/>
					<VaSidebarItemTitle
						class="flex justify-between items-center leading-5 font-semibold"
					>
						{{ t(navigationRoute.displayName) }}
						<VaIcon
							v-if="navigationRoute.children"
							:name="arrowDirection(isCollapsed)"
							size="20px"
						/>
					</VaSidebarItemTitle>
				</VaSidebarItemContent>
			</VaSidebarItem>
		</template>
		<template #body>
			<VaAccordion v-if="navigationRoute.children" v-model="itemsRoutingMenuStatus" multiple>
				<AppSidebarItems
					v-for="(childRoute, index) in navigationRoute.children"
					:key="index"
					:navigationRoute="childRoute"
					class="pl-11 is-children"
				/>
			</VaAccordion>
		</template>
	</VaCollapse>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useColors } from 'vuestic-ui'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import VaIconComponent from '@/components/icons/VaIconComponent.vue'

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

		const { getColor, colorToRgba } = useColors()

		const isExpanded = ref(false)
		const nowRoute = useRoute()

		const itemsRoutingMenuStatus = ref<boolean[]>([])

		const toggle = () => {
			isExpanded.value = !isExpanded.value
		}

		const arrowDirection = (state: boolean) => (state ? 'va-arrow-up' : 'va-arrow-down')
		const iconColor = (route: any) =>
			routeHasActiveChild(nowRoute, route) ? 'primary' : 'secondary'

		const textColor = (route: any) =>
			routeHasActiveChild(nowRoute, route) ? 'tscBlack' : 'textPrimary'

		const activeColor = computed(() => colorToRgba(getColor('tsc'), 0.1))

		const setActiveExpand = () => {
			if ('children' in props.navigationRoute && props.navigationRoute.children) {
				itemsRoutingMenuStatus.value = props.navigationRoute.children.map(
					(route: INavigationRoute) => routeHasActiveChild(nowRoute, route)
				)
			}
		}

		watch(() => nowRoute.fullPath, setActiveExpand, { immediate: true })
		// watch(() => itemsRoutingMenuStatus.value, sidebarAction, {
		// 	immediate: true,
		// 	deep: true,
		// })

		return {
			t,
			itemsRoutingMenuStatus,
			isExpanded,
			toggle,
			arrowDirection,
			nowRoute,
			routeHasActiveChild,
			activeColor,
			iconColor,
			textColor,
			VaIconComponent,
		}
	},
})
</script>
