<template>
	<div class="flex gap-2">
		<VaIconMenuCollapsed
			class="cursor-pointer"
			:class="{ 'x-flip': !isSidebarMinimized }"
			:color="collapseIconColor"
			@click="GlobalStore.toggleSidebar()"
		/>

		<nav class="flex items-center">
			<VaBreadcrumbs>
				<VaBreadcrumbsItem
					v-if="router.currentRoute.value.path != '/home'"
					:label="t('navigation.home')"
					:to="{ name: 'home' }"
				/>
				<VaBreadcrumbsItem
					v-for="item in items"
					:key="item.label"
					:label="item.label"
					@click="handleBreadcrumbClick(item)"
				/>
			</VaBreadcrumbs>
		</nav>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { useColors } from 'vuestic-ui'

import { useUserAuthStore } from '@/stores/userAuth.store'
import { NavigationRoutes, type INavigationRoute } from '@/components/sidebar/NavigationRoutes'
import { type PageAccess } from '@/types'
import VaIconMenuCollapsed from '@/components/icons/VaIconMenuCollapsed.vue'
import { useGlobalStore } from '@/stores/global.store'

const { pageAccess } = storeToRefs(useUserAuthStore())

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { getColor } = useColors()

const GlobalStore = useGlobalStore()
const { isSidebarMinimized } = storeToRefs(GlobalStore)

const collapseIconColor = computed(() => getColor('secondary'))

type BreadcrumbNavigationItem = {
	label: string
	to: string
	hasChildren: boolean
}

const findRouteName = (name: string) => {
	const _pageAccess = pageAccess.value as PageAccess
	const traverse = (routers: INavigationRoute[], pageAccess: any): string => {
		for (const router of routers) {
			const _routerName = router.name as keyof PageAccess
			if (pageAccess[_routerName]) {
				if (router.name === name) {
					return router.displayName
				}
				if (router.children) {
					const result = traverse(router.children, pageAccess[_routerName].children)
					if (result) {
						return result
					}
				}
			}
		}
		return ''
	}
	return traverse(cloneDeep(NavigationRoutes.routes), _pageAccess)
}

const items = computed(() => {
	const result: { label: string; to: string; hasChildren: boolean }[] = []
	route.matched.forEach((route) => {
		const labelKey = findRouteName(route.name as string)
		if (!labelKey) {
			return
		}
		result.push({
			label: t(labelKey),
			to: route.path,
			hasChildren: route.children && route.children.length > 0,
		})
	})
	return result
})

const handleBreadcrumbClick = (item: BreadcrumbNavigationItem) => {
	if (!item.hasChildren) {
		router.push(item.to)
	}
}
</script>

<style lang="scss" scoped>
.x-flip {
	transform: scaleX(-100%);
}
</style>
