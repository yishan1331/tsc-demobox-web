<template>
	<VaLayout v-if="breakpoint.lgUp" class="h-screen bg-[var(--va-background-secondary)]">
		<template #left>
			<RouterLink
				class="bg-tsc-grey h-full flex items-center justify-center"
				style="width: 35vw"
				to="/"
				aria-label="Visit homepage"
			>
				<img
					alt="logo"
					src="@/assets/tsc_logo.png"
					style="width: 100%; max-width: 200px"
				/>
			</RouterLink>
		</template>
		<template #content>
			<main class="h-full flex items-center justify-center mx-auto max-w-[420px]">
				<RouterView />
			</main>
		</template>
	</VaLayout>

	<VaLayout v-else class="h-screen bg-[var(--va-background-secondary)]">
		<template #content>
			<div class="p-4 h-full">
				<main class="h-full flex flex-row items-center justify-start mx-auto max-w-[420px]">
					<div class="flex flex-col items-center">
						<div class="mb-4">
							<img
								alt="logo"
								src="@/assets/tsc_logo.png"
								style="width: 100%; max-width: 200px"
							/>
						</div>
						<RouterView />
					</div>
				</main>
			</div>
		</template>
	</VaLayout>
</template>

<script lang="ts" setup>
import { useBreakpoint } from 'vuestic-ui'

const breakpoint = useBreakpoint()
</script>
