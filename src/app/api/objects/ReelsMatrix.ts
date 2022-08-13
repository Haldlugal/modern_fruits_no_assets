type ReelsMatrixRow = [ number, number, number ];

class ReelsMatrix {
    private readonly matrix: number[][];
    constructor(matrix: number[][]) {
        this.matrix = matrix;
    }
    all(): number[][] {
        return this.matrix;
    }
    reel(reelIndex: number): ReelsMatrixRow {
        return this.matrix.map((line: number[]) => line[reelIndex]) as ReelsMatrixRow;
    }

    isValid(): boolean {
        for (let i = 0; i < this.matrix.length; i++) {
            const line = this.matrix[i];
            if (!Array.isArray(line)) {
                return false;
            } else {
              for (let t = 0; t < line.length; t++) {
                if (!(line[t] ===0 || line[t])){
                  return false;
                }
              }
            }
        }

        return true;
    }
}
