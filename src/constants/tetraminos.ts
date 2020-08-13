import {BoardElementValues} from "@/interfaces/board";
import {Tetraminos} from "@/interfaces/tetraminos";

export const T_TETRAMINOS = (): Tetraminos => ({
    el1: { x: 0, y: 1, val: BoardElementValues.TETRAMINOS},
    el2: { x: 0, y: 2, val: BoardElementValues.TETRAMINOS},
    el3: { x: 1, y: 1, val: BoardElementValues.TETRAMINOS},
    class: 'tetraminos-l'
});

export const I_TETRAMINOS = (): Tetraminos => ({
    el1: { x: 0, y: 1, val: BoardElementValues.TETRAMINOS},
    el2: { x: 0, y: 2, val: BoardElementValues.TETRAMINOS},
    el3: { x: 0, y: 3, val: BoardElementValues.TETRAMINOS},
    class: 'tetraminos-i'
});

export const O_TETRAMINOS = (): Tetraminos => ({
    el1: { x: 1, y: 0, val: BoardElementValues.TETRAMINOS},
    el2: { x: 1, y: 1, val: BoardElementValues.TETRAMINOS},
    el3: { x: 0, y: 1, val: BoardElementValues.TETRAMINOS},
    class: 'tetraminos-o'
});

export const S_TETRAMINOS = (): Tetraminos => ({
    el1: { x: 0, y: 1, val: BoardElementValues.TETRAMINOS},
    el2: { x: 1, y: 1, val: BoardElementValues.TETRAMINOS},
    el3: { x: 1, y: 2, val: BoardElementValues.TETRAMINOS},
    class: 'tetraminos-s'
});

export const A_TETRAMINOS = (): Tetraminos => ({
    el1: { x: 0, y: 1, val: BoardElementValues.TETRAMINOS},
    el2: { x: -1, y: 1, val: BoardElementValues.TETRAMINOS},
    el3: { x: -1, y: 2, val: BoardElementValues.TETRAMINOS},
    class: 'tetraminos-a'
});

const tetraminosList = [
    T_TETRAMINOS,
    I_TETRAMINOS,
    O_TETRAMINOS,
    S_TETRAMINOS,
    A_TETRAMINOS,
];

let i = -1;

export const getAnotherTetraminos = (): Tetraminos => {
    i = i + 1;
    if (i >= tetraminosList.length) {
        i = 0;
    }
    return tetraminosList[i]();
};

