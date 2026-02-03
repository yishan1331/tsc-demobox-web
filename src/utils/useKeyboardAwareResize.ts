// useKeyboardAwareResize.ts
import { onMounted, onBeforeUnmount, ref, Ref } from 'vue'

type Callbacks = {
	onRealResize?: (w: number, h: number) => void
	onKeyboardOpen?: (w: number, h: number) => void
	onKeyboardClose?: (w: number, h: number) => void
}

type Options = {
	keyboardHeightThreshold?: number
	keyboardHeightRatio?: number
	debounce?: number
	useVisualViewport?: boolean
}

export function useKeyboardAwareResize(callbacks: Callbacks = {}, opts: Options = {}) {
	const {
		keyboardHeightThreshold = 120,
		keyboardHeightRatio = 0.25,
		debounce = 80,
		useVisualViewport = true,
	} = opts

	const { onRealResize, onKeyboardOpen, onKeyboardClose } = callbacks

	const width: Ref<number> = ref(window.innerWidth)
	const height: Ref<number> = ref(window.innerHeight)
	const isKeyboardOpen: Ref<boolean> = ref(false)

	let prevInnerW = window.innerWidth
	let prevInnerH = window.innerHeight
	let prevVVh = (window.visualViewport && window.visualViewport.height) || window.innerHeight

	let timer: number | null = null

	const clearTimer = () => {
		if (timer !== null) {
			window.clearTimeout(timer)
			timer = null
		}
	}

	function detectKeyboard(innerW: number, innerH: number, vvHeight: number | null) {
		const vvKeyboard = vvHeight !== null && vvHeight < innerH * (1 - keyboardHeightRatio)
		const fallbackKeyboard =
			innerW === prevInnerW && Math.abs(prevInnerH - innerH) > keyboardHeightThreshold

		return Boolean(vvKeyboard || fallbackKeyboard)
	}

	function detectAndHandle() {
		const innerW = window.innerWidth
		const innerH = window.innerHeight
		const vv = window.visualViewport
		const vvHeight = vv ? vv.height : null

		const keyboardNow = detectKeyboard(innerW, innerH, vvHeight)
		const widthChanged = innerW !== prevInnerW
		const heightChanged = innerH !== prevInnerH
		const vvChanged = vvHeight !== null ? vvHeight !== prevVVh : false

		// decide real resize
		const isRealResize =
			widthChanged || (heightChanged && !keyboardNow) || (vvChanged && widthChanged)

		// keyboard state change callbacks
		if (keyboardNow && !isKeyboardOpen.value) {
			// just opened
			isKeyboardOpen.value = true
			if (onKeyboardOpen) {
				try {
					onKeyboardOpen(innerW, innerH)
				} catch (e) {
					console.error('onKeyboardOpen callback error', e)
				}
			}
		} else if (!keyboardNow && isKeyboardOpen.value) {
			// just closed
			isKeyboardOpen.value = false
			if (onKeyboardClose) {
				try {
					onKeyboardClose(innerW, innerH)
				} catch (e) {
					console.error('onKeyboardClose callback error', e)
				}
			}
		}

		// update reactive sizes
		width.value = innerW
		height.value = innerH

		// update previous baselines BEFORE calling resize cb to reflect current baseline
		prevInnerW = innerW
		prevInnerH = innerH
		prevVVh = vvHeight === null ? innerH : vvHeight

		// real resize callback (debounced)
		if (isRealResize && onRealResize) {
			clearTimer()
			timer = window.setTimeout(() => {
				try {
					onRealResize(width.value, height.value)
				} catch (e) {
					console.error('onRealResize callback error', e)
				} finally {
					timer = null
				}
			}, debounce)
		}
	}

	function onWindowResize() {
		detectAndHandle()
	}

	function onVVResize() {
		detectAndHandle()
	}

	onMounted(() => {
		window.addEventListener('resize', onWindowResize)
		if (useVisualViewport && window.visualViewport) {
			window.visualViewport.addEventListener('resize', onVVResize)
		}
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', onWindowResize)
		if (useVisualViewport && window.visualViewport) {
			window.visualViewport.removeEventListener('resize', onVVResize)
		}
		clearTimer()
	})

	return {
		width,
		height,
		isKeyboardOpen,
	}
}
