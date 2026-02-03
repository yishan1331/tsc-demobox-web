<template>
	<!-- 桌面版佈局 -->
	<VaLayout v-if="breakpoint.lgUp" class="auth-layout">
		<template #left>
			<RouterLink class="auth-layout__brand" to="/" aria-label="Visit homepage">
				<div class="auth-layout__brand-content">
					<img
						alt="TSC Logo"
						src="@/assets/tsc_logo.png"
						class="auth-layout__logo"
					/>
					<div class="auth-layout__brand-text">
						<span class="auth-layout__brand-title">DemoBox</span>
						<span class="auth-layout__brand-subtitle">Machine Monitoring System</span>
					</div>
				</div>
			</RouterLink>
		</template>
		<template #content>
			<main class="auth-layout__content">
				<RouterView />
			</main>
		</template>
	</VaLayout>

	<!-- 手機/平板佈局 -->
	<VaLayout v-else class="auth-layout auth-layout--mobile">
		<template #content>
			<div class="auth-layout__mobile-wrapper">
				<main class="auth-layout__mobile-content">
					<div class="auth-layout__mobile-brand">
						<img
							alt="TSC Logo"
							src="@/assets/tsc_logo.png"
							class="auth-layout__logo auth-layout__logo--mobile"
						/>
						<span class="auth-layout__brand-title auth-layout__brand-title--mobile">
							DemoBox
						</span>
					</div>
					<RouterView />
				</main>
			</div>
		</template>
	</VaLayout>
</template>

<script lang="ts" setup>
import { useBreakpoint } from 'vuestic-ui'

const breakpoint = useBreakpoint()
</script>

<style lang="scss" scoped>
// === AuthLayout - 使用 CSS 變數支援 Light/Dark Mode ===
.auth-layout {
	min-height: 100vh;
	background: var(--va-background-secondary, #f8fafc);

	// === 左側品牌區 (始終深色) ===
	&__brand {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40vw;
		min-width: 400px;
		height: 100%;
		background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
		text-decoration: none;
		transition: all 0.3s ease;
	}

	&__brand-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	&__logo {
		width: 100%;
		max-width: 180px;
		filter: brightness(1.1);

		&--mobile {
			max-width: 120px;
		}
	}

	&__brand-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	&__brand-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: #f8fafc;
		letter-spacing: -0.025em;

		&--mobile {
			font-size: 1.25rem;
			color: var(--va-text-primary, #0f172a);
			margin-top: 0.5rem;
		}
	}

	&__brand-subtitle {
		font-size: 0.875rem;
		color: #94a3b8;
		font-weight: 400;
	}

	// === 右側內容區 ===
	&__content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 2rem;
		max-width: 480px;
		margin: 0 auto;
	}

	// === 手機版 ===
	&--mobile {
		background: var(--va-background-secondary, #f8fafc);
	}

	&__mobile-wrapper {
		padding: 1.5rem;
		height: 100%;
	}

	&__mobile-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		max-width: 400px;
		margin: 0 auto;
	}

	&__mobile-brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2rem;
	}
}
</style>

<style lang="scss">
// === 暗色模式微調 (非 scoped) ===
body.dark-mode,
body.va-dark {
	.auth-layout {
		background: #0f172a !important;

		&__brand {
			background: linear-gradient(135deg, #0f172a 0%, #020617 100%) !important;
		}

		&__brand-title--mobile {
			color: #f8fafc !important;
		}

		&--mobile {
			background: #0f172a !important;
		}
	}
}
</style>
