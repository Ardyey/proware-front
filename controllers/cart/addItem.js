const dbAddCartItem = (req, res, db, logger) => {
	let {
		itemCode,
		itemQuantity,
		itemDesc,
		itemPrice
	} = req.body;
	db.transaction((trx) => {
			db.select('id').from('cart').where({
					student_id: req.session.student_id,
					status: 'Pending',
					trx_id: 'Checkout Pending'
				})
				.then(status => {
					if (status[0]) {
						db.select('*').from('shopping_cart').where({
								item_code: itemCode,
								cart_id: status[0].id,
							})
							.then(exist => {
								if (exist[0]) {
									let totalQuantity = parseInt(itemQuantity) + parseInt(exist[0].quantity);
									let price = parseInt(exist[0].unit_price);
									db('cart_item')
										.returning('cart_id')
										.where('item_code', '=', itemCode)
										.update({
											quantity: totalQuantity,
											sub_total: totalQuantity * price
										})
										.then(cart_item => {
											if (cart_item[0]) {
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
									db('cart_item')
										.returning('cart_id')
										.insert({
											cart_id: status[0].id,
											item_code: itemCode,
											item_description: itemDesc,
											quantity: itemQuantity,
											sub_total: itemQuantity * itemPrice
										})
										.then(cart_item => {
											if (cart_item[0]) {
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
						db('cart')
							.returning('id')
							.insert({
								student_id: req.session.student_id,
								date_created: new Date()
							})
							.then(cart => {
								if (cart[0]) {
									db('cart_item')
										.returning('cart_id')
										.insert({
											cart_id: cart[0],
											item_code: itemCode,
											item_description: itemDesc,
											quantity: itemQuantity,
											sub_total: itemQuantity * itemPrice
										})
										.then(cart_item => {
											if (cart_item[0]) {
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
	dbAddCartItem
}