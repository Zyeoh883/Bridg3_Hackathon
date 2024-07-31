import { createHelia } from 'helia'
import { UnixFS } from '@helia/unixfs'
import { createLibp2p, Libp2pOptions } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import type { Helia } from '@helia/interface'
import { CID } from 'multiformats/cid'
import { join } from 'path'
import { createAsyncIterableWithTimeout, TimeoutError } from './timeout.js'

export async function startHelia (config: Libp2pOptions = {}): Promise<Helia> {
	const blockstore = new MemoryBlockstore()
	const datastore = new MemoryDatastore()

	const libp2p = await createLibp2p({
		addresses: {
			listen: [
				('/ip4/127.0.0.1/tcp/0')
			]
		},
		transports: [
			tcp()
		],
		connectionEncryption: [
			noise()
		],
		streamMuxers: [
			yamux()
		],
		datastore,
		...config
	});

	const helia = await createHelia({
		libp2p,
		blockstore,
		datastore
	});
	return (helia);
}

// dont know how to handle error if addBytes failed lulz
export async function uploadToIPFS( fs: UnixFS, data: Buffer ) : Promise<CID> {
	return (fs.addBytes(data));
}

export async function getFileFromIPFS( fs: UnixFS, cid: string ) : Promise<[Uint8Array | null, number, string]> {
	// const filePath : string = join('downloads/' + cid);

	try {
		const cid_: CID = CID.parse(cid);
		// console.log('processing cid:', cid.toString());
		const chunks: AsyncIterable<Uint8Array> = createAsyncIterableWithTimeout(fs.cat(cid_), 3000)
		let text_list: Uint8Array[] = [];
		for await(const chunk of chunks) {
			// console.log('iter chunk');
			text_list.push(chunk);
		}
		const data: Uint8Array = new Uint8Array(text_list.reduce((acc, chunk) => acc + chunk.length, 0));
		let offset = 0;
		for (const chunk of text_list) {
			data.set(chunk, offset);
			offset += chunk.length;
			// console.log('process chunk:', chunk.length);
			}
			return ([data, 201, "File sucessfully loaded"]);
		}
	catch (err) {
		if (err instanceof TimeoutError)
			return ([null, 404, "File Not Found"]);
	}
	return ([null, 502, "Unknown error"]);
}
