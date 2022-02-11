//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FenwickTree {
    uint256[] public fenwick;

    // Takes a fenwick representation constructed off-chain
    constructor(uint256[] memory _fenwick) {
        fenwick = _fenwick;
    }

    function lsb(uint256 i) public pure returns (uint256) {
        // "i & (-i)"
        return
            i &
            ((i ^
                0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff) +
                1);
    }

    function query(uint256 i) public view returns (uint256 res) {
        while (i > 0) {
            res += fenwick[i];
            i -= lsb(i);
        }
    }

    function update(uint256 i, uint256 diff) public {
        uint256 fenwickLength = fenwick.length;
        while (i < fenwickLength) {
            fenwick[i] += diff;
            i += lsb(i);
        }
    }
}
