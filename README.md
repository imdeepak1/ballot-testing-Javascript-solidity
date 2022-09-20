Building a voting ballot application with 4 NFL Teams such that there is a chairperson who is authorized to register voters. Voters have the permission to vote only after the registration process.

The smart contract used is based on the example in solidity docs

Business Logics handled


Chairperson registers accounts to vote
No other account can register accounts to vote
One can't register already registered user
Unregistered account can't vote
Registered accounts cannot vote twice
Can't vote a person who is not there


Prerequisite

NodeJs
Metamask (3.14.1)
Truffle (v4.0.4)


Instruction for truffle testing

Clone the repository to a local folder
Go to the cloned folder using command line
Execute truffle compile
Open a new command line and execute truffle develop to start the blockchain network
In the old terminal execute truffle migrate --reset
Execute truffle test