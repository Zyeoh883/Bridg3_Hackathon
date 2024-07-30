var FileType;
(function (FileType) {
    FileType[FileType["zip"] = 0] = "zip";
    FileType[FileType["jpeg"] = 1] = "jpeg";
    FileType[FileType["png"] = 2] = "png";
    FileType[FileType["pdf"] = 3] = "pdf";
    FileType[FileType["unknown"] = -1] = "unknown";
})(FileType || (FileType = {}));
export function checkFileType(buffer) {
    // Magic numbers for JPEG, PNG and pdf
    const identifierList = [
        [0x50, 0x4B, 0x03, 0x04],
        [0xFF, 0xD8, 0xFF],
        [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
        [0x25, 0x50, 0x44, 0x46]
    ];
    for (let index = 0; index < identifierList.length; index++) {
        if (buffer.length < identifierList.length) {
            continue;
        }
        if (identifierList[index].every((byte, index) => byte === buffer[index])) {
            return (index);
        }
    }
    return (FileType.unknown);
    1;
}
