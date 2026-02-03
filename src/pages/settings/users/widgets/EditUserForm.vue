<template>
	<VaForm
		v-slot="{ isValid }"
		ref="add-data-form"
		class="flex-col justify-start items-start gap-4 inline-flex w-full"
	>
		<div class="self-stretch flex-col justify-start items-start gap-4 flex">
			<div class="flex gap-4 flex-col sm:flex-row w-full">
				<VaInput
					v-model="newData.username"
					:label="t('user.username')"
					class="w-full sm:w-1/2"
					:rules="[validators.required]"
					color="tscDark"
					readonly
				/>
				<VaInput
					v-model="newData.full_name"
					:label="t('user.full_name')"
					class="w-full sm:w-1/2"
					:rules="[validators.required]"
					color="tscDark"
					readonly
				/>
			</div>
			<div class="flex gap-4 flex-col sm:flex-row w-full">
				<VaSelect
					v-model="newData.roles"
					:options="rolesOptions"
					:label="t('user.roles')"
					placeholder="請選擇角色"
					:rules="[validators.required]"
					value-by="value"
					class="w-full sm:w-1/2"
					clearable
					multiple
					color="tscDark"
				/>
				<div>
					<div class="va-input-label text-tsc-blue-dark" style="display: block">狀態</div>
					<div class="mt-2">
						<VaSwitch
							v-model="newData.is_active"
							true-inner-label="啟用"
							false-inner-label="未啟用"
							size="small"
							color="tsc"
						/>
					</div>
				</div>
			</div>

			<!-- Remark field temporarily disabled - needs to be mapped to position or other field -->
			<!-- <VaTextarea
				v-model="newData.remark"
				:label="t('user.remark')"
				class="w-full"
				color="tscDark"
			/> -->
			<div
				class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center"
			>
				<VaButton preset="plain" color="danger" icon="close" @click="$emit('close')">{{
					t('common.cancel')
				}}</VaButton>
				<VaButton :disabled="!isValid" @click="onSave" icon="save" color="tsc">{{
					saveButtonLabel
				}}</VaButton>
			</div>
		</div>
	</VaForm>
</template>

<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

import { User } from '@/types'
import { validators } from '@/validators/validator'
import { roleLabel } from '@/utils/user.utils'

const { t } = useI18n()

const props = defineProps({
	user: {
		type: Object as PropType<User | null>,
		default: null,
	},
	saveButtonLabel: {
		type: String,
		default: 'Save',
	},
})

const isEditStatus = ref(false)
const rolesOptions = ref([
	{ text: roleLabel.admin, value: 'ADMIN' },
	{ text: roleLabel.manager, value: 'MANAGER' },
	{ text: roleLabel.user, value: 'USER' },
	{ text: roleLabel.guest, value: 'GUEST' },
])

const defaultNewUser: Partial<User> = {
	user_id: 0,
	username: '',
	roles: [],
	is_active: true,
}

const newData = ref<Partial<User>>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
	return Object.keys(newData.value).some((key) => {
		return (
			newData.value[key as keyof User] !== (props.user ?? defaultNewUser)?.[key as keyof User]
		)
	})
})

defineExpose({
	isFormHasUnsavedChanges,
})

watch(
	() => props.user,
	() => {
		if (!props.user) {
			isEditStatus.value = false
			return
		}

		newData.value = {
			...props.user,
		}
		isEditStatus.value = true
	},
	{ immediate: true }
)

const form = useForm('add-data-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
	if (form.validate()) {
		emit('save', newData.value)
	}
}
</script>
