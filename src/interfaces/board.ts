import {Commit, Dispatch} from "vuex";
import {Tetraminos} from "@/interfaces/tetraminos";

export enum tetraminosAngle {
    "_0" = "_0",
    "_90" = "_90",
    "_180" = "_180",
    "_270" = "_270",
}

export enum BoardElementValues {
    TETRAMINOS = "TETRAMINOS",
    FILLED = "FILLED",
    EMPTY = "EMPTY",
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
    currentTetraminosCoordinates: BoardCoordinates;
    currentTetraminosAngle: tetraminosAngle;
    nextTetraminos: Tetraminos[];
    score: number;
}

export interface ActionsSignature<T> {
    commit: Commit;
    dispatch: Dispatch;
    state: T;
}

export interface BoardCoordinates {
    x: number;
    y: number;
    val: BoardElementValues;
}


