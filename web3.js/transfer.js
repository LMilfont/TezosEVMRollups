
/**********************************************************/    
/*                                                        */
/*    Title       : Experimenting with Tezos EVM Rollups  */
/*    Framework   : NodeJS and Web3.js                    */
/*    Author      : Luiz Milfont                          */    
/*    Data        : 25/07/2023                            */
/*    Target      : Tezos Ghostnet EVM                    */
/*    Version     : Alpha                                 */
/*    Description : Interacts with TACO ERC-20 token      */
/*                  calling transfer method               */
/*                                                        */
/**********************************************************/

// Import the Web3 library.
const { Web3 } = require("web3");

const callContract = async function () 
{
    try 
    {
        // Define Tezos Ghostnet EVM rollup as provider.
        const url = 'https://evm.ghostnet-evm.tzalpha.net';
        var web3 = new Web3(url);

        // In Ethereum you have to previously know the contract's entrypoints.
        const abi = [
            {
              "constant": true,
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "name": "",
                  "type": "string"
                }
              ],
              "payable": false,
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "name": "",
                  "type": "uint8"
                }
              ],
              "payable": false,
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "_owner",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "name": "balance",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "name": "",
                  "type": "string"
                }
              ],
              "payable": false,
              "type": "function"
            },
            // transfer
            {
                'constant': false,
                'inputs': [
                    {
                        'name': '_to',
                        'type': 'address'
                    },
                    {
                        'name': '_value',
                        'type': 'uint256'
                    }
                ],
                'name': 'transfer',
                'outputs': [
                    {
                        'name': '',
                        'type': 'bool'
                    }
                ],
                'type': 'function'
            }          
        ];

        // My wallet accounts. Will transfer TACO ERC-20 token from one to another.
        const fromAddress = '0xeD2956e002FD35a069eCDB9e9b870648f11f202a';
        const toAddress = '0x21C2bc9374F5A1739504d2315b489F1ac2eb350a';
 
        // TACO token contract address.
        const tokenContract = "0x4A0225335fBBE8dC67F4487992df5d966a932575";

        // Secret key used to sign operations. Insert your own private key here.
        const sk = '0x[yourWalletPrivateKeyHere]';

        // "erc20" variable will be our contract instance.
        const erc20 = new web3.eth.Contract(abi, tokenContract, { from: fromAddress } );
 
        // Here we get information about our token, from the blockchain.
        const symbol = await erc20.methods.symbol().call();
        const decimals = await erc20.methods.decimals().call();
        const name = await erc20.methods.name().call();
        const balanceOf = await erc20.methods.balanceOf(fromAddress).call();
        const myBalance = parseInt(balanceOf.toString()) / Math.pow(10, parseInt(decimals.toString()));

        // Output to screen...
        console.log('Symbol    : ' + symbol);
        console.log('Decimals  : ' + decimals);
        console.log('Name      : ' + name);
        console.log('Balance   : ' + myBalance);
       
        // Now lets send 01 TACO token.
        console.log('\nTransfering 1 TACO token...');

        // Define and parse token amount.
        let amount = 1;
        let tokenAmount = web3.utils.toWei(amount.toString(), 'ether');

        // Define the data parameter (will be used inside the transaction object).
        let data = erc20.methods.transfer(toAddress, tokenAmount).encodeABI()

        // Create transaction object. 
        let tx = {
            gas: 22000,
            value: "0x00",
            data: data,
            from: fromAddress,
            to: tokenContract,
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
        console.log("Error when calling contract.");
        console.log(error);
    }
};
 
callContract();

