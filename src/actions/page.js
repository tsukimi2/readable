import { CHANGE_PAGETYPE } from './constants'

export function changePagetype(pagetype, title) {
	return {
		type: CHANGE_PAGETYPE,
		pagetype,
		title
	}
}