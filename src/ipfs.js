import { createHelia } from 'helia';
import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { bootstrap } from '@libp2p/bootstrap';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';
import { CID } from 'multiformats/cid';
import { join } from 'path';
import { createAsyncIterableWithTimeout, TimeoutError } from './timeout.js';
import { logtext } from './local.js';
export async function startHelia(config = {}) {
    const blockstore = new MemoryBlockstore();
    const datastore = new MemoryDatastore();
    const bootstrapList = [
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
    ];
    const libp2p = await createLibp2p({
        addresses: {
            listen: [
                '/ip4/127.0.0.1/tcp/0',
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
        peerDiscovery: [
            bootstrap({
                list: bootstrapList
            })
        ],
        datastore,
        ...config
    });
    const helia = await createHelia({
        libp2p,
        blockstore,
        datastore,
        start: true
    });
    return (helia);
}
// dont know how to handle error if addBytes failed lulz
export async function uploadToIPFS(fs, data) {
    return (fs.addBytes(data));
}
export async function getFileFromIPFS(fs, cid) {
    const filePath = join('downloads/' + cid);
    try {
        const cid_ = CID.parse(cid);
        const chunks = createAsyncIterableWithTimeout(fs.cat(cid_), 10000);
        let text_list = [];
        for await (const chunk of chunks) {
            text_list.push(chunk);
        }
        const data = new Uint8Array(text_list.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of text_list) {
            data.set(chunk, offset);
            offset += chunk.length;
        }
        return ([data, 201, "File sucessfully loaded"]);
    }
    catch (err) {
        if (err instanceof TimeoutError)
            return ([null, 404, "File Not Found"]);
    }
    return ([null, 502, "Unknown error"]);
}
export function getLibp2pInfo(helia) {
    return ([helia.libp2p.peerId, helia.libp2p.getMultiaddrs()]);
}
export function logLibp2pInfo(helia, logfile) {
    logtext(`helia libp2p id is ${helia.libp2p.peerId.toString()}`, logfile);
    helia.libp2p.getMultiaddrs().forEach((addr) => {
        logtext(`connected to ${addr.toString()}`, logfile);
    });
}
