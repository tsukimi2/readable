export const APPNAME = 'READABLE'
export const HOME = 'HOME'
export const NEW = 'NEW'
export const All = 'All'

export const PAGETYPE = {
	DEFAULT: 0,
	CATEGORY: 1,
	POST: 2
};

export const VOTE = {
	UPVOTE: 'upVote',
	DOWNVOTE: 'downVote'
};

export const POST_FIELD = {
	VOTES: {
		NAME: 'Votes',
		VAL: 'voteScore'
	},
	TIMESTAMP: {
		NAME: 'Timestamp',
		VAL: 'timestamp'
	}
};

export const POST_DEFAULT_VAL = {
	TITLE: '',
	AUTHOR: '',
	BODY: '',
	CATEGORY: 'react',
	VOTESCORE: 0
};

export const COMMENT_FIELD = {
	VOTES: {
		NAME: 'Votes',
		VAL: 'voteScore'
	},
	TIMESTAMP: {
		NAME: 'Timestamp',
		VAL: 'timestamp'
	}
};

export const getDatetimeFromTs = ts => {
	let s_dt = '';
	const dt = new Date(ts);
	const month = dt.getMonth() + 1;

	s_dt = dt.getFullYear() + '/' + month + '/' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes();

	return s_dt;
}

export const sortCopy = arr => arr.slice(0).sort();

// https://vincent.billey.me/pure-javascript-immutable-array/
export const immutableSort = (arr, compareFunction) => [ ...arr ].sort(compareFunction);

export const compareFunc = (sortby_field) => (
	(a, b) => {
		return parseInt(a[sortby_field]) < parseInt(b[sortby_field])
	}
)

