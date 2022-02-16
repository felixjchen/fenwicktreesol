//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract FenwickTree {
    uint256[] public fenwick;
    uint256 public n;

    // Takes a fenwick representation constructed off-chain
    constructor(uint256[] memory _fenwick) {
        fenwick = _fenwick;
        n = _fenwick.length;
    }

    // Least significant bit
    function lsb(uint256 i) public pure returns (uint256) {
        // "i & (-i)"
        return
            i &
            ((i ^
                0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff) +
                1);
    }

    // 1-indexed
    function query(uint256 i) public view returns (uint256 res) {
        while (i > 0) {
            res += fenwick[i];
            i -= lsb(i);
        }
    }

    // 1-indexed
    function update(uint256 i, uint256 diff) public {
        while (i < n) {
            fenwick[i] += diff;
            i += lsb(i);
        }
    }

    // Need this since diff cannot be negative
    // 1-indexed
    function updateSub(uint256 i, uint256 diff) public {
        while (i < n) {
            fenwick[i] -= diff;
            i += lsb(i);
        }
    }
}
