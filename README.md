### Description

Fenwick Tree in Solidity with log(n) update and query to calculate prefix sums.

Supported by TypeScript package [feenwicktreejs](https://www.npmjs.com/package/fenwicktreejs).

### Usage

The underlying array should be computed off-chain to save gas.

```js
import * as fenwicktreejs from "fenwicktreejs";
const fenwickTree = new fenwicktreejs.FenwickTree([1, 5, 2, 0, 5]);
console.log(fenwickTree.fenwick); // [ 0, 1, 6, 2, 8, 5 ]
```

Use the underlying array on-chain when intializing the Fenwick tree.

```solidty
pragma solidity >=0.7.0 <0.9.0;

import "fenwicktreesol/contracts/FenwickTree.sol";
import "hardhat/console.sol";

contract FenwickTreeConsumer {
    function logPrefixSum() public {
        // Create Fenwick tree for [1, 5, 2, 0, 5]
        uint256[] memory fenwicktreeArray = new uint256[](6);
        fenwicktreeArray[0] = 0;
        fenwicktreeArray[1] = 1;
        fenwicktreeArray[2] = 6;
        fenwicktreeArray[3] = 2;
        fenwicktreeArray[4] = 8;
        fenwicktreeArray[5] = 5;
        FenwickTree fenwicktree = new FenwickTree(fenwicktreeArray);
        // Print prefix sum for [1, 5, 2, 0, 5]
        console.log(fenwicktree.query(1)); // 1
        console.log(fenwicktree.query(2)); // 6
        console.log(fenwicktree.query(3)); // 8
        console.log(fenwicktree.query(4)); // 8
        console.log(fenwicktree.query(5)); // 13

        // Update Fenwick tree to [10, 5, 2, 0, 5]
        fenwicktree.update(1, 9);
        // Print prefix sum for [10, 5, 2, 0, 5]
        console.log(fenwicktree.query(1)); // 10
        console.log(fenwicktree.query(2)); // 15
        console.log(fenwicktree.query(3)); // 17
        console.log(fenwicktree.query(4)); // 17
        console.log(fenwicktree.query(5)); // 22
    }
}
```

### Note

- query(i) is 1-indexed
- update(i, diff) is 1-indexed
- updateSub(i, diff) is 1-indexed

### Source

- [Igor Carpanese](https://medium.com/carpanese/a-visual-introduction-to-fenwick-tree-89b82cac5b3c)
