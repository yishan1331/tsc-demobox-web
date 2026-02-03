<template>
	<VaForm ref="form" @submit.prevent="submit" @keyup.enter="submit" class="login-form">
		<h1 class="font-semibold mb-4" :class="breakpoint.lgUp ? 'text-4xl' : 'text-3xl'">
			Log in
		</h1>
		<VaInput
			v-model="formData.account"
			:rules="[validators.required]"
			class="mb-4"
			:label="t('auth.account')"
			type="text"
			preset="solid"
			color="tscDark"
		/>
		<VaValue v-slot="isPasswordVisible" :default-value="false">
			<VaInput
				v-model.trim="formData.password"
				:rules="[validators.required]"
				:type="isPasswordVisible.value ? 'text' : 'password'"
				class="mb-4"
				:label="t('auth.password')"
				@clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
				maxlength="16"
				preset="solid"
				color="tscDark"
			>
				<template #appendInner>
					<VaIcon
						:name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
						class="cursor-pointer"
						color="secondary"
					/>
				</template>
			</VaInput>
		</VaValue>

		<div class="flex justify-center my-4">
			<VaButton class="w-full" @click="submit" color="tsc">
				{{ t('auth.login') }}</VaButton
			>
		</div>
		<div class="mt-6 text-center text-tsc-grey-neutral">
			<b>Ver {{ VERSION }}</b>
		</div>
	</VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter, type RouteRecordRaw } from 'vue-router'
import { useForm, useToast, useBreakpoint } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'

import { validators } from '@/validators/validator'
import { authService } from '@/services/AuthService'
import { childRouter, findVerifiedRoute } from '@/router/childRouter'
import { useUserAuthStore } from '@/stores/userAuth.store'
import { UserSessions } from '@/types'
import { useGlobalStore } from '@/stores/global.store'
import { VERSION, TOAST_LIFE_TIME } from '@/constants'

const { t } = useI18n()
const breakpoint = useBreakpoint()

const AuthStore = useUserAuthStore()
const { getDefaultPageAccess } = storeToRefs(useUserAuthStore())
const { isTesting } = storeToRefs(useGlobalStore())

const { validate } = useForm('form')
const router = useRouter()
const { init: notify } = useToast()

const formData = reactive({
	account: isTesting.value ? 'tSCadmin' : '',
	password: isTesting.value ? 'tsc@93618113' : '',
	keepLoggedIn: false,
})

const submit = async () => {
	console.log(router.getRoutes())
	if (validate()) {
		const _tempFormData = {
			username: formData.account,
			password: formData.password,
		}
		const { logIn } = authService()
		const loginResult = await logIn(_tempFormData)
		console.log('Login result:', loginResult)

		// Network error case is handled by EventService, login flow stops completely
		if (!loginResult) return

		if (!loginResult.success) {
			// 只有在錯誤未被全域處理時才顯示 toast
			if (!loginResult.handled) {
				notify({
					message:
						loginResult.message === 'Incorrect account or password.'
							? t('auth.incorrectCredentials')
							: loginResult.message,
					color: 'danger',
					duration: TOAST_LIFE_TIME,
				})
			}
			return
		}

		const _sessions = loginResult.sessions as UserSessions
		console.log(_sessions)
		notify({
			message: t('auth.loginSuccess'),
			color: 'tsc',
			duration: TOAST_LIFE_TIME,
		})

		const access = Object.prototype.hasOwnProperty.call(_sessions, 'permissions')
			? (_sessions.permissions as object)
			: (getDefaultPageAccess.value as object)

		const obj = {
			userID: _sessions.user_id,
			username: _sessions.username,
			fullName: _sessions.fullname,
			loginStatus: true,
			loginTime: _sessions.login_time,
			roles: _sessions.user_roles,
			accessList: access,
		}

		const trueList: string[] = ['home']
		console.log(access)
		Object.entries(access).forEach((element) => {
			if (element[1]['authority']) {
				trueList.push(element[0])
				if (Object.prototype.hasOwnProperty.call(element[1], 'children')) {
					Object.keys(element[1].children).map((item) => {
						if (element[1].children[item].authority) {
							trueList.push(element[0] + '/' + item)
						}
					})
				}
			}
		})
		console.log('@trueList----> ', trueList)
		console.log('@childRouter----> ', childRouter)
		AuthStore.setUserPageAccess(access)
		console.log(router.getRoutes())
		// 先deep copy
		const _childRouter = cloneDeep(childRouter)
		// 遍历 childRouter 数组，将每个路由配置对象添加到路由中
		_childRouter.forEach((route) => {
			if (route.children) {
				let _findVerifiedRoute = []
				_findVerifiedRoute = findVerifiedRoute(access, route.children) as RouteRecordRaw[]
				route.children = _findVerifiedRoute
			}
			const addedRoute = router.addRoute(route)
			console.log(addedRoute)
			AuthStore.setAddedRouteToRemove(addedRoute)
		})
		AuthStore.setUserData(obj)
		AuthStore.setUserAuthToken(_sessions.tokens.access_token, _sessions.tokens.refresh_token)
		console.log(router.getRoutes())
		setTimeout(function () {
			router.push({ name: 'index' })
		}, 900)
	}
}
</script>

<style scoped lang="scss"></style>
