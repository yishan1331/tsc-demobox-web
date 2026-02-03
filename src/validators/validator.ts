import i18n from '@/i18n'

const { t } = i18n.global
// https://blog.csdn.net/weixin_46092505/article/details/126467080

export const validators = {
	email: (v: string) => {
		if (!v) return true
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return pattern.test(v) || t('validation.email')
	},
	numbersandcharacters: (v: string) => {
		const pattern = /^[a-zA-Z0-9]+$/
		return (
			(pattern.test(v) && v.length >= 4 && v.length <= 8) ||
			t('validation.numbersandcharacters')
		)
	},
	required: (v: any) => !!v || t('validation.required'),
	passwordLength: (v: string) =>
		v == '___NOT_CHANGE_PASSWORD___' ||
		(v.length >= 4 && 17 > v.length) ||
		t('validation.passwordLength'),
	passwordFormat: (v: string) => {
		const allowedSymbols = '!@$_+=-'
		const pattern = new RegExp(`^[A-Za-z0-9${allowedSymbols}]*$`)
		return pattern.test(v) || t('validation.passwordFormat', { allowedSymbols })
	},
	comfirmpassword: (v: string, cv: string) => v === cv || t('validation.confirmpassword'),
	positiveNumber: (v: any) => {
		if (!v && v !== 0) return t('validation.required')
		const num = Number(v)
		return (!isNaN(num) && num > 0) || t('validation.positiveNumber')
	},
	minValue: (min: number) => (v: any) => {
		if (!v && v !== 0) return true
		const num = Number(v)
		return (!isNaN(num) && num >= min) || t('validation.minValue', { min })
	},
	maxValue: (max: number) => (v: any) => {
		if (!v && v !== 0) return true
		const num = Number(v)
		return (!isNaN(num) && num <= max) || t('validation.maxValue', { max })
	},
	nonNegativeNumber: (v: any) => {
		if (!v && v !== 0) return t('validation.required')
		const num = Number(v)
		return (!isNaN(num) && num >= 0) || t('validation.nonNegativeNumber')
	},
}
