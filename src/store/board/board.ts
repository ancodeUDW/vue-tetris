import Vue from 'vue';
import {v4 as uuidv4} from 'uuid';
import * as R from 'ramda';
import {
  ActionsSignature,
  BoardCoordinates,
  BoardElement,
  BoardElementValues,
  BoardFile,
  BoardStore,
  tetraminosAngle
} from "@/interfaces/board";
import {getBoardElement, getBoardHeight, getBoardLineLength, isBottomCollision} from "@/services/boardUtilities";
import {Tetraminos, tetraminosAngleFunction} from "@/interfaces/tetraminos";
import {getAnotherTetraminos} from "@/constants/tetraminos";
import Board from "@/components/Board.vue";

const initialState = (): BoardStore => {
  return {
    board: [] as BoardFile[],
    currentTetraminos: getAnotherTetraminos(),
    currentTetraminosAngle: tetraminosAngle._0,
    currentTetraminosCoordinates: {x: 0, y: 0, val: BoardElementValues.TETRAMINOS},
    nextTetraminos: [getAnotherTetraminos()],
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

// const modifyTetraminos = ({state, commit, dispatch }:  ActionsSignature<BoardStore>, transformFunction: (myCord: BoardCoordinates) => BoardCoordinates ) => {
//   const {currentTetraminosCoordinates, currentTetraminosAngle, currentTetraminos} = state;
//   const angleMultiplier = tetraminosAngleFunction[currentTetraminosAngle];
//
//   const induceGravityInBlock = (myCord: BoardCoordinates): BoardCoordinates => ({
//     x: myCord.x,
//     y:  myCord.y + 1,
//     val: myCord.val,
//   });
//
//   const getRotateBlock = (myCord: BoardCoordinates): BoardCoordinates => ({
//     x: (currentTetraminosCoordinates.x + myCord.x) * angleMultiplier.x,
//     y: (currentTetraminosCoordinates.y + myCord.y) * angleMultiplier.y,
//     val: currentTetraminos.el1.val,
//   });
//
//   // original tetraminos to clear
//   const tetraminosToClear: BoardCoordinates[] = [
//     currentTetraminosCoordinates,
//     getRotateBlock(currentTetraminos.el1),
//     getRotateBlock(currentTetraminos.el2),
//     getRotateBlock(currentTetraminos.el3),
//   ];
//
//   const tetraminosToPrint: BoardCoordinates[] = [
//     induceGravityInBlock(tetraminosToClear[0]),
//     induceGravityInBlock(tetraminosToClear[1]),
//     induceGravityInBlock(tetraminosToClear[2]),
//     induceGravityInBlock(tetraminosToClear[3]),
//   ];
//
//   if (isBottomCollision(state, tetraminosToPrint)) {
//     commit("solidifyAndRenewTetraminos", {tetraminosToSolidify: tetraminosToClear, next: getAnotherTetraminos()});
//   } else {
//     commit("updateTetraminos", {
//       tetraminosToClear,
//       tetraminosToPrint,
//       currentTetraminosCoordinates: {
//         x: currentTetraminosCoordinates.x,
//         y: currentTetraminosCoordinates.y + 1,
//         val: currentTetraminosCoordinates.val,
//       },
//     });
//
//     return dispatch('cleanFullLines');
//   }
// };

const getNextAngle = (myAngle: tetraminosAngle) => {
  switch (myAngle) {
    case tetraminosAngle._0:
      return tetraminosAngle._90;
    case tetraminosAngle._90:
      return tetraminosAngle._180;
    case tetraminosAngle._180:
      return tetraminosAngle._270;
    default:
      return tetraminosAngle._0;
  }

};

const actions = {
  init({commit, dispatch}: ActionsSignature<BoardStore>,
       {width, height}: {width: number; height: number}) {

    const board: BoardFile[] = [];

    for (let i = 0; i < height; i = i +  1) {
        board.push(createFile(width, i));
    }

    commit('init', {board, width});

    return dispatch("timeZero");
  },

  colorBoardElement({commit, state}: ActionsSignature<BoardStore>, { x, y, val}: BoardCoordinates) {
    if (x >= 0 &&
        y >= 0 &&
        state.board.length > y &&
        state.board[y].val.length > x) {
      commit('colorBoardElement', {x, y, val})
    }
  },

  tetraminosAction({commit, dispatch, state}: ActionsSignature<BoardStore>,
                   {
                     originalTetraminosTransformer,
                     objectiveTetraminosTransformer,
                     tetraminosAngle,
                   }: {
                     originalTetraminosTransformer: (myCord: BoardCoordinates) => BoardCoordinates;
                     objectiveTetraminosTransformer: (myCord: BoardCoordinates) => BoardCoordinates;
                     tetraminosAngle: tetraminosAngle;
                   }) {

    const {currentTetraminosCoordinates, currentTetraminosAngle, currentTetraminos} = state;

    // original tetraminos to clear
    const tetraminosToClear: BoardCoordinates[] = [
      originalTetraminosTransformer(currentTetraminosCoordinates),
      originalTetraminosTransformer(currentTetraminos.el1),
      originalTetraminosTransformer(currentTetraminos.el2),
      originalTetraminosTransformer(currentTetraminos.el3),
    ];

    const tetraminosToPrint: BoardCoordinates[] = [
      objectiveTetraminosTransformer(currentTetraminosCoordinates),
      objectiveTetraminosTransformer(currentTetraminos.el1),
      objectiveTetraminosTransformer(currentTetraminos.el2),
      objectiveTetraminosTransformer(currentTetraminos.el3),
    ];

    if (isBottomCollision(state, tetraminosToPrint)) {
      commit("solidifyAndRenewTetraminos", {tetraminosToSolidify: tetraminosToClear, next: getAnotherTetraminos()});
    } else {
      commit("updateTetraminos", {
        tetraminosToClear,
        tetraminosToPrint,
        tetraminosAngle,
        currentTetraminosCoordinates: tetraminosToPrint[0],
      });

      return dispatch('cleanFullLines');
    }
  },

  timeZero({commit, dispatch, state}: ActionsSignature<BoardStore>) {
    const {currentTetraminosCoordinates, currentTetraminosAngle, currentTetraminos} = state;
    const angleMultiplier = tetraminosAngleFunction[currentTetraminosAngle];

    const getRotateBlock = (myCord: BoardCoordinates): BoardCoordinates => {
      const angleResult = angleMultiplier(myCord);

      return ({
        x: (currentTetraminosCoordinates.x + angleResult.x),
        y: (currentTetraminosCoordinates.y + angleResult.y),
        val: currentTetraminos.el1.val,
      });
    }

    // original tetraminos to clear
    const tetraminosToPrint: BoardCoordinates[] = [
      currentTetraminosCoordinates,
      getRotateBlock(currentTetraminos.el1),
      getRotateBlock(currentTetraminos.el2),
      getRotateBlock(currentTetraminos.el3),
    ];

    commit("updateTetraminos", {
      tetraminosToClear: [],
      tetraminosToPrint,
      tetraminosAngle: currentTetraminosAngle,
      currentTetraminosCoordinates: {
        x: currentTetraminosCoordinates.x,
        y: currentTetraminosCoordinates.y + 1,
        val: currentTetraminosCoordinates.val,
      },
    });
  },


  rotateTetraminos({commit, dispatch, state}: ActionsSignature<BoardStore>) {
    const {currentTetraminosCoordinates, currentTetraminosAngle, currentTetraminos} = state;
    const nextAngle = getNextAngle(currentTetraminosAngle);

    const angleMultiplier = tetraminosAngleFunction[currentTetraminosAngle];
    const nextAngleMultiplier = tetraminosAngleFunction[nextAngle];

    const actionRotate = (myCord: BoardCoordinates, myMultiplier: (blockRelativeCord: BoardCoordinates) => BoardCoordinates): BoardCoordinates => {
      if (currentTetraminosCoordinates.x === myCord.x && currentTetraminosCoordinates.y === myCord.y) {
        return ({
          x: myCord.x,
          y: myCord.y,
          val: myCord.val,
        });
      }

      const myCord2 = myMultiplier(myCord);

      return ({
        x: (currentTetraminosCoordinates.x + myCord2.x),
        y: (currentTetraminosCoordinates.y + myCord2.y),
        val: currentTetraminos.el1.val,
      });
    };

    const getRotateBlock = (myCord: BoardCoordinates): BoardCoordinates => actionRotate(myCord, angleMultiplier);
    const induceRotation = (myCord: BoardCoordinates): BoardCoordinates => actionRotate(myCord, nextAngleMultiplier);

    return dispatch('tetraminosAction',{
      originalTetraminosTransformer: getRotateBlock,
      objectiveTetraminosTransformer: induceRotation,
      tetraminosAngle: nextAngle
    });
  },

  induceTime({commit, dispatch, state}: ActionsSignature<BoardStore>) {
    const {currentTetraminosCoordinates, currentTetraminosAngle, currentTetraminos} = state;
    const angleMultiplier = tetraminosAngleFunction[state.currentTetraminosAngle];

    const getRotateBlock = (myCord: BoardCoordinates): BoardCoordinates => {
      if (currentTetraminosCoordinates.x === myCord.x && currentTetraminosCoordinates.y === myCord.y){
        return myCord;
      }

      myCord = angleMultiplier(myCord);

      return ({
        x: (currentTetraminosCoordinates.x + myCord.x),
        y: (currentTetraminosCoordinates.y + myCord.y),
        val: currentTetraminos.el1.val,
      });
    };

    const induceGravityInBlock = (myCord: BoardCoordinates): BoardCoordinates => {
      if (currentTetraminosCoordinates.x === myCord.x && currentTetraminosCoordinates.y === myCord.y){
        return ({
          x: myCord.x,
          y: myCord.y +1,
          val: myCord.val,
        });
      }

      myCord = angleMultiplier(myCord);

      return ({
        x: (currentTetraminosCoordinates.x + myCord.x),
        y: (currentTetraminosCoordinates.y + myCord.y) + 1,
        val: currentTetraminos.el1.val,
      });
    };

    return dispatch('tetraminosAction',{
      originalTetraminosTransformer: getRotateBlock,
      objectiveTetraminosTransformer: induceGravityInBlock,
      tetraminosAngle: currentTetraminosAngle,
    });
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

  clearAllLine({commit, state}: ActionsSignature<BoardStore>, y: number) {
    const val = BoardElementValues.EMPTY;

    for (let x = 0; x < getBoardLineLength(state, y); x = x + 1) {
      commit('colorBoardElement', {x, y, val})
    }
  },

};

interface InitInterface {
  board: BoardFile[];
  width: number;
}

interface SolidifyRenewInterface {
  next: Tetraminos;
  tetraminosToSolidify: BoardCoordinates[];
}

interface UpdateTetraminosInterface {
  tetraminosToClear: BoardCoordinates[];
  tetraminosToPrint: BoardCoordinates[];
  tetraminosAngle: tetraminosAngle;
  currentTetraminosCoordinates: BoardCoordinates;
}


const mutations = {

  init(state: BoardStore, {board, width}: InitInterface) {
    const originalTetraminos: BoardCoordinates = {
      x: Math.abs(width / 2),
      y: 0,
      val: BoardElementValues.TETRAMINOS,
    };

    Vue.set(state, 'currentTetraminosCoordinates', originalTetraminos);
    Vue.set(state, 'board', board);

  },

  colorBoardElement(state: BoardStore, { x, y, val }: BoardCoordinates) {
    const  board = state.board;
    board[y].val[x].val = val;
    Vue.set(state, 'board', board);
  },

  solidifyAndRenewTetraminos(state: BoardStore, {next, tetraminosToSolidify}: SolidifyRenewInterface) {
    const board = state.board;

    const originalTetraminos: BoardCoordinates = {
      x: Math.abs(getters.getBoardWidth(state) / 2),
      y: 0,
      val: BoardElementValues.TETRAMINOS,
    };

    R.map((cord: BoardCoordinates) => {
      board[cord.y].val[cord.x].val = BoardElementValues.FILLED;
    }, tetraminosToSolidify);

    Vue.set(state, 'board', board);
    Vue.set(state, 'currentTetraminos', state.nextTetraminos[0]);
    Vue.set(state, 'currentTetraminosCoordinates', originalTetraminos);
    Vue.set(state, 'currentTetraminosAngle', tetraminosAngle._0);
    Vue.set(state, 'nextTetraminos', [next]);
  },

  updateTetraminos(state: BoardStore, {tetraminosToClear, tetraminosToPrint, tetraminosAngle, currentTetraminosCoordinates}: UpdateTetraminosInterface) {
    const board = state.board;

    R.map((cord: BoardCoordinates) => {
      board[cord.y].val[cord.x].val = BoardElementValues.EMPTY;
    }, tetraminosToClear);

    R.map((cord: BoardCoordinates) => {
      board[cord.y].val[cord.x].val = BoardElementValues.TETRAMINOS;
    }, tetraminosToPrint);

    console.log("update tetraminos", tetraminosAngle);

    Vue.set(state, 'board', board);
    Vue.set(state, 'currentTetraminosAngle', tetraminosAngle);
    Vue.set(state, 'currentTetraminosCoordinates', currentTetraminosCoordinates);
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations,
};
