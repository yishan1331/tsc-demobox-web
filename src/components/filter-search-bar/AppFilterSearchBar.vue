<template>
	<button class="collapsible" @click="showCollapseBox">
		{{ t('filter.queryModule') }}
		<VaIcon
			v-if="isCollapsed"
			aria-hidden="true"
			size="20px"
			:component="VaIconComponent"
			icon="keyboard_arrow_down"
			class="ml-2"
		/>
		<VaIcon
			v-else
			aria-hidden="true"
			size="20px"
			:component="VaIconComponent"
			icon="keyboard_arrow_up"
			class="ml-2"
		/>
	</button>
	<div
		ref="collapsiblecontent"
		class="collapsible-content overflow-hidden transition-all duration-300"
		:style="{ height: isCollapsed ? '0px' : 'auto', opacity: isCollapsed ? 0 : 1 }"
	>
		<div
			class="w-full flex xs:flex-col sm:flex-row gap-2 overflow-auto justify-start px-4 bg-tsc-grey-light rounded-lg"
		>
			<VaSelect
				v-model="tempFilters.category"
				class="mb-4 sm:w-[25%]"
				:options="categoryConfig.options"
				:label="t('select.categories')"
				value-by="value"
				:placeholder="t('select.categories')"
				color="tscDark"
				multiple
				max-selections="2"
			/>
			<!-- @update:modelValue="clearDatas" -->
			<div
				class="flex gap-5 xs:flex-wrap sm:flex-nowrap"
				v-if="tempFilters.category && (tempCategory1 || tempCategory2)"
			>
				<VaSelect
					v-if="
						tempCategory1 in searchConfig &&
						categoryConfig.types[tempCategory1] == 'select'
					"
					v-model="tempSearch1"
					:label="categoryConfig.label[tempCategory1]"
					class="mb-4"
					:options="searchConfig[tempCategory1]"
					value-by="value"
					:placeholder="t('select.category')"
					color="tscDark"
				/>
				<VaSelect
					v-if="
						tempCategory2 in searchConfig &&
						categoryConfig.types[tempCategory2] == 'select'
					"
					v-model="tempSearch2"
					:label="categoryConfig.label[tempCategory2]"
					class="mb-4"
					:options="searchConfig[tempCategory2]"
					value-by="value"
					:placeholder="t('select.category')"
					color="tscDark"
				/>
				<VaInput
					v-if="categoryConfig.types[tempCategory1] == 'text'"
					v-model="tempSearch1"
					:label="categoryConfig.label[tempCategory1]"
					color="tscDark"
				>
					<template #prependInner>
						<VaIcon name="search" color="secondary" size="small" />
					</template>
				</VaInput>
				<VaInput
					v-if="categoryConfig.types[tempCategory2] == 'text'"
					v-model="tempSearch2"
					:label="categoryConfig.label[tempCategory2]"
					color="tscDark"
				>
					<template #prependInner>
						<VaIcon name="search" color="secondary" size="small" />
					</template>
				</VaInput>
				<div v-if="categoryConfig.types[tempCategory1] == 'date'" class="w-4/5">
					<p
						class="text-tsc-blue"
						style="
							font-size: 1rem;
							font-weight: 700;
							line-height: 14px;
							margin-bottom: 4px;
						"
					>
						{{ categoryConfig.label[tempCategory1] }}
					</p>
					<VaDatePicker
						v-model="tempDate1"
						highlight-weekend
						color="tscDark"
						mode="range"
					/>
					<div>
						{{ tempSearch1DateDisplay }}
					</div>
				</div>
				<div v-if="categoryConfig.types[tempCategory2] == 'date'" class="w-4/5">
					<p
						class="text-tsc-blue"
						style="
							font-size: 1rem;
							font-weight: 700;
							line-height: 14px;
							margin-bottom: 4px;
						"
					>
						{{ categoryConfig.label[tempCategory2] }}
					</p>
					<VaDatePicker
						v-model="tempDate2"
						highlight-weekend
						color="tscDark"
						mode="range"
					/>
					<div>
						{{ tempSearch2DateDisplay }}
					</div>
				</div>
			</div>
			<div class="flex">
				<div
					v-if="showFuzzy"
					class="items-center"
					:class="
						categoryConfig.types[tempCategory1] == 'date' ||
						categoryConfig.types[tempCategory2] == 'date'
							? ''
							: 'flex'
					"
					style="min-width: 65px"
				>
					<VaSwitch
						v-model="tempFilters.fuzzy"
						:true-inner-label="t('select.fuzzy')"
						:false-inner-label="t('select.normal')"
						class="py-2"
						color="tscGreyNeutral"
						size="small"
						preset="secondary"
					/>
					<!-- style="background-color:rgba(34, 130, 0, 0.5) ;" -->
				</div>
				<div
					class="items-center"
					:class="
						categoryConfig.types[tempCategory1] == 'date' ||
						categoryConfig.types[tempCategory2] == 'date'
							? ''
							: 'flex'
					"
				>
					<VaButton
						@click.prevent="searchDatas"
						color="tscDark"
						icon="mso-search"
						preset="secondary"
					/>
				</div>
				<div
					class="items-center"
					:class="
						categoryConfig.types[tempCategory1] == 'date' ||
						categoryConfig.types[tempCategory2] == 'date'
							? ''
							: 'flex'
					"
				>
					<VaButton
						@click.prevent="clearDatas"
						color="danger"
						icon="close"
						preset="secondary"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType, toRef, ref, watch, computed, Ref } from 'vue'
import { cloneDeep, isNull } from 'lodash-es'
import { useI18n } from 'vue-i18n'

import { Filters } from '@/types'
import VaIconComponent from '@/components/icons/VaIconComponent.vue'

const { t } = useI18n()

const props = defineProps({
	filters: { type: Object as PropType<Partial<Filters>>, required: true },
	categoryConfig: { type: Object, required: true },
	searchConfig: {
		type: Object,
		default: () => ({}),
	},
	showFuzzy: { type: Boolean, required: false, default: true },
	initSearching: { type: Boolean, required: false, default: false },
})

const isCollapsed = ref(false)
const collapsiblecontent: Ref<null | HTMLElement> = ref(null)
const showCollapseBox = () => {
	isCollapsed.value = !isCollapsed.value
}

const filters = toRef(props, 'filters')
const categoryConfig = toRef(props, 'categoryConfig')
const searchConfig = toRef(props, 'searchConfig')
const showFuzzy = toRef(props, 'showFuzzy')
const initSearching = toRef(props, 'initSearching')
const tempFilters = ref<Partial<Filters>>(!initSearching.value ? cloneDeep(filters.value) : {})
const tempCategory1 = ref('')
const tempCategory2 = ref('')
const tempSearch1 = ref<string>('')
const tempSearch2 = ref<string>('')
const tempDate1 = ref<Date | { start: Date; end: Date } | null>(null)
const tempDate2 = ref<Date | { start: Date; end: Date } | null>(null)

const tempSearch1DateDisplay = computed(() => {
	if (!tempDate1.value) return ''
	if (tempDate1.value instanceof Date) return getFullDate(tempDate1.value)
	const startdate = tempDate1.value.start
	const enddate = tempDate1.value.end

	if (startdate && enddate)
		return t('filter.dateRange', { start: getFullDate(startdate), end: getFullDate(enddate) })
	if (startdate) return t('filter.dateRangeStart', { start: getFullDate(startdate) })
	if (enddate) return t('filter.dateRangeEnd', { end: getFullDate(enddate) })
	return ''
})
const tempSearch2DateDisplay = computed(() => {
	if (!tempDate2.value) return ''
	if (tempDate2.value instanceof Date) return getFullDate(tempDate2.value)
	const startdate = tempDate2.value.start
	const enddate = tempDate2.value.end

	if (startdate && enddate)
		return t('filter.dateRange', { start: getFullDate(startdate), end: getFullDate(enddate) })
	if (startdate) return t('filter.dateRangeStart', { start: getFullDate(startdate) })
	if (enddate) return t('filter.dateRangeEnd', { end: getFullDate(enddate) })
	return ''
})

const getFullDate = (date: Date) => {
	// 獲取年份、月份和日期
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0') // 月份從 0 開始，所以需要加 1
	const day = String(date.getDate()).padStart(2, '0')

	return `${year}-${month}-${day}`
}

watch(
	() => tempFilters.value.category,
	(newCategory, oldCategory) => {
		console.log(newCategory, oldCategory)
		if (newCategory) {
			if (newCategory.length > 1) {
				tempCategory1.value = newCategory[0]
				tempCategory2.value = newCategory[1]
			} else {
				tempCategory1.value = newCategory[0]
				tempCategory2.value = ''
			}
		}
		if (newCategory !== oldCategory) {
			tempFilters.value.search = ''
			tempFilters.value.fuzzy = false
			tempSearch1.value = ''
			tempSearch2.value = ''
			tempDate1.value = null
			tempDate2.value = null
			filters.value.search = ''
		}
	},
	{ deep: true }
)

const searchDatas = () => {
	filters.value.search = ''
	filters.value.category = [tempCategory1.value, tempCategory2.value]

	// Handle tempSearch1 (text/select) or tempDate1 (date)
	if (categoryConfig.value.types[tempCategory1.value] === 'date' && tempDate1.value) {
		if (tempDate1.value instanceof Date) {
			filters.value.search = getFullDate(tempDate1.value)
		} else if (isNull(tempDate1.value.start) && isNull(tempDate1.value.end)) {
			filters.value.search = ''
			filters.value.category = [tempCategory2.value]
		} else {
			const startStr = tempDate1.value.start ? getFullDate(tempDate1.value.start) : ''
			const endStr = tempDate1.value.end ? getFullDate(tempDate1.value.end) : ''
			filters.value.search = `${startStr}^_^${endStr}`
		}
	} else if (tempSearch1.value) {
		filters.value.search = tempSearch1.value as string
	} else {
		filters.value.category = [tempCategory2.value]
	}

	// Handle tempSearch2 (text/select) or tempDate2 (date)
	if (categoryConfig.value.types[tempCategory2.value] === 'date' && tempDate2.value) {
		if (tempDate2.value instanceof Date) {
			const dateStr = getFullDate(tempDate2.value)
			if (filters.value.search) {
				filters.value.search = `${filters.value.search}||${dateStr}`
			} else {
				filters.value.search = dateStr
			}
		} else if (isNull(tempDate2.value.start) && isNull(tempDate2.value.end)) {
			if (filters.value.search) {
				filters.value.category = [tempCategory1.value]
			} else {
				filters.value.category = []
			}
		} else {
			const startStr = tempDate2.value.start ? getFullDate(tempDate2.value.start) : ''
			const endStr = tempDate2.value.end ? getFullDate(tempDate2.value.end) : ''
			if (filters.value.search) {
				filters.value.search = `${filters.value.search}||${startStr}^_^${endStr}`
			} else {
				filters.value.search = `${startStr}^_^${endStr}`
			}
		}
	} else if (tempSearch2.value) {
		if (filters.value.search) {
			filters.value.search = `${filters.value.search}||${tempSearch2.value}`
		} else {
			filters.value.search = tempSearch2.value as string
		}
	} else {
		if (tempSearch1.value) filters.value.category = [tempCategory1.value]
	}
	if (!filters.value.search) {
		filters.value.category = []
	}
	filters.value.fuzzy = tempFilters.value.fuzzy
	console.log(filters.value)
}

const clearDatas = () => {
	tempCategory1.value = ''
	tempCategory2.value = ''
	tempSearch1.value = ''
	tempSearch2.value = ''
	filters.value.category = []
	filters.value.search = ''
	filters.value.fuzzy = false
	tempFilters.value.category = []
	tempFilters.value.search = ''
	tempFilters.value.fuzzy = false
}
</script>

<style lang="scss" scoped></style>
