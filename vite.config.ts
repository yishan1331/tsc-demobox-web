import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	// Load environment variables
	const useMock = process.env.VITE_USE_MOCK === 'true'
	const enableMock = useMock || command === 'serve'

	return {
		optimizeDeps: { noDiscovery: true, include: ['file-saver'] },
		build: {
			sourcemap: false,
			minify: 'esbuild',
			commonjsOptions: {
				include: [/file-saver/, /node_modules/],
			},
		},
		esbuild: {
			drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
		},
		plugins: [
			vue(),
			VueI18nPlugin({
				include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
			}),
			viteMockServe({
				mockPath: 'src/mock',
				enable: enableMock,
			}),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'@types': fileURLToPath(new URL('./src/types', import.meta.url)),
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "sass:math"; @use "sass:color"; @use "src/scss/_variables.scss" as *;`,
				},
			},
		},
	}
})
