const textSizes = {
	regularSmall: {
		fontSize: '0.8125rem',
		lineHeight: '1rem',
	},
}

module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontSize: {
				tag: ['0.5625rem', '0.875rem'],
				regularSmall: ['0.8125rem', '1rem'],
				regularLarge: ['1.125rem', '1.625rem'],
				regularMedium: ['0.875rem', '1.25rem'],
			},
			maxWidth: {
				'7xl': '1128px',
			},
			colors: {
				primary: 'var(--va-primary)',
				secondary: 'var(--va-secondary)',
				success: 'var(--va-success)',
				info: 'var(--va-info)',
				danger: 'var(--va-danger)',
				warning: 'var(--va-warning)',
				backgroundPrimary: 'var(--va-background-primary)',
				backgroundSecondary: 'var(--va-background-secondary)',
				backgroundElement: 'var(--va-background-element)',
				backgroundCardPrimary: 'var(--va-background-card-primary)',
				backgroundCardSecondary: 'var(--va-background-card-secondary)',
				backgroundBorder: 'var(--va-background-border)',
				textPrimary: 'var(--va-text-primary)',
				textInverted: 'var(--va-text-inverted)',
				shadow: 'var(--va-shadow)',
				focus: 'var(--va-focus)',
				tsc: {
					50: '#f0fcfe', // 極淺
					100: '#e1f9fd', //
					200: '#c3f3fb', //
					300: '#a5edf9', //
					400: '#87e7f7', //
					500: '#75daee', // 主藍色（主色）
					600: '#5bc2e5', // 中藍色（現有）
					700: '#4ab8dc', // 深藍色（現有）
					800: '#3a9ec5', //
					900: '#2d7d9b', //
					950: '#1a4d61', // 極深
				},
			},
			screens: {
				xs: '0px',
				sm: '640px',
				md: '1024px',
				lg: '1440px',
				xl: '1920px',
			},
		},
		screens: {
			xs: '0px',
			sm: '576px',
			md: '768px',
			lg: '992px',
			xl: '1200px',
		},
	},
	plugins: [],
}
