import fs from 'fs'
import { join } from 'path'

export function logtext( text: string, logfile: string ): void {
	fs.appendFileSync(logfile, join(text + '\n'), { 'flag': 'a+' });
}

export function writeLocalFile( text: Uint8Array, filepath: string ): void {
	fs.writeFileSync(filepath, text, { 'flag' : 'w' });
}
