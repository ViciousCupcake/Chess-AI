import Piece from './piece.js';
import { isSameDiagonal, isValidIndex, isPathClean } from '../helpers/index.js'

export default class Pawn extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg"),
      1);
    this.initialPositions = {
      1: [48, 49, 50, 51, 52, 53, 54, 55],
      2: [8, 9, 10, 11, 12, 13, 14, 15]
    }
  }

  isMovePossible(src, dest, squares) {
    var isDestEnemyOccupied = undefined;
    var isDestinationOK = undefined;
    if (squares instanceof Map) {
      isDestEnemyOccupied = Boolean(squares.get(dest)) && squares.get(dest).player !== this.player;
      isDestinationOK = isPathClean(this.getSrcToDestPath(src, dest), squares) && (!squares.get(dest) || isDestEnemyOccupied);
    }
    else {
      isDestEnemyOccupied = Boolean(squares[dest]) && squares[dest].player !== this.player;
      isDestinationOK = isPathClean(this.getSrcToDestPath(src, dest), squares) && (!squares[dest] || isDestEnemyOccupied);
    }

    if (this.player === 1) {
      if ((dest === src - 8 && !isDestEnemyOccupied) || (dest === src - 16 && !isDestEnemyOccupied && this.initialPositions[1].indexOf(src) !== -1)) {
        return isDestinationOK;
      }
      else if (isDestEnemyOccupied && isSameDiagonal(src, dest) && (dest === src - 9 || dest === src - 7)) {
        return isDestinationOK;
      }
    }
    else if (this.player === 2) {
      if ((dest === src + 8 && !isDestEnemyOccupied) || (dest === src + 16 && !isDestEnemyOccupied && this.initialPositions[2].indexOf(src) !== -1)) {
        return isDestinationOK;
      }
      else if (isDestEnemyOccupied && isSameDiagonal(src, dest) && (dest === src + 9 || dest === src + 7)) {
        return isDestinationOK;
      }
    }
    return false;
  }

  getPossibleMoves(src, squares) {
    const possibleMoves = [];
    const possibleDifferences = {
      1: [-8, -16, -9, -7],
      2: [8, 16, 9, 7]
    }
    possibleDifferences[this.player].forEach((currentDiff) => {
      if (isValidIndex(src + currentDiff) && this.isMovePossible(src, src + currentDiff, squares)) {
        possibleMoves.push(src + currentDiff);
      }
    });
    return possibleMoves;
  }

  getValue() {
    return this.value;
  }

  /**
   * returns array of one if pawn moves two steps, else returns empty array  
   * @param  {number} src - initial position
   * @param  {number} dest - ending position
   * @return {number[]} array of indicies representing the path the pawn takes
   */
  getSrcToDestPath(src, dest) {
    if (dest === src - 16) {
      return [src - 8];
    }
    else if (dest === src + 16) {
      return [src + 8];
    }
    return [];
  }
}
