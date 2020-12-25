import Piece from './piece.js';
import { isSameDiagonal, isSameRow, isValidIndex } from '../helpers'

export default class King extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"),
      50);
  }

  isMovePossible(src, dest, squares) {
    if (squares instanceof Map) {
      return isValidIndex(dest) && // destination is valid index
        (!squares.get(dest) ||  // destination is null or
          squares.get(dest).player !== this.player) && // destination is occupied by an enemy
        ((src - 9 === dest && isSameDiagonal(src, dest)) ||
          src - 8 === dest ||
          (src - 7 === dest && isSameDiagonal(src, dest)) ||
          (src + 1 === dest && isSameRow(src, dest)) ||
          (src + 9 === dest && isSameDiagonal(src, dest)) ||
          src + 8 === dest ||
          (src + 7 === dest && isSameDiagonal(src, dest)) ||
          (src - 1 === dest && isSameRow(src, dest)));
    }
    else {
      return isValidIndex(dest) && // destination is valid index
        (!squares[dest] ||  // destination is null or
          squares[dest].player !== this.player) && // destination is occupied by an enemy
        ((src - 9 === dest && isSameDiagonal(src, dest)) ||
          src - 8 === dest ||
          (src - 7 === dest && isSameDiagonal(src, dest)) ||
          (src + 1 === dest && isSameRow(src, dest)) ||
          (src + 9 === dest && isSameDiagonal(src, dest)) ||
          src + 8 === dest ||
          (src + 7 === dest && isSameDiagonal(src, dest)) ||
          (src - 1 === dest && isSameRow(src, dest)));
    }
  }

  getPossibleMoves(src, squares) {
    const possibleMoves = [];
    const possibleDifferences = [-9, -8, -7, 1, 9, 8, 7, -1];
    possibleDifferences.forEach((currentDiff) => {
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
   * always returns empty array because of one step
   * @return {[]}
   */
  getSrcToDestPath(src, dest) {
    return [];
  }
}
