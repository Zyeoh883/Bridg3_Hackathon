import express, { Request, Response } from 'express'
import multer from 'multer'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { unixfs } from '@helia/unixfs'
import { startHelia, getFileFromIPFS } from './src/ipfs.js'
import { writeLocalFile } from './src/local.js'
import { checkFileType } from './src/validator.js'

// setup for server
const app = express();
const upload = multer({ storage: multer.memoryStorage() })
const port : number = 3000;
const launchdir = path.dirname(fileURLToPath(import.meta.url))

// start helia for ipfs connection
const ipfs_port : number = 8080;
const helia = await startHelia(ipfs_port);
const fs = unixfs(helia);

app.use('/', express.static(path.join(launchdir + '/user')))

// app.use((req : Request, res : Response) => {
	// res.status(404).send(`<h1>Error 404: Request not found</h1>`);
// })

app.post('/download', upload.none(), async (req : Request, res: Response) => {
	const info = await getFileFromIPFS(fs, req.body.filename);
	if (!info[0])
		return (res.status(info[1]).send(info[2]));
	const fileType = checkFileType(info[0])
	if (fileType < 0)
		return (res.status(404).send('Unknown File received from ipfs'));
	const extension = ["JPG", "PNG", "pdf"]
	writeLocalFile(info[0], path.join('test_files/' + req.body.filename + "." + extension[fileType]));
	res.status(info[1]).send(info[2]);
})

app.listen(port, () => {
	console.log(`App is listening on http://localhost:${port}`)
})
