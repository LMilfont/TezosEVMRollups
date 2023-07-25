# TezosEVMRollups on Tezos Ghostnet

Very early results of Tezos EVM Rollups experimenting with Ethers.js and Web3.js libraries.
Tezos EVM Rollups are intended to run Ethereum code in the Tezos blockchain infrastructure.

# Requirements

* NodeJS
* Ethers.js   (must be version 5.7.2)
* Web3.js
* Ethereumjs-tx

# Tezos Requirements

Please first read Nomadic Labs' tutorial in order to be able to use Tezos EVM Rollups on Ghostnet: https://research-development.nomadic-labs.com/evm-tezos-testnet.html

# Specifics

There are two folders, one for Ether.js and the other for Web3.js

# Dependencies installation for Ethers.js:

npm install ethers@5.7.2  
npm install ethereumjs-tx  
npm install  
  
Then run with: "node transfer.js"  


# Dependencies installation for Web3.js:

npm install web3@4.0.3  
npm install solc  
npm install fs  

Then run with: "node transfer.js"  
               "node deployContract.js"  


# Operation results:

Check operation results with specific Tezos EVM Rollup block explorer: 
https://explorer.ghostnet-evm.tzalpha.net/




