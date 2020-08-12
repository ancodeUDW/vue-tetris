import {Commit, Dispatch} from "vuex";

export interface BoardElement {
    val: boolean;
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
}

export interface ActionsSignature<T> {
    commit: Commit;
    dispatch: Dispatch;
    state: T;
}

export interface BoardCoordinates {
    x: number,
    y: number,
    val: boolean,
}

