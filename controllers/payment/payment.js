const viewPayment = (req, res, db, logger) => {
	db.select('id').from('cart').where({
			student_id: req.session.student_id,
			status: 'Pending',
			trx_id: 'Checkout Pending'
		})
		.then(cart => {
			if (cart[0]) {
				db.select('*').from('shopping_cart').where('cart_id', '=', cart[0].id)
					.then(cart_item => {
						let cart_items = cart_item;
						let total_price = cart_items.reduce((sum, {
							sub_total
						}) => sum + parseFloat(sub_total), 0);
						total_price = total_price.toFixed(2);
						res.render('pages/payment-page', {
							cart_items: cart_items,
							total_price: total_price,
							id: req.session.student_id
						});
						return;
					})
			} else {
				res.render('pages/error-500');
				return;
			}
		}).catch(err => {
			console.log(err);
			logger.error(err);
			res.render('pages/error-500');
		})
}

const viewPaymentFinal = (req, res, db, logger, moment) => {
	let date = new Date();
	let formattedDate = moment(date).format('MMDDYY');
	db.transaction((trx) => {
			db.count('trx_id as trx_count').from('transaction').where('date_created', '=', new Date())
				.then(data => {
					if (data[0].trx_count == '0') {
						trx_number = formattedDate + '0001';
					} else {
						trx_number = data[0].trx_count;
						trx_number2 = (+trx_number) + 1;
						trx_number2 = ("0000" + trx_number2).slice(-4);
						trx_number = formattedDate + trx_number2;
					}
					db.select('id').from('cart').where({
							student_id: req.session.student_id,
							status: 'Pending',
							trx_id: 'Checkout Pending'
						})
						.then(status => {
							if (status[0]) {
								db('transaction')
									.returning('*')
									.insert({
										trx_id: trx_number,
										date_created: new Date(),
										cart_id: status[0].id
									})
									.then(trx => {
										if (trx[0]) {
											db('cart')
												.returning('*')
												.where({
													student_id: req.session.student_id,
													status: 'Pending',
													trx_id: 'Checkout Pending'
												})
												.update({
													trx_id: trx_number
												})
												.then(cart => {
													if (cart[0]) {
														db('cart_item')
															.returning('*')
															.where({
																cart_id: status[0].id,
																trx_id: 'Checkout Pending'
															})
															.update({
																trx_id: trx_number
															})
															.then(cart_item => {
																if (cart_item[0]) {
																	res.render('pages/payment-final', {
																		trx_number: trx_number,
																		id: req.session.student_id
																	});
																	return;
																} else {
																	res.render('pages/error-500');
																	return;
																}
															})
															.then(trx.commit)
															.catch(err => {
																console.error(err);
																logger.error(err);
																trx.rollback;
															});
													} else {
														res.render('pages/error-500');
														return;
													}
												})
												.then(trx.commit)
												.catch(err => {
													console.error(err);
													logger.error(err);
													trx.rollback;
												});
										}
									})
									.then(trx.commit)
									.catch(err => {
										console.error(err);
										logger.error(err);
										trx.rollback;
									});
							} else {
								res.render('pages/error-500');
								return;
							}
						})
						.then(trx.commit)
						.catch(err => {
							console.error(err);
							logger.error(err);
							trx.rollback;
						});
				})
				.then(trx.commit)
				.catch(err => {
					console.error(err);
					logger.error(err);
					trx.rollback;
				});
		})
		.catch(err => {
			console.log(err);
			logger.error(err);
			res.render('pages/error-500');
		});
}

module.exports = {
	viewPayment,
	viewPaymentFinal
}