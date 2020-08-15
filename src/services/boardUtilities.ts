import {BoardCoordinates, BoardElement, BoardElementValues, BoardFile, BoardStore} from "@/interfaces/board";
import * as R from "ramda";

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

export const isBottomCollision = (state: BoardStore, arrayOfCoordinates: BoardCoordinates[]): boolean => {
    // we should filter the coordinates that belong to a tetraminos
    const boardHeight = getBoardHeight(state);
    const isNotEmpty = (cord: BoardCoordinates) => {

        console.log("is bottom colision",
            {
                yFactor: cord.y >= boardHeight,
                y: cord.y,
                boardHeight,
                // val: getBoardElement(state, cord.y, cord.x).val
            }
        );


        const res = cord.y >= boardHeight || getBoardElement(state, cord.y, cord.x).val
        === BoardElementValues.FILLED;



        return res;
    };
    return R.any(isNotEmpty , arrayOfCoordinates);
};
