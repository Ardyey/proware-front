fetch('https://tranquil-forest-40707.herokuapp.com//curuser')
	.then(response => response.json())
	.then(data => {
		document.querySelector('#currentUser').innerHTML = data[0].fullname;
	})
	.catch(err => console.log('ERROR!: ', err))