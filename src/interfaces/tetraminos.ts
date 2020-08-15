import {BoardCoordinates, BoardElementValues, tetraminosAngle} from "@/interfaces/board";


export interface TetraminosAngleMultInterface {
    [name: string ]: BoardCoordinates;
}

export const tetraminosAngleMultiplier: TetraminosAngleMultInterface = {
    [tetraminosAngle._0]: {x: 1, y: 1, val: BoardElementValues.TETRAMINOS},
    [tetraminosAngle._90]: {x: -1, y: 1, val: BoardElementValues.TETRAMINOS},
    [tetraminosAngle._180]: {x: -1, y: -1, val: BoardElementValues.TETRAMINOS},
    [tetraminosAngle._270]: {x: 1, y: -1, val: BoardElementValues.TETRAMINOS},
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
