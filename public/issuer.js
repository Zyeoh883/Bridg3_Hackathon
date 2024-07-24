"use strict";
const form_up_id = 'uploadForm';
const file_id = 'fileInput';
document.getElementById(form_up_id).onsubmit = async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById(file_id);
    if (!fileInput || !fileInput.files)
        return;
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    const result = await response.text();
    alert(result);
};
