const fileInputIssuer = (document.getElementById('fileInput') as HTMLInputElement);
const previewBox = document.getElementById('previewBox');
const downloadButton = (document.getElementById('download') as HTMLAnchorElement);
const canvas = (document.getElementById('canvas') as HTMLCanvasElement);
let FileUrlIssuer : string | null = null;

const qr = require('qrcode');

document.getElementById('uploadForm')!.onsubmit = async function(event) {
	event.preventDefault();
	if (!fileInputIssuer || !fileInputIssuer.files)
		return ;
	const formData = new FormData();
	formData.append('file', fileInputIssuer.files[0]);
	
	const response = await fetch('/upload', {
		method: 'POST',
		body: formData
	}).then( response => response.text())
	.then(async (data) => {
		if (!data) {
			previewBox!.style.display = 'none';
			alert('file not uploaded');
			return ;
		}
		previewBox!.style.display = 'block';
		qr.toCanvas(canvas, data);
		if (FileUrlIssuer) {
			URL.revokeObjectURL(FileUrlIssuer);
		}
		FileUrlIssuer = await qr.toDataURL(data);
		downloadButton.href = FileUrlIssuer!;
		downloadButton.download = 'qrcode.png'
	})
	alert('file sucess');
}
