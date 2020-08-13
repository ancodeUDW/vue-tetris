import {Commit, Dispatch} from "vuex";
import {Tetraminos} from "@/interfaces/tetraminos";

export enum BoardElementValues {
    TETRAMINOS = 0,
    FILLED,
    EMPTY,
}

export interface BoardElement {
    val: BoardElementValues;
    num: number;
    key: string|number;
}

export interface BoardFile {
    key: string|number;
    num: number;
    val: BoardElement[];
}

export interface BoardStore {
    board: BoardFile[];
    currentTetraminos: Tetraminos;
    nextTetraminos: Tetraminos[];
    score: number;
}

export interface ActionsSignature<T> {
    commit: Commit;
    dispatch: Dispatch;
    state: T;
}

export interface BoardCoordinates {
    x: number,
    y: number,
    val: BoardElementValues,
}


