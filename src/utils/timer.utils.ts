// 格式化日期時間為 YYYY-MM-DD HH:mm:ss
export const formatDateTime = (date: Date | string) => {
	const d = typeof date === 'string' ? new Date(date) : date
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	const hours = String(d.getHours()).padStart(2, '0')
	const minutes = String(d.getMinutes()).padStart(2, '0')
	const seconds = String(d.getSeconds()).padStart(2, '0')

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const getNow = (date: null | Date = null) => {
	const nowDate = date === null ? new Date() : date
	const returnobj = dateFormat(nowDate)
	// console.log(returnobj)
	const obj = {
		now: '',
		nowFormat: '',
	}
	obj.now = `${returnobj.weekday}, ${returnobj.month}月 ${returnobj.day}, ${returnobj.year}`

	const timePart = [nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds()]
		.map((n) => n.toString().padStart(2, '0'))
		.join(':')

	obj.nowFormat = `${returnobj.year}-${returnobj.month}-${returnobj.day} ${timePart}`
	console.log(obj)
	return obj.nowFormat
	// setDate(obj)
}
export const dateFormat = (time: Date) => {
	const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
	const thisDay = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()
	const thisMonth = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1
	return {
		year: time.getFullYear(),
		month: thisMonth,
		day: thisDay,
		weekday: weekdays[time.getDay()],
	}
}
