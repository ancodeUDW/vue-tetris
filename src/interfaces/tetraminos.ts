import {BoardCoordinates} from "@/interfaces/board";
import Board from "@/components/Board.vue";
import board from "@/store/board/board";


// A tetraminos is defined by 4 squares. The first one is implicit
// the several "el" elements of the interface define the distance they are from the original.
// the class is optional.
export interface Tetraminos {
    el1: BoardCoordinates;
    el2: BoardCoordinates;
    el3: BoardCoordinates;
    class: string;
}
