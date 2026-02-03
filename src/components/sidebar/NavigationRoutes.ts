export interface INavigationRoute {
	name: string
	displayName: string
	meta: { icon: string }
	path?: string
	children?: INavigationRoute[]
}

export const routeHasActiveChild = (route: any, section: INavigationRoute): boolean => {
	if (!section.children) {
		if (!('path' in section)) {
			return route.name == section.name
		}
		return route.path == section.path
	}

	return section.children.some((childRoute) => routeHasActiveChild(route, childRoute))
}

export const NavigationRoutes = {
	root: {
		name: '/',
		displayName: 'navigationRoutes.home',
	},
	routes: [
		{
			name: 'monitoring',
			displayName: 'sidebar.monitoring.title',
			meta: {
				icon: 'dvr_fill',
			},
			children: [
				{
					name: 'monitoringOverview',
					displayName: 'sidebar.monitoring.overview',
				},
				{
					name: 'monitoringMachine',
					displayName: 'sidebar.monitoring.machine',
				},
			],
		},
		{
			name: 'history',
			displayName: 'sidebar.history.title',
			meta: {
				icon: 'history',
			},
		},
		{
			name: 'settings',
			displayName: 'sidebar.settings.title',
			meta: {
				icon: 'settings',
			},
			children: [
				{
					name: 'settingsUsers',
					displayName: 'sidebar.settings.users',
				},
			],
		},
	] as INavigationRoute[],
}
