var FileType;
(function (FileType) {
  FileType[(FileType["jpeg"] = 0)] = "jpeg";
  FileType[(FileType["png"] = 1)] = "png";
  FileType[(FileType["pdf"] = 2)] = "pdf";
  FileType[(FileType["zip"] = 3)] = "zip";
  FileType[(FileType["unknown"] = -1)] = "unknown";
})(FileType || (FileType = {}));
export function checkFileType(buffer) {
  // Magic numbers for JPEG, PNG, pdf, zip
  const identifierList = [
    [0xff, 0xd8, 0xff],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    [0x25, 0x50, 0x44, 0x46],
    [0x50, 0x4b, 0x03, 0x04],
  ];
  for (let index = 0; index < identifierList.length; index++) {
    if (buffer.length < identifierList.length) {
      continue;
    }
    if (identifierList[index].every((byte, index) => byte === buffer[index])) {
      return index;
    }
  }
  return FileType.unknown;
  1;
}
