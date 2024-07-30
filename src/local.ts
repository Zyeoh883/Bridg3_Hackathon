import fs from 'fs'
import { join } from 'path'
import JSZip from 'jszip'
import Jimp from 'jimp'
import JsQR from 'jsqr'
import { Account } from '../server';

export function logtext( text : string, logfile : string ) : void {
	fs.appendFileSync(logfile, join(text + '\n'), { 'flag' : 'a+' });
}

export function writeLocalFile( text : Uint8Array, filepath : string ) : void {
	fs.writeFileSync(filepath, text, { 'flag' : 'w' });
}

export async function bundle_file( acc: Account, file: Buffer, name: string ): Promise<Uint8Array> {
	const zip = new JSZip();
	let date: string = new Date().toISOString().split("T")[0];
	let text: string = `Publisher: ${acc.name}\nDate_of_publish: ${date}\nfilename: ${name}`
	// let meta: Blob = new Blob([text], {'type': 'txt'});
	zip.file('meta.txt', text);``
	zip.file(name, file);
	return (zip.generateAsync({'type': 'uint8array'}));
}

export async function decodeQR( file: Buffer ) : Promise<string | undefined> {
	const image = await Jimp.read(file);
	const { data, width, height } = image.bitmap;
	return (JsQR(new Uint8ClampedArray(data.buffer), width, height)?.data);
}
