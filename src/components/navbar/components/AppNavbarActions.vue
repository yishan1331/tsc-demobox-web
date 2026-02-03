<template>
	<div class="app-navbar-actions">
		<VaButton preset="secondary" color="textPrimary" @click="goLogout()">
			<span class="profile-dropdown__anchor min-w-max">
				<slot />
				<VaIcon size="20px" class="pr-1" :component="VaIconComponent" :icon="'logout'" />
			</span>
			{{ t(`navbar.logout`) }}
		</VaButton>
	</div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import VaIconComponent from '@/components/icons/VaIconComponent.vue'
import { authService } from '@/services/AuthService'

const { t } = useI18n()

defineProps({
	isMobile: { type: Boolean, default: false },
})

const goLogout = () => {
	authService().logOut()
}
</script>

<style lang="scss">
.app-navbar-actions {
	display: flex;
	align-items: center;

	.va-dropdown__anchor {
		color: var(--va-primary);
		fill: var(--va-primary);
	}

	&__item {
		padding: 0;
		margin-left: 0.25rem;
		margin-right: 0.25rem;

		svg {
			height: 20px;
		}

		&--profile {
			display: flex;
			justify-content: center;
		}

		.va-dropdown-content {
			background-color: var(--va-white);
		}

		@media screen and (max-width: 640px) {
			margin-left: 0;
			margin-right: 0;

			&:first-of-type {
				margin-left: 0;
			}
		}
	}

	.fa-github {
		color: var(--va-on-background-primary);
	}
}
</style>
