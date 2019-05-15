const getOrders = (req, res, db, logger) => {
	db.select('student_id', db.raw('to_char(date_created, \'Mon/dd/yyyy\') as date_created'),
	 'status', 'trx_id', 'or_num', 'expired')
	.from('cart').where('student_id', '=', req.session.student_id)
		.then(data => {
			if (data[0]) {
				res.json(data);
				return;
			} else {
				res.json('');
				return;
			}
		}).catch(err => logger.error(err))
}

const viewItems = (req, res, db, logger) => {
	let {
			transaction
		} = req.query;
		console.log(req.query)
		db.transaction((trx) => {
				db.select('trx_id', 'item_code', 'item_description', 'quantity', 'sub_total')
					.from('cart_item').where({
						trx_id: transaction
					}).orderBy('trx_id')
					.then(data => {
						if (data[0]) {
							res.json(data);
							return;
						} else {
							res.json('');
							return;
						}
					})
					.then(trx.commit)
					.catch(err => {
						console.log(err);
						logger.error(err);
						trx.rollback;
					});
			})
			.catch(err => logger.error(err));
}

module.exports = {
	getOrders,
	viewItems
}