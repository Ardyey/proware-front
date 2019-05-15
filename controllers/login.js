const handleSignin = (req, res, db, logger) => {
	let {
		studentId
	} = req.body;
	db.select('*').from('student_view').where('student_id', '=', studentId)
		.then(data => {
			if (data[0]) {
				req.session.user = data[0].fullname;
				req.session.student_id = data[0].student_id;
				req.session.course = data[0].course_strand_code;
				req.session.level = data[0].student_category;
				res.json({
					isValid: true
				});
				return;
			} else {
				res.json({
					isValid: false
				});
				return;
			}
		}).catch(err => res.json({
			isValid: false
		}))
}

module.exports = {
	handleSignin
}