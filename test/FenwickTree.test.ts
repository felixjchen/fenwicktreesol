import { expect } from "chai";
import { ethers } from "hardhat";
import * as fenwicktreejs from "fenwicktreejs";
// eslint-disable-next-line camelcase
import { FenwickTree, FenwickTree__factory } from "../typechain";

const range = (end: number) => {
  return [...Array(end).keys()];
};

const getContractPrefixSum = async (contract: FenwickTree) => {
  const prefixSum = [];
  // n is 1-indexed
  const n = (await contract.n()).toNumber() - 1;
  for (const i of range(n)) {
    prefixSum.push((await contract.query(i + 1)).toNumber());
  }
  return prefixSum;
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

describe("FenwickTreeContract", function () {
  const A = [1, 5, 2, 0, 5];
  const fenwickTree = new fenwicktreejs.FenwickTree(A);
  const fenwickTreeArray = fenwickTree.fenwick;

  // eslint-disable-next-line camelcase
  let FenwickTreeFactory: FenwickTree__factory;
  let fenwickTreeContract: FenwickTree;
  this.beforeEach(async () => {
    FenwickTreeFactory = await ethers.getContractFactory("FenwickTree");
    fenwickTreeContract = await FenwickTreeFactory.deploy(fenwickTreeArray);
    await fenwickTreeContract.deployed();
  });

  it("Should have an accurate internal representation", async () => {
    expect(fenwickTree.fenwick).to.eql([0, 1, 6, 2, 8, 5]);
  });

  it("Should match a naive prefix sum on A", async () => {
    const contractPrefixSum = await getContractPrefixSum(fenwickTreeContract);
    const prefixSum = getPrefixSum(A);
    expect(contractPrefixSum).to.eql(prefixSum);
  });

  it("Should let me update any index", async () => {
    // Update array and fenwick tree
    const B = [...A];
    B[1] += 3;
    await fenwickTreeContract.update(1 + 1, 3); // update is 1-indexed

    const contractPrefixSum = await getContractPrefixSum(fenwickTreeContract);
    const prefixSum = getPrefixSum(B);
    expect(contractPrefixSum).to.eql(prefixSum);
  });

  it("Should let me create a prefix sum with 350 elements", async () => {
    const A = range(350);
    const fenwickTree = new fenwicktreejs.FenwickTree(A);
    const fenwickTreeArray = fenwickTree.fenwick;
    fenwickTreeContract = await FenwickTreeFactory.deploy(fenwickTreeArray);
    await fenwickTreeContract.deployed();

    const contractPrefixSum = await getContractPrefixSum(fenwickTreeContract);
    const prefixSum = getPrefixSum(A);
    expect(contractPrefixSum).to.eql(prefixSum);
  });
});
