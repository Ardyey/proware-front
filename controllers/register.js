const initializeFields = (req, res, db, logger) => {
	let {
		tertiary,
		shs
	} = '';
	db.select('*').from('course_strand').where('type', '=', 'Tertiary').orderBy('type')
		.then(tertiary => {
			if (tertiary[0]) {
				tertiary = tertiary;
				db.select('*').from('course_strand').where('type', '=', 'SHS').orderBy('type')
					.then(shs => {
						if (shs[0]) {
							shs = shs;
							res.render('pages/register', {
								tertiary,
								shs
							});
							return;
						} else {
							res.render('pages/error-500');
							return;
						}
					}).catch(err => res.status(400).send('DB Connection failed!'))
			}
		}).catch(err => {
			logger.error(err);
			res.render('pages/error-500');
		})
}

const handleSignup = (req, res, db, bcrypt) => {
	let {
		studentNumber,
		firstName,
		middleInitial,
		lastName,
		courseSelect,
		strandSelect
	} = req.body;

	let courseStrand, category = '';

	if (!studentNumber || !firstName || !middleInitial || !lastName) {
		res.json({
			haveEmpty: true
		});
		return;
	} else if (!courseSelect && !strandSelect) {
		res.json({
			haveEmpty: true
		});
		return;
	} else {
		if (courseSelect) {
			courseStrand = courseSelect;
			category = 'TERTIARY';
		} else if (strandSelect) {
			courseStrand = strandSelect;
			category = 'SHS';
		}
		db.transaction((trx) => {
				db.select('*').from('student').where('student_id', '=', studentNumber)
					.then(data => {
						if (!data[0]) {
							db('student')
								.returning('*')
								.insert({
									student_id: studentNumber,
									first_name: firstName,
									middle_initial: middleInitial,
									last_name: lastName,
									course_strand_code: courseStrand,
									student_category: category
								})
								.then(register => {
									if (register[0]) {
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
									logger.error(err);
									trx.rollback;
									res.json({
										isSuccess: false
									})
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
						logger.error(err);
						trx.rollback;
						res.json({
							isSuccess: false
						})
				});
			})
			.catch(err => {
			logger.error(err);
			res.json({
				isSuccess: false
			})
		});
	}
}

module.exports = {
	initializeFields,
	handleSignup
}