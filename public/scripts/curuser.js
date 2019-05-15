fetch('http://localhost:3002/curuser')
	.then(response => response.json())
	.then(data => {
		document.querySelector('#currentUser').innerHTML = data[0].fullname;
	})
	.catch(err => console.log('ERROR!: ', err))