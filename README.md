# arrng contract package

**A library to implement arrng for verifiable rng in blockchain apps.** aarng implements an oracle to serve signed randomness from random.org to a number of chains, including:

- mainnet
- blessnet
- arbitrum one
- optimism
- polygon
- eth sepolia
- blessnet sepolia

For more details please see https://www.arrng.io/.

## Overview

### [](https://www.npmjs.com/package/@arrng/contracts#installation)Installation

```
$ npm install @arrng/contracts
```

An alternative to npm is to use the GitHub repository (`arrng/arrng-contracts`) to retrieve the contracts.

### Usage

Once installed, you can use arrng by importing the consumer contract and passing in the arrng controller address to your constructor.

Please check https://www.arrng.io/ for the correct address for your chain.

```
pragma solidity ^0.8.0;

import "@arrng/contracts/ArrngConsumer.sol";

contract MyArrngConsumer is ArrngConsumer {
    constructor(address arrngController_) ArrngConsumer(arrngController_) {
    }
}
```

_If you're new to smart contract development, we recommend heading to openzeppelin for a great guide to [Developing Smart Contracts](https://docs.openzeppelin.com/learn/developing-smart-contracts), to learn about creating a new project and compiling your contracts._

To request randomness from arrng (for example one number):

```
iD = arrngController.requestRandomWords {value: msg.value} (1);
```

The `iD` returned is a `uint256` which uniquely identifies your request on that chain. You will need to send enough native token (e.g. ETH) for the response with the random number. This is served by api.arrng.io. See https://www.arrng.io/ for details.

The arrng oracle will wait for six confirmations before responding. To receive the response and use it in your contract you will need to include the `fullfillRandomWords` internal function.
