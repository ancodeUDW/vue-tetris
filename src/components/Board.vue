<template>
    <div class="board">
        <div :key="file.key"
             class="board-file"
             v-for="file in getBoard"
        >
            <div :key="el.key"
                  v-for="el in file.val"
                  @click="squareClick(el.num, file.num, !el.val)"
                  :class="{
                      'board-element': true,
                      'filled': el.val,
                  }"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import {namespace} from "vuex-class";
    import {BoardCoordinates, BoardFile} from '@/interfaces/board';

    const boardModule = namespace('board');

    @Component({
        name: 'Board',
        components: {
        },
    })
    export default class Board extends Vue {
        private searchValue = '';

        @boardModule.Getter('getBoard')
        getBoard!: BoardFile[];

        @boardModule.Action('colorBoardElement')
        colorBoardElement!: ({ x, y, val}: BoardCoordinates) => void;

        @boardModule.Action('induceGravity')
        induceGravity!: () => Promise<number>;

        created() {
            setInterval(() => this.induceGravity(), 1000)
        }

        private squareClick(x: number, y: number, val: boolean) {
            this.colorBoardElement({x, y, val});
        }
    }
</script>

<style scoped lang="scss">
    .board{
        display: flex;
        flex-direction: column;
        .board-file{
            display: flex;
            justify-content: center;

            .board-element{
                $size: 3vh;
                background-color: white;
                display: inline-block;
                width: $size;
                height: $size;
                border: 1px solid gray;

                &.filled{
                    background-color: #747cff;
                }
            }
        }
    }
</style>
