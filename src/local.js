import fs from 'fs';
import { join } from 'path';
import JSZip from 'jszip';
import Jimp from 'jimp';
import JsQR from 'jsqr';
export function logtext(text, logfile) {
    fs.appendFileSync(logfile, join(text + '\n'), { 'flag': 'a+' });
}
export function writeLocalFile(text, filepath) {
    fs.writeFileSync(filepath, text, { 'flag': 'w' });
}
export async function bundle_file(acc, file, name) {
    const zip = new JSZip();
    let date = new Date().toISOString().split("T")[0];
    let text = `Publisher: ${acc.name}\nDate_of_publish: ${date}\nfilename: ${name}`;
    // let meta: Blob = new Blob([text], {'type': 'txt'});
    zip.file('meta.txt', text);
    ``;
    zip.file(name, file);
    return (zip.generateAsync({ 'type': 'uint8array' }));
}
export async function decodeQR(file) {
    const image = await Jimp.read(file);
    const { data, width, height } = image.bitmap;
    return (JsQR(new Uint8ClampedArray(data.buffer), width, height)?.data);
}
