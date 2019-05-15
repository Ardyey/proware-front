const getTransaction = (req, res, db, logger) => {
	db.select('*').from('transaction').where('date_created', '=', new Date())
		.then(data => {
			if (data[0]) {
				res.json({
					transaction: data
				});
				return;
			} else {
				res.json({
					noRecord: true
				});
				return;
			}
		}).catch(err => logger.error(err))

}

module.exports = {
	getTransaction
}