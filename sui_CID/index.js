import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';
 
// const MY_ADDRESS = '0xa776400e304f5e76980c4f2faac13a408d111e384e8715e9435099d169373e2f';
// My acc wallet
const MY_ADDRESS = '0xf7790e3e637c8d2702ebf9009e4c6e946beb5546c8241ffea9bf8c96282bddfc'

console.log(getFullnodeUrl('testnet'));
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

async function get_Balance(address) {

	const suiBalance = await suiClient.getBalance({
		owner: address,
	});
	const balance = Number.parseInt(suiBalance.totalBalance) / Number(MIST_PER_SUI);
	console.log(
		`Balance: ${balance}`,
	);
	return balance;
}
// store the JSON representation for the SUI the address owns before using faucet

// Output result to console.
// Replace with the object ID you want to query
const objectId = '0x2f51a355b3f86486d686539ee9e43c740cd3fc4aed0593a0b9f90227426f9cb1';


async function getObjectById(objectId) {
	let cid;

	try {
	  const object = await suiClient.getObject({
		id: objectId,
		options: { showContent: true }
	  });
	  cid = object.data.content.fields.cid;
	  console.log('cid :' + cid);
	  return (cid);
	} catch (error) {
	  console.error('Error fetching object:', error);
	  return (null);
	}
  }

get_Balance(MY_ADDRESS);
getObjectById(objectId);