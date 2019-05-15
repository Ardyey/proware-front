const dbDeleteCartItem = (req, res, db, logger) => {
	let {
		itemCode
	} = req.body;
	db.transaction((trx) => {
			db.select('id').from('cart').where({
					student_id: req.session.student_id,
					status: 'Pending',
					trx_id: 'Checkout Pending'
				})
				.then(status => {
					if (status[0]) {
						db('cart_item')
							.returning('*')
							.where({
								cart_id: status[0].id,
								item_code: itemCode
							})
							.del()
							.then(cart => {
								if (cart[0]) {
									db('cart_item')
										.count('id')
										.where('cart_id', '=', status[0].id)
										.then(cart_item => {
											if (cart_item[0].count == 0) {
												db('cart')
													.returning('*')
													.where({
														id: status[0].id,
														student_id: req.session.student_id,
														status: 'Pending',
														trx_id: 'Checkout Pending'
													})
													.del()
													.then(cartDel => {
														if (cartDel[0]) {
															res.json({
																isSuccess: true
															});
															return;
														} else {
															res.json({
																isSuccess: false
															});
															return;
														}
													})
													.then(trx.commit)
													.catch(err => {
														console.error(err);
														logger.error(err);
														trx.rollback;
														res.json({
															isSuccess: false
														});
													});
											} else {
												res.json({
													isSuccess: true
												});
												return;
											}
										})
										.then(trx.commit)
										.catch(err => {
											console.error(err);
											logger.error(err);
											trx.rollback;
											res.json({
												isSuccess: false
											});
										});
								} else {
									res.json({
										isSuccess: false
									});
									return;
								}
							})
							.then(trx.commit)
							.catch(err => {
								console.error(err);
								logger.error(err);
								trx.rollback;
								res.json({
									isSuccess: false
								});
							});
					}
				})
				.then(trx.commit)
				.catch(err => {
					console.error(err);
					logger.error(err);
					trx.rollback;
					res.json({
						isSuccess: false
					});
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	dbDeleteCartItem
}