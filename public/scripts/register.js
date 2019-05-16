const signupButton = document.querySelector('#signupButton');
const studentNumber = document.querySelector('#studentNumber')
const firstName = document.querySelector('#firstName');
const middleInitial = document.querySelector('#middleInitial');
const lastName = document.querySelector('#lastName');
const courseSelect = document.querySelector('#courseSelect');
const strandSelect = document.querySelector('#strandSelect');
const spinner = document.querySelector('.spinner');
const levelGroup = document.querySelector('#level');
const warning = document.querySelector('#warning');

signupValidation = () => {
	spinner.removeAttribute('hidden');
	fetch('https://tranquil-forest-40707.herokuapp.com//register', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				studentNumber: studentNumber.value,
				firstName: firstName.value,
				middleInitial: middleInitial.value,
				lastName: lastName.value,
				courseSelect: courseSelect.value,
				strandSelect: strandSelect.value
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.haveEmpty) {
				window.alert("Please complete the required fields!");
				spinner.setAttribute('hidden', '');
			} else {
				if (data.isSuccess) {
					window.alert('Registered Successfully!');
					window.location.href = "/";
				} else {
					window.alert("Student ID Already Taken!");
					spinner.setAttribute('hidden', '');
				}
			}
		})
		.catch(err => console.error(err));
}

checkRadio = () => {
	if (document.querySelector('#shsLevel').checked) {
		levelGroup.removeAttribute('hidden');
		warning.setAttribute('hidden', '');
		courseSelect.disabled = true;
		courseSelect.setAttribute('hidden', '');
		strandSelect.disabled = false;
		strandSelect.removeAttribute('hidden');
	} else if (document.querySelector('#tertiaryLevel').checked) {
		levelGroup.removeAttribute('hidden');
		warning.setAttribute('hidden', '');
		strandSelect.disabled = true;
		strandSelect.setAttribute('hidden', '');
		courseSelect.disabled = false;
		courseSelect.removeAttribute('hidden');
	}
}

signupButton.addEventListener('click', signupValidation);

$(document).ready(function() {
	$(":input").inputmask();
	$('#studentNumber').inputmask({
		"onincomplete": () => {
			alert('Please enter valid Student ID');
		},
		"clearIncomplete": true
	});
	$('#middleInitial').inputmask({
		"onincomplete": () => {
			alert('Please enter valid Middle Initial');
		},
		"clearIncomplete": true
	});
});