export class NoiseGenerator {
    constructor () {}

    getUnitVector(angle: number): number[] {
        return [Math.cos(angle), Math.sin(angle)];
    }

    filledGrid (res: number) {
        let grid: number[][][] = [];
        let row: number[][] = [];
        let randAngle: number;
        for (let i = 0; i < res; i++) {
            for (let j = 0; j < res; j++) {
                randAngle = Math.random()*2*Math.PI;
                row.push(this.getUnitVector(randAngle));
            }
            grid.push(row);
            row = [];

        }

        return grid;
    }

    min (mat: number[][]): number {
        let min = mat[0][0];

        mat.forEach((row) => {
            row.forEach((elem) => {
                if (elem < min) {
                    min = elem;
                }
            })
        })

        return min;
    }

    max (mat: number[][]): number {
        let max = mat[0][0];

        mat.forEach((row) => {
            row.forEach((elem) => {
                if (elem > max) {
                    max = elem;
                }
            })
        })

        return max;
    }

    normalizeMatrix (mat: number[][]): number[][] {
        let normalizedMatrix: number[][] = [];
        const min: number = this.min(mat);
        const max: number = this.max(mat);

        mat.forEach((row) => {
            normalizedMatrix.push(row.map((elem) => {
                return ( (elem - min) / (max - min) );
            }))
        });
        return normalizedMatrix;
    }

    /**
     * 
     * @param scale Number of grid points on a single axis
     * @param detail Width of square array in each grid square 
     */
    generate (scale: number, detail: number) {
        let grid: number[][][] = this.filledGrid(scale);
        let nSquares: number = scale-1
        let imgWidth: number = nSquares * detail;
        let img: number[][] = [];

        for (let tinyRow = 0; tinyRow < imgWidth; tinyRow++) {
            let row: number[] = [];
            for (let tinyCol = 0; tinyCol < imgWidth; tinyCol++) {
                const COMOffset = 1/detail/2;
                const pos: number[] = [COMOffset+(tinyCol*1/detail), -(COMOffset+(tinyRow*1/detail))]
                const c0: number[] = [...grid[Math.floor(tinyRow/detail)][Math.floor(tinyCol/detail)], 0,0];
                const c1 = [...grid[Math.floor(tinyRow/detail)][Math.floor(tinyCol/detail)+1], 1,0];
                const c2 = [...grid[Math.floor(tinyRow/detail)+1][Math.floor(tinyCol/detail)], 0, -1];
                const c3 = [...grid[Math.floor(tinyRow/detail)+1][Math.floor(tinyCol/detail)+1], 1, -1];
                const corners = [c0, c1, c2, c3];
                let sum = 0;
                let count = 0;
                corners.forEach((corner) => {
                    const offsetVector: number[] = [pos[0]-corner[2], pos[1]-corner[3]];
                    sum += offsetVector[0]*corner[0] + offsetVector[1]*corner[1];
                    count++;
                })
                row.push(sum/count);

            }
            img.push(row);
        }

        const normalizedMatrix: number[][] = this.normalizeMatrix(img);
        return normalizedMatrix;
    }


}