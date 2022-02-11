export class FenwickTree {
  fenwick: number[];

  constructor(A: number[]) {
    // 1-indexed, 0th element is unused
    this.fenwick = new Array(A.length + 1).fill(0);
    for (let i = 0; i < A.length; i++) {
      // 1-indexed update, 0-indexed A
      this.update(i + 1, A[i]);
    }
  }

  // Least signification bit
  private lsb = (i: number) => i & -i;

  // 1-indexed
  public query = (i: number): number => {
    let res = 0;
    while (i > 0) {
      res += this.fenwick[i];
      i -= this.lsb(i);
    }
    return res;
  };

  // 1-indexed
  public update = (i: number, diff: number): void => {
    while (i < this.fenwick.length) {
      this.fenwick[i] += diff;
      i += this.lsb(i);
    }
  };
}
