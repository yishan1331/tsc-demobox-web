<template>
	<VaSidebar
		v-model="writableVisible"
		:width="sidebarWidth"
		:color="color"
		:minimized="$props.minimized"
		minimized-width="0"
	>
		<VaSidebarItem hoverColor="#fff" :to="{ name: 'home' }">
			<VaSidebarItemContent class="py-3 pr-2 pl-4">
				<VaIcon
					aria-hidden="true"
					size="20px"
					:component="VaIconComponent"
					:icon="'person'"
				/>
				<!-- <span class="mr-2"><b>登入者</b></span> -->
				<VaSidebarItemTitle
					class="flex justify-between items-center leading-5 font-semibold"
				>
					{{ userData ? `${userData.fullName}(${userData.username})` : '' }}
				</VaSidebarItemTitle>
			</VaSidebarItemContent>
			<VaSidebarItemContent class="py-3 pr-2 pl-4">
				<VaIcon
					aria-hidden="true"
					size="20px"
					:component="VaIconComponent"
					:icon="'schedule'"
				/>
				<!-- <span class="mr-2"><b>登入時間</b></span> -->
				<VaSidebarItemTitle
					class="flex justify-between items-center leading-5 font-semibold"
				>
					{{ userData ? userData.loginTime : '' }}
				</VaSidebarItemTitle>
			</VaSidebarItemContent>
		</VaSidebarItem>
		<VaDivider inset />
		<VaAccordion v-model="routingMenuStatus" multiple>
			<AppSidebarItems
				v-for="(route, index) in navigationVerifiedRoutes"
				:key="index"
				:navigationRoute="route"
				:mobile="isMobile"
			/>
		</VaAccordion>
		<VaSpacer />
		<VaSidebarItem>
			<VaSidebarItemContent class="text-tsc-grey-neutral">
				<b>Ver {{ VERSION }}</b>
			</VaSidebarItemContent>
		</VaSidebarItem>
	</VaSidebar>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useColors } from 'vuestic-ui'
import { cloneDeep } from 'lodash-es'

import VaIconComponent from '@/components/icons/VaIconComponent.vue'
import AppSidebarItems from './AppSidebarItems.vue'
import { useUserAuthStore } from '@/stores/userAuth.store'
import { findVerifiedRoute } from '@/router/childRouter'
import { VERSION } from '@/constants'
import { NavigationRoutes, routeHasActiveChild, type INavigationRoute } from './NavigationRoutes'

export default defineComponent({
	name: 'Sidebar',
	props: {
		visible: { type: Boolean, default: true },
		minimized: { type: Boolean, default: false },
		mobile: { type: Boolean, default: false },
		tablet: { type: Boolean, default: false },
		userData: { type: Object, required: true },
	},
	emits: ['update:visible'],
	components: {
		AppSidebarItems, // 在這裡註冊組件
	},

	setup: (props, { emit }) => {
		const { getColor } = useColors()
		const nowRoute = useRoute()

		const routingMenuStatus = ref<boolean[]>([])

		const { pageAccess } = storeToRefs(useUserAuthStore())

		const writableVisible = computed({
			get: () => props.visible,
			set: (v: boolean) => emit('update:visible', v),
		})

		const setActiveExpand = () => {
			// console.log(nowRoute.fullPath)
			routingMenuStatus.value = navigationVerifiedRoutes.value.map(
				(route: INavigationRoute) => routeHasActiveChild(nowRoute, route)
			)
			// console.log(routingMenuStatus.value)
		}

		const isMobile = computed(() => props.mobile)
		const sidebarWidth = computed(() => (props.mobile ? '100vw' : '280px'))
		const color = computed(() => getColor('background-secondary'))

		const navigationVerifiedRoutes = computed((): INavigationRoute[] => {
			const verifiedRoute = findVerifiedRoute(
				pageAccess.value,
				cloneDeep(NavigationRoutes.routes)
			) as INavigationRoute[]
			console.log(verifiedRoute)
			return verifiedRoute
		})

		watch(() => nowRoute.fullPath, setActiveExpand, { immediate: true })

		onMounted(() => {})

		return {
			VERSION,
			writableVisible,
			sidebarWidth,
			routingMenuStatus,
			color,
			navigationVerifiedRoutes,
			isMobile,
			VaIconComponent,
			AppSidebarItems,
		}
	},
})
</script>
