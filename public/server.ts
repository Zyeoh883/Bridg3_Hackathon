import express, { Request, Response } from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { unixfs } from "@helia/unixfs";
import { CID } from "multiformats";
import { startHelia, getFileFromIPFS, uploadToIPFS } from "../src/ipfs.js";
import {
  writeLocalFile,
  logtext,
  bundle_file,
  decodeQR,
} from "../src/local.js";
import { checkFileType } from "../src/validator.js";

// setup for server
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port: string = process.env.PORT || "5000";
const launchdir = dirname(fileURLToPath(import.meta.url));

// start helia for ipfs connection
const helia = await startHelia();
const fs = unixfs(helia);
const logfile = "public/log.txt";

export interface Account {
  name: string;
}

let acc: Account = { name: "Sunway University" };

app.use("/", express.static(join(launchdir + "/public")));

app.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send(null);
    }
    if (checkFileType(req.file.buffer) < 0) {
      return res.status(404).send(null);
    }
    const file: Uint8Array = await bundle_file(
      acc,
      req.file.buffer,
      req.file.originalname
    );
    const cid: CID = await uploadToIPFS(fs, Buffer.from(file));
    res.status(201).send(cid.toString());
    // logtext(`Added file '${req.file.originalname}' as ${cid.toString()}`, logfile);
  }
);

app.post(
  "/download",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(404).send("No files received");
    }
    if (checkFileType(req.file.buffer) <= 0) {
      return res.status(404).send("Wrong file format given");
    }
    const cid = await decodeQR(Buffer.from(req.file.buffer));
    if (!cid) return res.status(404).send("invalid QRcode");
    const info = await getFileFromIPFS(fs, cid);
    if (!info[0]) return res.status(info[1]).send(info[2]);
    const fileType = checkFileType(info[0]);
    if (fileType != 0)
      return res.status(404).send("Unknown File received from ipfs");
    // const extension = ["JPG", "PNG", "pdf"]
    // writeLocalFile(info[0], join('test_files/' + req.body.filename + "." + extension[fileType]));
    // console.log(info[0].length);
    // writeLocalFile(info[0], 'test.zip');
    const buffer = Buffer.from(info[0]);
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="package.zip"',
      "Content-Length": buffer.length,
    });
    res.status(info[1]).send(buffer);
  }
);

app.use((req: Request, res: Response) => {
  res.status(404).send(`<h1>Error 404: Request not found</h1>`);
});

app.listen(parseInt(port), () => {
  console.log(`App is listening on http://localhost:${port}`);
  // logtext('New server session', logfile);
});

process.on("SIGINT", () => {
  // console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  helia.stop();
  process.exit();
});

export default app;
