import fs from 'fs';
import { join } from 'path';
export function logtext(text, logfile) {
    fs.appendFileSync(logfile, join(text + '\n'), { 'flag': 'a+' });
}
export function writeLocalFile(text, filepath) {
    fs.writeFileSync(filepath, text, { 'flag': 'w' });
}
