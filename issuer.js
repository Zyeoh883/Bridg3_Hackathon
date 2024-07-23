import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { unixfs } from '@helia/unixfs';
import multer from 'multer';
import { startHelia, uploadToIPFS } from './src/ipfs.js';
import { logtext } from './src/local.js';
import { checkFileType } from './src/validator.js';
// setup for server
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = 5000;
const launchdir = path.dirname(fileURLToPath(import.meta.url));
// start helia for ipfs connection
const ipfs_port = 8080;
const helia = await startHelia(port);
const fs = unixfs(helia);
const logfile = 'issuer/log.txt';
app.use('/', express.static(path.join(launchdir + '/issuer')));
// app.use((req : Request, res : Response) => {
// 	res.status(404).send(`<h1>Error 404: Request not found</h1>`);
// })
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return (res.status(400).send('No file uploaded.'));
    }
    const filetype = checkFileType(req.file.buffer);
    if (filetype < 0) {
        return (res.status(404).send(`Unidentified File given`));
    }
    const cid = await uploadToIPFS(fs, req.file.buffer);
    // fs.writeFileSync(path.join('uploads/' + req.file.originalname), req.file.buffer, { 'flag': 'w' }); need fs from fs to do this
    res.status(201).send(`File sucessfully added ${req.file.originalname} as cid: ${cid.toString()}`);
    logtext(`Added file '${req.file.originalname}' as ${cid.toString()}`, logfile);
});
app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`);
    logtext('New server session', logfile);
});
