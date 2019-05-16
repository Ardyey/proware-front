const studentId = document.querySelector('#studentId');
const signinButton = document.querySelector('#signinButton');
const spinner = document.querySelector('.spinner');

$(document).ready(function() {
	$(document).keypress(function(e) {
		var key = e.which;
		if (key == 13) // the enter key code
		{
			signinButton.click();
			return false;
		}
	});
});

signinValidation = () => {
	spinner.removeAttribute('hidden');
	fetch('https://tranquil-forest-40707.herokuapp.com//auth', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				studentId: studentId.value,
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.isValid) {
				window.location.href = "/all_products";
			} else {
				creds.removeAttribute('hidden');
				spinner.setAttribute('hidden', '');
			}
		})
		.catch(err => console.error(err));
}

signinButton.addEventListener('click', signinValidation);