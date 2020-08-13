import {BoardElement, BoardFile, BoardStore} from "@/interfaces/board";

export const getBoardLine = (state: BoardStore, y: number): BoardFile => {
    return state.board[y];
};

export const getBoardLineVal = (state: BoardStore, y: number): BoardElement[] => {
    return getBoardLine(state, y).val;
};

export const getBoardElement = (state: BoardStore, y: number, x: number): BoardElement => {
    return getBoardLine(state, y).val[x];
};

export const getBoardLineLength = (state: BoardStore, y: number): number => {
    return getBoardLineVal(state, y).length;
};

export const getBoardHeight = (state: BoardStore): number => {
    return state.board.length;
};

