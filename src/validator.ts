
enum FileType {
	zip = 0,
	jpeg = 1,
	png = 2,
	pdf = 3,
	unknown = -1
}

export function checkFileType(buffer: Uint8Array): number {
	// Magic numbers for JPEG, PNG and pdf
	const identifierList : number[][] = [
		[0x50, 0x4B, 0x03, 0x04],
		[0xFF, 0xD8, 0xFF],
		[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
		[0x25, 0x50, 0x44, 0x46]
	];

	for (let index : number = 0; index < identifierList.length; index ++) {
		if (buffer.length < identifierList.length) {
			continue ;
		}
		if (identifierList[index].every((byte, index) => byte === buffer[index])) {
			return (index);
		}
	}
	return (FileType.unknown);
1}