import { ref } from 'vue'

import { type Filters, Pagination, Sorting } from '@/types'

export const makePaginationRef = () =>
	ref<Pagination>({ page: 1, limit: 20, total: 0, total_pages: 0 })
export const makeSortingRef = () => ref<Sorting>({ sortBy: 'posting_date', sortingOrder: 'desc' })
export const makeFiltersRef = () =>
	ref<Partial<Filters>>({ category: [], search: '', fuzzy: false })

export const conditionsManagement = (
	conditions?: Partial<Filters & Pagination & Sorting> | undefined
) => {
	let page = 0
	let limit = 0
	let search = ''
	let category = ''
	let fuzzy = false

	const isFilters = typeof conditions !== 'undefined'
	if (isFilters) {
		const {
			page: _page,
			limit: _perPage,
			search: _search,
			category: _category,
			fuzzy: _fuzzy,
		} = conditions as Partial<Filters & Pagination & Sorting>
		page = _page as number
		limit = _perPage as number
		search = String(_search) as string
		category = (
			Array.isArray(_category)
				? _category.length > 1 && _category[1] != ''
					? _category.join('||')
					: _category[0]
				: _category
		) as string
		fuzzy = _fuzzy as boolean
	}

	const pageParams = isFilters
		? {
				page: page,
				limit: limit,
			}
		: {}

	const filterParams =
		search != ''
			? {
					attr: category,
					attrValue: search,
					fuzzy: fuzzy,
				}
			: {}

	const sortingParams = {
		sortBy: conditions?.sortBy,
		sortingOrder: conditions?.sortingOrder,
	}
	return {
		page,
		limit,
		pageParams,
		filterParams,
		sortingParams,
	}
}
