import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromB64 } from '@mysten/sui/utils';
import { bcs } from '@mysten/sui/bcs';
import { Transaction } from '@mysten/sui/transactions';


// Initialize the SuiClient
const client = new SuiClient({ url: getFullnodeUrl('devnet') }); // Use appropriate network

// Your wallet's private key (keep this secret!)
const privateKey = 'ru3mnru5jx862g2jnjnzr2ru3hphzttnlzf87tc49mx'; // Replace with your base64 private key
const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKey));

 
async function callCreateFunction(packageObjectId, cid) {
	const tx = new Transaction();

	// const issuer_CID = "0x2e3feeffc9ee961c1d2ef4e3f5514b0ae07e11bb04e981f8e7c68e57feb85f42"

	tx.moveCall({
		target: '${packageObjectId}::CID::create',
		arguments: [
			tx.pure.u64(cid)
		],
	});

	const result = await client.signAndExecuteTransaction({
		signer: keypair,
		transactionBlock: tx,
	});

	console.log('Transaction result:', result);

	const createdObjectId = result.effects.created[0].reference.objectId;


	console.log(objectDetails);
	return objectDetails;
}

const packageObjectId = '0x0ea05b77c4cdffd24b85ad5f47478b2f97fd19fa45c20ab6abf48d300387cdbc'; // Replace with your package object ID
const cid = 12345;

callCreateFunction(packageObjectId, cid);

// // Replace with your wallet's private key
// const privateKeyBase64 = 'suiprivkey1qzxmgrs9chuag3x4ru3mnru5jx862g2jnjnzr2ru3hphzttnlzf87tc49mx';
// const privateKeyFull = fromB64(privateKeyBase64);
// const privateKey = privateKeyFull.slice(0, 32);
// const keypair = Ed25519Keypair.fromSecretKey(privateKey);

// const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// async function callCreateFunction(packageObjectId, cid) {
//   const tx = new TransactionBlock();

// const coins = await client.getCoins({ owner: address });
// console.log(coins);
// if (coins.data.length === 0) {
// throw new Error('No coins available to pay for gas');
// }


// const gasCoin = coins.data[0];

// // tx.setGasPayment(gasCoin.objectId);
// // tx.setGasBudget(100000000); // Example gas budget


//   tx.moveCall({
//     target: `${packageObjectId}::hash_value::create`,
//     arguments: [tx.pure(cid)],
//   });

//   // ... (gas payment and signing logic)

//   const result = await client.signAndExecuteTransactionBlock({
//     signer: keypair,
//     transactionBlock: tx,
//   });

//   console.log('Transaction result:', result);
//   return result;
// }

// const address = '0xf7790e3e637c8d2702ebf9009e4c6e946beb5546c8241ffea9bf8c96282bddfc';
// const packageObjectId = '0x008e366c6b09d99fe7f7c4f9af61fd038409aa3b9121dd08d076bd0e19f14587'; // Replace with your package object ID
// const cid = 12345; // Replace with the actual cid you want to use

// callCreateFunction(packageObjectId, cid)
//     .then(result => console.log('Hash created successfully'))
//     .catch(error => console.error('Error creating hash:', error));

// import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
// import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
// import { fromB64 } from '@mysten/sui/utils';
// import { Transaction } from '@mysten/sui/transactions';

// // Initialize the SuiClient
// const client = new SuiClient({ url: getFullnodeUrl('devnet') }); // Use appropriate network

// // Your wallet's private key (keep this secret!)
// const privateKeyBase64 = 'ru3mnru5jx862g2jnjnzr2ru3hphzttnlzf87tc49mx'; // Replace with your base64 private key
// const privateKeyFull = fromB64(privateKeyBase64);
// const keypair = Ed25519Keypair.fromSecretKey(privateKeyFull.slice(0, 32));

// async function callCreateFunction(packageObjectId, cid) {
//   const tx = new Transaction();

//   // Add the move call to the transaction
//   tx.moveCall({
//     target: `${packageObjectId}::CID::create`,
//     arguments: [tx.pure(cid)],
//   });

//   // Get the coins to use for gas payment
//   const address = keypair.toSuiAddress();
//   const coins = await client.getCoins({ owner: address });

//   if (coins.data.length === 0) {
//     throw new Error('No coins available to pay for gas');
//   }

//   const gasCoin = coins.data[0];

//   // Set gas payment and budget
//   tx.setGasPayment(gasCoin.objectId);
//   tx.setGasBudget(100000000); // Example gas budget

//   // Sign and execute the transaction
//   const result = await client.signAndExecuteTransaction({
//     signer: keypair,
//     transaction: tx,
//   });

//   console.log('Transaction result:', result);

//   // Extract the created object ID from the transaction result
//   const createdObjectId = result.effects.created[0].reference.objectId;

//   // Query for the object's details
//   const objectDetails = await client.getObject(createdObjectId);
//   console.log('Object details:', objectDetails);

//   return objectDetails;
// }

// // Usage
// const packageObjectId = '0x0ea05b77c4cdffd24b85ad5f47478b2f97fd19fa45c20ab6abf48d300387cdbc'; // Replace with your package object ID
// const cid = 12345; // Replace with the actual cid you want to use

// callCreateFunction(packageObjectId, cid)
//   .then(objectDetails => {
//     console.log('Object created successfully:', objectDetails);
//   })
//   .catch(error => console.error('Error creating object:', error));
