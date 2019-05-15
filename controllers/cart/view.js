const viewCart = (req, res, db, logger) => {
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
						// let total_price = cart_items.reduce((sum, {sub_total}) => sum + parseFloat(sub_total), 0);
						res.render('pages/shopping-cart', {
							cart_items: cart_items,
							id: req.session.student_id
						})
					});
					return;
			} else {
				res.render('pages/shopping-cart', {
					cart_items: 'Cart is Empty!',
					id: req.session.student_id
				});
				return;
			}
		}).catch(err => {
			console.log(err);
			logger.error(err);
			res.render('pages/error-500');
		})
}

const viewTotalPrice = (req, res, db, logger) => {
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
						res.json(total_price);
					})
			} else {
				res.json('');
				return;
			}
		}).catch(err => {
			console.log(err);
			logger.error(err);
			res.render('pages/error-500');
		})
}

const changeQuantity = (req, res, db, logger) => {
	let {
		itemQuantity,
		itemCode
	} = req.body;
	db.transaction((trx) => {
			db.select('id').from('cart').where({
					student_id: req.session.student_id,
					status: 'Pending',
					trx_id: 'Checkout Pending'
				})
				.then(user => {
					if (user[0]) {
						db.select('*').from('shopping_cart').where({
								item_code: itemCode,
								cart_id: user[0].id
							})
							.then(cart => {
								if (cart[0]) {
									db('cart_item')
										.returning('*')
										.where({
											item_code: itemCode,
											cart_id: user[0].id
										})
										.update({
											quantity: itemQuantity,
											sub_total: itemQuantity * cart[0].unit_price
										})
										.then(item => {
											if (item[0]) {
												res.json(item);
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
		})
		.catch(err => {
			console.log(err);
			logger.error(err);
			res.render('pages/error-500');
		});
}

module.exports = {
	viewCart,
	viewTotalPrice,
	changeQuantity
}