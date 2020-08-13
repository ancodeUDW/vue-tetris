import Vue from 'vue';
import {v4 as uuidv4} from 'uuid';
import {
  ActionsSignature,
  BoardCoordinates,
  BoardElement,
  BoardElementValues,
  BoardFile,
  BoardStore
} from "@/interfaces/board";
import {getBoardElement, getBoardHeight, getBoardLineLength} from "@/services/boardUtilities";
import {Tetraminos} from "@/interfaces/tetraminos";
import {getAnotherTetraminos} from "@/constants/tetraminos";

const nextTetraminos = (): Tetraminos => {
  return {
    el1: { x: 0, y: 1, val: BoardElementValues.TETRAMINOS},
    el2: { x: 0, y: 2, val: BoardElementValues.TETRAMINOS},
    el3: { x: 1, y: 1, val: BoardElementValues.TETRAMINOS},
    class: 'tetraminos-1'
  }
};

const initialState = (): BoardStore => {
  return {
    board: [] as BoardFile[],
    currentTetraminos: nextTetraminos(),
    nextTetraminos: [],
    score: 0,
  };
};

const createFile = (width: number, num: number): BoardFile => {
  const myFile: BoardFile = {
    val: [],
    key: uuidv4(),
    num: num,
  };

  for (let i = 0; i < width; i = i +  1) {
    myFile.val.push({
      val: BoardElementValues.EMPTY,
      key: uuidv4(),
      num: i,
    });
  }

  return myFile
};

const getters = {
  getBoard(state: BoardStore): BoardFile[] {
      return state.board;
  },

  getBoardHeight(state: BoardStore): number {
      return state.board.length;
  },

  getBoardWidth(state: BoardStore): number {
    return state.board.length > 0 ? state.board[0].val.length : 0;
  },
};

const actions = {
  init({commit}: ActionsSignature<BoardStore>,
       {width, height}: {width: number; height: number}) {

    const board: BoardFile[] = [];

    for (let i = 0; i < height; i = i +  1) {
        board.push(createFile(width, i));
    }

    commit('init', board);
  },

  inputTetraminos({dispatch, state}: ActionsSignature<BoardStore>) {
      // const myTetraminos = nextTetraminos();
      const myTetraminos = getAnotherTetraminos();

      const originalTetraminos: BoardCoordinates = {
        x: Math.abs(getters.getBoardWidth(state) / 2),
        y: 1,
        val: BoardElementValues.TETRAMINOS,
      };

      const el1: BoardCoordinates = {
        x: originalTetraminos.x + myTetraminos.el1.x,
        y: originalTetraminos.y + myTetraminos.el1.y,
        val: BoardElementValues.TETRAMINOS,
      };

      const el2: BoardCoordinates = {
        x: originalTetraminos.x + myTetraminos.el2.x,
        y: originalTetraminos.y + myTetraminos.el2.y,
        val: BoardElementValues.TETRAMINOS,
      };


      const el3: BoardCoordinates = {
        x: originalTetraminos.x + myTetraminos.el3.x,
        y: originalTetraminos.y + myTetraminos.el3.y,
        val: BoardElementValues.TETRAMINOS,
      };

      console.log({originalTetraminos, el1, el2, el3, myTetraminos})

      return Promise.all([
          dispatch('colorBoardElement', originalTetraminos),
          dispatch('colorBoardElement', el1),
          dispatch('colorBoardElement', el2),
          dispatch('colorBoardElement', el3),
      ]);
  },

  colorBoardElement({commit, state}: ActionsSignature<BoardStore>, { x, y, val}: BoardCoordinates) {
    if (x >= 0 &&
        y >= 0 &&
        state.board.length > y &&
        state.board[y].val.length > x) {
      commit('colorBoardElement', {x, y, val})
    }
  },

  induceGravity({dispatch, state}: ActionsSignature<BoardStore>) {
    const promiseArray: Promise<any>[] = [];

    if (getBoardHeight(state) > 1) {
      for (let y = getBoardHeight(state) - 2; y >= 0; y = y - 1){
        for (let x = 0; x < getBoardLineLength(state, y); x = x + 1) {
          if (getBoardElement(state, y, x).val !== BoardElementValues.EMPTY) {
            promiseArray.push(dispatch('induceGravityInBlock', {x, y, val: true}));
          }
        }
      }
    }

    return Promise.all(promiseArray)
                  .then(() => dispatch('cleanFullLines'));
  },

  induceGravityInBlock({commit, dispatch, state}: ActionsSignature<BoardStore>, {x, y, val}: BoardCoordinates) {
    const myEl = getBoardElement(state, y + 1, x);

    if(myEl && myEl.val === BoardElementValues.EMPTY){
      commit('colorBoardElement', {x, y, val: BoardElementValues.EMPTY});
      commit('colorBoardElement', {x, y: y + 1, val: BoardElementValues.FILLED});
    }
  },

  cleanFullLines({dispatch, state}: ActionsSignature<BoardStore>) {
    const promiseArray: Promise<any>[] = [];

    for (let y = getBoardHeight(state) - 1; y >= 0; y = y - 1){
      let lineValue = 0;

      for (let x = 0; x < getBoardLineLength(state, y); x = x + 1) {
        const myElement: BoardElement = getBoardElement(state, y, x);

        if (myElement.val === BoardElementValues.FILLED) {
          lineValue = lineValue + 1;
        }
      }

      if (lineValue === getBoardLineLength(state, y)){
        // clear all the y line
        promiseArray.push(dispatch('clearAllLine', y));
      }
    }

    return Promise.all(promiseArray)
  },

  clearAllLine({commit, state}: ActionsSignature<BoardStore>, y: number){
    const val = BoardElementValues.EMPTY;

    for (let x = 0; x < getBoardLineLength(state, y); x = x + 1) {
      commit('colorBoardElement', {x, y, val})
    }
  }
};



const mutations = {

  init(state: BoardStore, board: BoardElement[][]) {
    Vue.set(state, 'board', board);
  },

  colorBoardElement(state: BoardStore, { x, y, val }: BoardCoordinates) {
    const  board = state.board;
    board[y].val[x].val = val;
    Vue.set(state, 'board', board);
  },
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations,
};
