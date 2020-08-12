<template>
  <div class="home">
    <Board />
  </div>
</template>

<script lang="ts">
  // @ is an alias to /src
  import { Component, Vue } from 'vue-property-decorator';
  import {namespace} from "vuex-class";
  import Board from "@/components/Board.vue";

  const boardModule = namespace('board');

  @Component({
    name: 'home',
    components: {
      Board
    },
  })
  export default class Home extends Vue {
    searchValue = '';

    @boardModule.Action('init')
    init!: ({width, height}: {width: number; height: number}) => null;

    created() {
      this.init({width: 10, height: 20});
    }

  }
</script>
