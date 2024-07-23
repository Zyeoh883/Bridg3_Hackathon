import fs from 'fs';
import * as path from 'path';
export function logtext(text, logfile) {
    fs.appendFileSync(logfile, path.join(text + '\n'), { 'flag': 'a+' });
}
export function writeLocalFile(text, filepath) {
    fs.writeFileSync(filepath, text, { 'flag': 'w' });
}
