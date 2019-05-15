const displayPage = (req, res, db, logger) => {
	let {
		itemCode
	} = req.query;
	db.select('*').from('product_view').where('item_code', '=', itemCode)
		.then(data => {
			if (data[0]) {
				itemCode = data[0].item_code;
				let itemDesc = data[0].item_description;
				let itemPrice = data[0].price;
				let itemQuantity = data[0].stock;
				let itemImage = data[0].image;
				res.render('pages/product-page', {
					itemCode: itemCode,
					itemDesc: itemDesc,
					itemPrice: itemPrice,
					itemImage: itemImage,
					itemQuantity: itemQuantity,
					id: req.session.student_id
				});
				return;
			} else {
				res.json({
					isValid: false
				});
				return;
			}
		}).catch(err => {
			logger.error(err);
			res.render('pages/error-500');
		});

}

module.exports = {
	displayPage
}