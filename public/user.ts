

function extract_meta(input: string) {
	const publisher_ = (document!.getElementById('name') as HTMLBodyElement);
	const date_ = (document!.getElementById('date') as HTMLBodyElement);
	const filenameOut_ = (document!.getElementById('file') as HTMLBodyElement);
	const keys: string[] = ["publisher", "date_of_publish", "filename"];
	const fields: HTMLBodyElement[] = [publisher_, date_, filenameOut_];
	const lines = input.split('\n');
	// console.log(lines);
	const extractedData: {[key: string]: string} = {};
	lines.forEach(line => {
		const [key, value] = line.split(':').map(part => part.toLowerCase().trim());
		// console.log('test add ', key , ' ', value);
		if (!value || !key)
			return ;
		extractedData[key] = value;
		// console.log('test val ', extractedData[key]);
	});
	for (let i = 0; i < keys.length; i ++) {
		// console.log('fin ', extractedData[keys[i]]);
		if (!extractedData[keys[i]])
			throw Error('Meta.txt content error');
		fields[i].innerHTML = extractedData[keys[i]];
	}
}

document.getElementById('verifyForm')!.onsubmit = async function(event) {
	event.preventDefault();
	const fileInputUser = (document!.getElementById('CIDInput') as HTMLInputElement);
	const previewBoxI = document!.getElementById('previewBox');
	const publisher = (document!.getElementById('name') as HTMLBodyElement);
	const date = (document!.getElementById('date') as HTMLBodyElement);
	const filenameOut = (document!.getElementById('file') as HTMLBodyElement);
	const download = (document!.getElementById('download') as HTMLAnchorElement);
	let FileUrlUser: string | null = null;
	if (!fileInputUser || !fileInputUser.files)
		return ;
	const formData = new FormData();
	formData.append('file', fileInputUser.files[0]);
	const response = await fetch('/download', {
		method: 'POST',
		body: formData
	})
	if (!response.ok) {
		alert(await response.text);
		return ;
	}
	const buffer = await response.blob();
	const binary = await buffer.arrayBuffer();
	const JSZip = require('jszip');
	const zip = new JSZip();
	zip.loadAsync(binary).then(async (unzip: any) => {
		let filename: string | null = null;
		let items: string = await unzip.files['meta.txt']
			.async('string').then((data: string) => {return (data)});
		// console.log(items);
		extract_meta(items);
		if (!filename)
			return ;
		const buffer: Blob = await unzip.file(filename).async('blob');
		if (FileUrlUser) {
			URL.revokeObjectURL(FileUrlUser);
		}
		FileUrlUser = URL.createObjectURL(buffer);
		download.href = FileUrlUser;
		download.download = filename;
	}).catch( (err: any) => {
		alert(`processing failed: ${err}`);
		previewBoxI!.style.display = 'none';
		return ;
	} );
	previewBox!.style.display = 'block';
	alert('File verified');

}
