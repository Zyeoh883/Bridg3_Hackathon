const form_check_id : string = 'verifyForm';
const input_id : string = 'CIDInput';


document.getElementById(form_check_id)!.onsubmit = async function(event) {
	event.preventDefault();
	const filenameInput = (document!.getElementById(input_id) as HTMLInputElement);
	if (!filenameInput || !filenameInput.value)
		return ;
	const formData = new FormData();
	formData.append('filename', filenameInput.value);

	const response = await fetch('/download', {
		method: 'POST',
		body: formData
	})

	const result = await response.text();
	alert(result);
}
