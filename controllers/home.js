const bookList = (req, res, db, logger) => {
	let subquery = db.select('course').from('product_view').where('course', 'ilike', '%'+req.session.level+'%').orWhere('course', 'ilike', '%'+req.session.course+'%').orWhere('course', 'ilike', '%all students%');
  db.select('*').from('product_view').where('type', '=', 'Books').andWhere('status', '=', 'Active')
  .andWhere('course', 'in', subquery).orderBy('item_description')
		.then(data => {
			if (data[0]) {
				let totalProduct = data.length,
					pageSize = 9,
					pageCount = Math.round(data.length / pageSize),
					currentPage = 1,
					product = data,
					productArrays = [],
					productList = [];

				while (product.length > 0) {
					productArrays.push(product.splice(0, pageSize));
				}
				console.log(subquery)
				if (typeof req.query.page !== 'undefined') {
					currentPage = +req.query.page;
				}

				productList = productArrays[+currentPage - 1];

				res.render('pages/product/book', {
					// id: req.session.user.id, 
					product: productList,
					pageSize: pageSize,
					totalProduct: totalProduct,
					pageCount: pageCount,
					currentPage: currentPage,
					id: req.session.student_id
				});
				return;
			} else {
				res.render('pages/error-500');
				return;
			}
		}).catch(err => {
			console.log(err);
			logger.error(err);
			res.render('pages/error-500');
		});
}

const prowareList = (req, res, db) => {
	let subquery = db.select('course').from('product_view').where('course', 'ilike', '%'+req.session.level+'%').orWhere('course', 'ilike', '%'+req.session.course+'%').orWhere('course', 'ilike', '%all students%');
	db.select('*').from('product_view').where('type', '=', 'Proware').andWhere('status', '=', 'Active')
		.andWhere('course', 'in', subquery).orderBy('item_description')
		.then(data => {
			if (data[0]) {
				let totalProduct = data.length,
					pageSize = 9,
					pageCount = Math.round(data.length / pageSize),
					currentPage = 1,
					product = data,
					productArrays = [],
					productList = [];

				while (product.length > 0) {
					productArrays.push(product.splice(0, pageSize));
				}

				if (typeof req.query.page !== 'undefined') {
					currentPage = +req.query.page;
				}

				productList = productArrays[+currentPage - 1];

				res.render('pages/product/proware', {
					// id: req.session.user.id, 
					product: productList,
					pageSize: pageSize,
					totalProduct: totalProduct,
					pageCount: pageCount,
					currentPage: currentPage,
					id: req.session.student_id
				});
				return;
			}
		}).catch(err => {
			console.log(err);
			logger.error(err);
			res.render('pages/error-500');
		});
}

const uniformList = (req, res, db) => {
	let subquery = db.select('course').from('product_view').where('course', 'ilike', '%'+req.session.level+'%').orWhere('course', 'ilike', '%'+req.session.course+'%').orWhere('course', 'ilike', '%all students%');
	db.select('*').from('product_view').where('type', '=', 'Uniform').andWhere('status', '=', 'Active')
		.andWhere('course', 'in', subquery).orderBy('item_description')
		.then(data => {
			if (data[0]) {
				let totalProduct = data.length,
					pageSize = 9,
					pageCount = Math.round(data.length / pageSize),
					currentPage = 1,
					product = data,
					productArrays = [],
					productList = [];

				while (product.length > 0) {
					productArrays.push(product.splice(0, pageSize));
				}

				if (typeof req.query.page !== 'undefined') {
					currentPage = +req.query.page;
				}

				productList = productArrays[+currentPage - 1];

				res.render('pages/product/uniform', {
					// id: req.session.user.id, 
					product: productList,
					pageSize: pageSize,
					totalProduct: totalProduct,
					pageCount: pageCount,
					currentPage: currentPage,
					id: req.session.student_id
				});
				return;
			} else {
				res.render('pages/error-500');
				return;
			}
		}).catch(err => {
			console.log(err);
			logger.error(err);
			res.render('pages/error-500');
		});
}

const allList = (req, res, db) => {
	let subquery = db.select('course').from('product_view').where('course', 'ilike', '%'+req.session.level+'%').orWhere('course', 'ilike', '%'+req.session.course+'%').orWhere('course', 'ilike', '%all students%');
	db.select('*').from('product_view').where('course', 'in', subquery).andWhere('status', '=', 'Active').orderBy('item_description')
		.then(data => {
			if (data[0]) {
				let totalProduct = data.length,
					pageSize = 9,
					pageCount = Math.round(data.length / pageSize),
					currentPage = 1,
					product = data,
					productArrays = [],
					productList = [];

				while (product.length > 0) {
					productArrays.push(product.splice(0, pageSize));
				}

				if (typeof req.query.page !== 'undefined') {
					currentPage = +req.query.page;
				}

				productList = productArrays[+currentPage - 1];

				res.render('pages/product/all', {
					// id: req.session.user.id, 
					product: productList,
					pageSize: pageSize,
					totalProduct: totalProduct,
					pageCount: pageCount,
					currentPage: currentPage,
					id: req.session.student_id
				});
				return;
			} else {
				res.render('pages/error-500');
				return;
			}
		}).catch(err => {
			console.log(err);
			res.render('pages/error-500');
		});
}

const searchList = (req, res, db) => {
	let subquery = db.select('course').from('product_view').where('course', 'ilike', '%'+req.session.level+'%').orWhere('course', 'ilike', '%'+req.session.course+'%').orWhere('course', 'ilike', '%all students%');
	db.select('*').from('product_view').where('item_description', 'ilike', '%' + req.query.product + '%').andWhere('status', '=', 'Active')
		.andWhere('course', 'in', subquery).orderBy('item_description')
		.then(data => {
			if (data[0]) {
				let totalProduct = data.length,
					pageSize = 9,
					pageCount = Math.round(data.length / pageSize),
					currentPage = 1,
					product = data,
					productArrays = [],
					productList = [];

				while (product.length > 0) {
					productArrays.push(product.splice(0, pageSize));
				}

				if (typeof req.query.page !== 'undefined') {
					currentPage = +req.query.page;
				}

				productList = productArrays[+currentPage - 1];
				res.render('pages/product/search', {
					// id: req.session.user.id, 
					product: productList,
					pageSize: pageSize,
					totalProduct: totalProduct,
					pageCount: pageCount,
					currentPage: currentPage,
					id: req.session.student_id
				});
				return;
			} else {
				res.render('pages/product/search', {
					result: req.query.product
				});
				return;
			}
		}).catch(err => {
			console.log(err);
			res.render('pages/error-500');
		});
}

module.exports = {
	bookList,
	prowareList,
	uniformList,
	allList,
	searchList
}