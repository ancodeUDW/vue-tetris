import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';
import {ActionsSignature, BoardCoordinates, BoardElement, BoardFile, BoardStore} from "@/interfaces/board";

const getBoardLine = (state: BoardStore, y: number): BoardFile => {
  return state.board[y];
};

const getBoardLineVal = (state: BoardStore, y: number): BoardElement[] => {
  return getBoardLine(state, y).val;
};

const getBoardElement = (state: BoardStore, y: number, x: number): BoardElement => {
  return getBoardLine(state, y).val[x];
};

const getBoardLineLength = (state: BoardStore, y: number): number => {
  return getBoardLineVal(state, y).length;
};

const getBoardHeight = (state: BoardStore): number => {
  return state.board.length;
};


const initialState = () => {
  return {
    board: [],
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
      val: false,
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
          if (getBoardElement(state, y, x).val) {
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
    if(myEl && !myEl.val){
      commit('colorBoardElement', {x, y, val: false});
      commit('colorBoardElement', {x, y: y + 1, val: true});
    }
  },

  cleanFullLines({dispatch, state}: ActionsSignature<BoardStore>) {
    const promiseArray: Promise<any>[] = [];

    for (let y = getBoardHeight(state) - 1; y >= 0; y = y - 1){
      let lineValue = 0;

      for (let x = 0; x < getBoardLineLength(state, y); x = x + 1) {
        const myElement: BoardElement = getBoardElement(state, y, x);

        if (myElement.val) {
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
    const val = false;

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
