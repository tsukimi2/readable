import React from 'react';
import * as Global from '../utils/global';

function getPageTitle(pagetype, title) {
	switch(pagetype) {
		case Global.PAGETYPE.DEFAULT:
			return Global.HOME;
		case Global.PAGETYPE.CATEGORY:
			return (title !== '') ? title : Global.NEW
		case Global.PAGETYPE.POST:
			return (title !== '') ? title : Global.NEW
		default:
			return '';
	}
}

export default function Title({ page }) {
	const page_title = getPageTitle(page.pagetype, page.title);

	return (
		<h2>{page_title}</h2>
	)
}
