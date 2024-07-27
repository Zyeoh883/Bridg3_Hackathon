import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';

// Initialize the SuiClient for the testnet
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Your wallet's private key (keep this secret!)
const privateKey = 'your_base64_private_key'; // Replace with your base64 private key
const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKey));
const signer = new RawSigner(keypair, client);

async function callCreateFunction(packageObjectId, cid) {
    // Fetch the address of the keypair
    const address = keypair.getPublicKey().toSuiAddress();

    // Get coins owned by the address to use as gas
    const coins = await client.getCoins(address);
    console.log('Coins:', coins);
    if (coins.data.length === 0) {
        throw new Error('No coins available to pay for gas');
    }

    // Use the first coin as the gas payment
    const gasObjectId = coins.data[0].objectId;
    console.log('Using gas object:', gasObjectId);

    const tx = new TransactionBlock();

    // Call the create function
    tx.moveCall({
        target: `${packageObjectId}::hash_value::create`,
        arguments: [tx.pure(cid)], // The cid argument
    });

    // Specify the gas payment and budget
    tx.setGasPayment(gasObjectId);
    tx.setGasBudget(1000000); // Adjust as needed

    // Sign and execute the transaction
    const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
    });

    console.log('Transaction result:', result);
    return result;
}

// Usage
const packageObjectId = '0xf052e783181fb7cffa5bb2719e1b792a4f53d4c0ccc27f840e3afa2bdb5dbb20'; // Replace with your package object ID
const cid = 12345; // Replace with the actual cid you want to use

callCreateFunction(packageObjectId, cid)
    .then(result => console.log('Hash created successfully'))
    .catch(error => console.error('Error creating hash:', error));
