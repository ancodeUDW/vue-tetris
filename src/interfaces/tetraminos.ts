import {BoardCoordinates, BoardElementValues, tetraminosAngle} from "@/interfaces/board";


export interface TetraminosAngleMultInterface {
    [name: string ]: (blockRelativeCord: BoardCoordinates) => BoardCoordinates;
}

export const tetraminosAngleFunction: TetraminosAngleMultInterface = {
    [tetraminosAngle._0]: (blockRelativeCord: BoardCoordinates): BoardCoordinates => {
        return {
            x: - blockRelativeCord.y,
            y: + blockRelativeCord.x,
            val: BoardElementValues.TETRAMINOS
        }
    },
    [tetraminosAngle._90]:  (blockRelativeCord: BoardCoordinates): BoardCoordinates => {
        return {
            x: - blockRelativeCord.x,
            y: - blockRelativeCord.y,
            val: BoardElementValues.TETRAMINOS
        }
    },
    [tetraminosAngle._180]:  (blockRelativeCord: BoardCoordinates): BoardCoordinates => {
        return {
            x: + blockRelativeCord.y,
            y: - blockRelativeCord.x,
            val: BoardElementValues.TETRAMINOS
        }
    },
    [tetraminosAngle._270]:  (blockRelativeCord: BoardCoordinates): BoardCoordinates => {
        return {
            x: - blockRelativeCord.y,
            y: + blockRelativeCord.x,
            val: BoardElementValues.TETRAMINOS
        }
    },
};

// A tetraminos is defined by 4 squares. The first one is implicit
// the several "el" elements of the interface define the distance they are from the original.
// the class is optional.
export interface Tetraminos {
    el1: BoardCoordinates;
    el2: BoardCoordinates;
    el3: BoardCoordinates;
    class: string;
}
