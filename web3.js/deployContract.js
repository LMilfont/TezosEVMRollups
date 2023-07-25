
/**********************************************************/    
/*                                                        */
/*    Title       : Experimenting with Tezos EVM Rollups  */
/*    Framework   : NodeJS and Web3.js                    */
/*    Author      : Luiz Milfont                          */    
/*    Data        : 25/07/2023                            */
/*    Target      : Tezos Ghostnet EVM                    */
/*    Version     : Alpha                                 */
/*    Description : Deploys a simple Solidity contract    */
/*                                                        */
/**********************************************************/


// Import the Web3 library.
const { Web3 } = require("web3");

// Solc compiler
solc = require("solc");

// File reader
fs = require("fs");

const deployContract = async function () 
{
    try 
    {

		// Define Tezos Ghostnet EVM rollup as provider.
		var web3 = new Web3('https://evm.ghostnet-evm.tzalpha.net');

		// Read the smart contract source-code from text file.
		file = fs.readFileSync("initial.sol").toString();

		// Create input object for solidity compiler.
		var input = {
			language: "Solidity",
			sources: {
				"initial.sol": {
					content: file,
				},
			},

			settings: {
				outputSelection: {
					"*": {
						"*": ["*"],
					},
				},
			},
		};

		// Compile smart-contract and store result in "output" variable.
		var output = JSON.parse(solc.compile(JSON.stringify(input)));

		// Extract contract's ABI and Bytecode.
		ABI = output.contracts["initial.sol"]["initial"].abi;
		bytecode = output.contracts["initial.sol"]["initial"].evm.bytecode.object;

		// Define private key and create a account object.
		let sk = '0x[yourWalletPrivateKeyHere]';
		let mainAccount =  web3.eth.accounts.privateKeyToAccount(sk);

		// Create the transaction object. 
		let tx = {
			gas: 22000,
			value: "0x00",
			data: ABI,                                // Contract's ABI.
			from: mainAccount.address,                // fromAccount address.
			gasPrice: await web3.eth.getGasPrice(),
			gasLimit: 3000000
		}

		// Sign the transaction, then send.
		await web3.eth.accounts.signTransaction(tx, sk)
		.then((signedTx) => {
				console.log(signedTx);
				return web3.eth.sendSignedTransaction(signedTx.rawTransaction)
				.then((res) => { console.log(res); })
				.catch((err) => { throw err; })
			})
		.catch((error) => { throw error } );
	
	}
	catch (error)
	{
		console.log("Error when deploying contract.");
		console.log(error);
	}
};

deployContract();
