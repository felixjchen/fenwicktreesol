import { expect } from "chai";
import { ethers } from "hardhat";
import type { FenwickTree } from "../typechain";
import * as FenwickTreeTS from "./FenwickTree";

const range = (start: number, end: number) => {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
};

const getPrefixSum = (A: number[]) => {
  const prefixSum: number[] = [];
  for (let i = 0; i < A.length; i++) {
    if (i === 0) {
      prefixSum.push(A[i]);
    } else {
      prefixSum.push(prefixSum[i - 1] + A[i]);
    }
  }
  return prefixSum;
};

describe("FenwickTree", function () {
  const A = [1, 5, -1, 0, 5];
  let fenwickTree: FenwickTreeTS.FenwickTree;

  this.beforeEach(async () => {
    fenwickTree = new FenwickTreeTS.FenwickTree(A);
  });

  it("Should have an accurate internal representation", async () => {
    expect(fenwickTree.fenwick).to.eql([0, 1, 6, -1, 5, 5]);
  });

  it("Should match a naive prefix sum on A", async () => {
    const fenwickPrefixSum = range(1, 6).map((i) => fenwickTree.query(i));
    const prefixSum = getPrefixSum(A);
    expect(fenwickPrefixSum).to.eql(prefixSum);
  });

  it("Should let me update any index", async () => {
    // Update array and fenwick tree
    const B = [...A];
    B[1] -= 3;
    fenwickTree.update(1 + 1, -3); // update is 1-indexed

    // Check match
    const fenwickPrefixSum = range(1, 6).map((i) => fenwickTree.query(i));
    const prefixSum = getPrefixSum(B);
    expect(fenwickPrefixSum).to.eql(prefixSum);
  });
});

describe("FenwickTreeContract", function () {
  const A = [1, 5, 2, 0, 5];
  const fenwickTree = new FenwickTreeTS.FenwickTree(A);

  let fenwickTreeContract: FenwickTree;
  const getFenwickTreeContractPrefixSum = async () => {
    const prefixSum = [];
    for (const i of range(0, A.length)) {
      prefixSum.push((await fenwickTreeContract.query(i + 1)).toNumber());
    }
    return prefixSum;
  };

  this.beforeEach(async () => {
    const FenwickTreeFactory = await ethers.getContractFactory("FenwickTree");
    fenwickTreeContract = await FenwickTreeFactory.deploy(fenwickTree.fenwick);
    await fenwickTreeContract.deployed();
  });

  it("Should have an accurate internal representation", async () => {
    expect(fenwickTree.fenwick).to.eql([0, 1, 6, 2, 8, 5]);
  });

  it("Should match a naive prefix sum on A", async () => {
    const contractPrefixSum = await getFenwickTreeContractPrefixSum();
    const prefixSum = getPrefixSum(A);
    expect(contractPrefixSum).to.eql(prefixSum);
  });

  it("Should let me update any index", async () => {
    // Update array and fenwick tree
    const B = [...A];
    B[1] += 3;
    await fenwickTreeContract.update(1 + 1, 3); // update is 1-indexed

    const contractPrefixSum = await getFenwickTreeContractPrefixSum();
    const prefixSum = getPrefixSum(B);
    expect(contractPrefixSum).to.eql(prefixSum);
  });
});
