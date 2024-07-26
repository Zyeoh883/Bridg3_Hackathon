import express, { Express, Request, Response } from 'express'
import multer, { Multer } from 'multer'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Helia } from 'helia'
import { UnixFS, unixfs } from '@helia/unixfs'
import { CID } from 'multiformats/cid'
import { startHelia, uploadToIPFS, getFileFromIPFS, logLibp2pInfo } from './src/ipfs.js'
import { logtext, writeLocalFile } from './src/local.js'
import { checkFileType } from './src/validator.js'

// setup for server
const app: Express = express();
const upload: Multer = multer({ storage: multer.memoryStorage() })
const port: number = 6969;
const launchdir: string = join(dirname(fileURLToPath(import.meta.url)));

// start helia for ipfs connection
const helia: Helia = await startHelia();
const fs: UnixFS = unixfs(helia);
const logfile: string = 'log.txt';

app.use('/', express.static(join(launchdir)));

app.get('/upload', (req: Request, res: Response) => {
	res.sendFile(join(launchdir, '/upload_files.html'));
});

app.get('/about.html', (req: Request, res: Response) => {
	res.sendFile(join(launchdir, '/about.html'));
});

// app.get('/issuer', (req: Request, res: Response) => {
// 	res.sendFile(join(launchdir, '/issuer.html'));
// });

app.post('/upload', upload.any(), async (req: Request, res: Response) => {
	if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
		return (res.status(400).send('No file uploaded to server.'));
	}
	let check : boolean = true;
	for (const file of (req.files as Express.Multer.File[])) {
		const filetype: number = checkFileType(file.buffer);
		if (filetype < 0) {
			check = false;
			continue ;
		}
		const cid: CID = await uploadToIPFS(fs, file.buffer);
		logtext(`Added file '${file.originalname}' as ${cid.toString()}`, logfile);
	}
	if (check == false)
		return (res.status(404).send(`Some Files have unideftiable format`));
	res.status(201).send(`All files sucessfully added`);// ${req.file.originalname}  cid: ${cid.toString()}`);
});

app.post('/download', upload.none(), async (req : Request, res: Response) => {
	if (!req.body) {
		return (res.status(404).send('No CID received'));
	}
	const info: [Uint8Array | null, number, string] = await getFileFromIPFS(fs, req.body.filename);
	if (!info[0]) {
		return (res.status(info[1]).send(info[2]));
	}
	const fileType = checkFileType(info[0])
	if (fileType < 0) {
		return (res.status(404).send('Unknown File received from ipfs'));
	}
	const extension = ["JPG", "PNG", "pdf"]
	writeLocalFile(info[0], join('test_files/' + req.body.filename + "." + extension[fileType]));
	res.status(info[1]).send(info[2]);
});

app.use((req : Request, res : Response) => {
	res.status(404).send(`<h1>Error 404: Request not found</h1>`);
});

app.listen(port, async() =>  {
	console.log(`App is ready and listening on http://localhost:${port}`);
	logtext('New server session', logfile);
	logLibp2pInfo(helia, logfile);
});

process.on('SIGINT', () => {
	console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	helia.stop();
	process.exit();
});
