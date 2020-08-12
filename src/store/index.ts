import Vue from 'vue'
import Vuex from 'vuex'
import Board from "@/store/board/board.ts";

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    board: Board,
  }
})
