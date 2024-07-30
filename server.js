import express from "express";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { unixfs } from "@helia/unixfs";
import { startHelia, uploadToIPFS, getFileFromIPFS } from "./src/ipfs.js";
import { logtext, writeLocalFile } from "./src/local.js";
import { checkFileType } from "./src/validator.js";
// setup for server
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = 6969;
const launchdir = join(dirname(fileURLToPath(import.meta.url)));
// start helia for ipfs connection
const helia = await startHelia();
const fs = unixfs(helia);
const logfile = "log.js";
app.use("/", express.static(join(launchdir)));
app.get("/upload", (req, res) => {
  res.sendFile(join(launchdir, "/upload_files.html"));
});
app.get("/about.html", (req, res) => {
  res.sendFile(join(launchdir, "/about.html"));
});
app.get("/test", (req, rep) => {
  rep.status(201).send(JSON.stringify(cidArray));
});
// app.get('/issuer', (req: Request, res: Response) => {
// 	res.sendFile(join(launchdir, '/issuer.html'));
// });
app.post("/upload", upload.any(), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No file uploaded to server.");
  }
  let check = true;
  let cida = null;
  for (const file of req.files) {
    const filetype = checkFileType(file.buffer);
    if (filetype < 0) {
      check = false;
      continue;
    }
    const cid = await uploadToIPFS(fs, file.buffer);
    if (!cida) cida = cid;
    const currentDate = new Date().toISOString().split("T")[0];
    logtext(
      `export let ${cid.toString()} = "${file.originalname
        .replace(/\.[^/.]+$/, "") // Remove the file extension
        .replace(/[^a-zA-Z]/g, "")}";
   export let ${cid.toString()}date = "${currentDate}";`,
      logfile
    );
  }
  if (check == false)
    return res.status(404).send(`Some Files have unideftiable format`);
  res.status(201).send(`All files sucessfully added as ${cida.toString()}`); // ${req.file.originalname}  cid: ${cid.toString()}`);
});
app.post("/download", upload.none(), async (req, res) => {
  if (!req.body) {
    return res.status(404).send("No CID received");
  }
  const info = await getFileFromIPFS(fs, req.body.filename);
  if (!info[0]) {
    return res.status(info[1]).send(info[2]);
  }
  const fileType = checkFileType(info[0]);
  if (fileType < 0) {
    return res.status(404).send("Unknown File received from ipfs");
  }
  const extension = ["JPG", "PNG", "pdf"];
  writeLocalFile(
    info[0],
    join("test_files/" + req.body.filename + "." + extension[fileType])
  );
  res.status(info[1]).send(info[2]);
});
app.use((req, res) => {
  res.status(404).send(`<h1>Error 404: Request not found</h1>`);
});
app.listen(port, async () => {
  console.log(`App is ready and listening on http://localhost:${port}`);
});
process.on("SIGINT", () => {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  helia.stop();
  process.exit();
});

async function handleFileUpload(file) {
  cidArray.push(file);
}
