import { MockMethod } from 'vite-plugin-mock'
import authMock from './auth'
import monitoringMock from './monitoring'
import settingsMock from './settings'
import common from './common'

export default [
	...authMock,
	...monitoringMock,
	...settingsMock,
	...common,
] as MockMethod[]
