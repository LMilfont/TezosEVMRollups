
/**********************************************************/    
/*                                                        */
/*    Title       : Experimenting with Tezos EVM Rollups  */
/*    Framework   : NodeJS and Ethers.js                  */
/*    Author      : Luiz Milfont                          */    
/*    Data        : 25/07/2023                            */
/*    Target      : Tezos Ghostnet EVM                    */
/*    Version     : Alpha                                 */
/*    Description : Interacts with TACO ERC-20 token      */
/*                  calling transfer method               */
/*                                                        */
/**********************************************************/

// Disclaimer : This code might still have intermitent results due
//              to a difference in how operation hash is calculated
//              by evm.ghostnet-evm.tzalpha.net. Sometimes the
//              send operation will work, other times won't. 

// Import the EthersJS library.
const { ethers, Wallet, utils } = require("ethers");

const callContract = async function () 
{
    try 
    {
        // Define Tezos Ghostnet EVM rollup as provider.
        const url = 'https://evm.ghostnet-evm.tzalpha.net';
        const provider = new ethers.providers.JsonRpcProvider(url);

        // In Ethereum you have to previously know the contract's entrypoints.
        const abi = [
            // Read-Only Functions
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",

            // Authenticated Functions
            "function transfer(address to, uint amount) returns (bool)",

            // Events
            "event Transfer(address indexed from, address indexed to, uint amount)"
        ];

        // My wallet accounts. Will transfer TACO ERC-20 token from one to another.
        const fromAddress = '0xeD2956e002FD35a069eCDB9e9b870648f11f202a';
        const toAddress = '0x21C2bc9374F5A1739504d2315b489F1ac2eb350a';
 
        // TACO token contract address.
        const tokenContract = "0x4A0225335fBBE8dC67F4487992df5d966a932575";

        // Signer. This will be used to... sign operations. Insert your own private key here.
        const signer = new ethers.Wallet('0x[yourWalletPrivateKeyHere]', provider);

        // "erc20" variable will be our contract instance.
        const erc20 = new ethers.Contract(tokenContract, abi, provider);

        // Here we get information about our token, from the blockchain.
        const symbol = await erc20.symbol();
        const decimals = await erc20.decimals();
        const balanceOf = await erc20.balanceOf(signer.getAddress());
        const myBalance = balanceOf / (10 ** decimals);

        // Output to screen...
        console.log('Symbol    : ' + symbol);
        console.log('Decimals  : ' + decimals);
        console.log('Balance   : ' +  myBalance);

       
        // Now lets send 01 TACO token.
        console.log('\nTransfering 1 TACO token...');

        // Define and parse token amount.
        const amount = ethers.utils.parseUnits("1.0", decimals);

        // Define the data parameter (will be used inside the transaction object).
        const data = erc20.interface.encodeFunctionData("transfer", [toAddress, amount] )

        // Create and send the transaction object. 
        const tx = await signer.sendTransaction({
            to: tokenContract,     // address of TACO contract.
            from: signer.address,  // address of sender.
            value: ethers.utils.parseUnits("0.000", "ether"),
            data: data  
            });


        // Waiting for the transaction to be completed...
        const receipt = await tx.wait();

        console.log(receipt);

    }
    catch (error)
    {
        console.log("Error when calling contract.");
        console.log(error);
    }
};
 
callContract();