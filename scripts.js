
window.addEventListener('DOMContentLoaded', () => {

	let testString = '12345'

	let formElement = document.getElementById("my-form")
	const noMatchDropdown = document.getElementById('no_match');
	const matchFoundDropdown = document.getElementById('match_found');

	function showDropdown(dropdown) {
		dropdown.classList.add('show');
	}

	function hideDropdown(dropdown) {
		dropdown.classList.remove('show');
	}

	function dropdownHandler(str) {
		if (str === testString) {
			showDropdown(matchFoundDropdown);
			hideDropdown(noMatchDropdown);
		} else {
			showDropdown(noMatchDropdown);
			hideDropdown(matchFoundDropdown);
		}
	}

	formElement.addEventListener("submit", (event) => {
		event.preventDefault();

		let formEl = event.currentTarget
		let inputValue = formEl.elements['hash-input'].value;

		console.log(inputValue)

		dropdownHandler(inputValue);
	})
})
