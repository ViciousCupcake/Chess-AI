import Piece from './piece.js';
import { isSameDiagonal, isSameRow, isValidIndex } from '../helpers/index.js'

export default class King extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"),
      50);
  }
  /**
   * returns true if a move is possible
   * @param {number} src - starting position, represented as an index from 0..63
   * @param {number} dest - ending position, represented as an index from 0..63
   * @param {Piece[]|Map} squares - array or map representing locations of chess pieces
   * @returns {Boolean} if a move is possible
   */
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

  /**
   * Generates an array representing the indices that the piece can move to
   * @param {number} src - starting position, represented as an index from 0..63
   * @param {Piece[]|Map} squares - array or map representing locations of chess pieces
   * @returns {Number[]} An array representing the indices that the piece can move to
   */
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
   * Generate an array of the indices that the piece will travel through between src and dest (src and dest exclusive)
   * @param  {number} src - starting position, represented as an index from 0..63
   * @param  {number} src - ending position, represented as an index from 0..63
   * @return {number[]} The indicies that the piece will travel through
   */
  getSrcToDestPath(src, dest) {
    return []; // The king can travel at most 1 space so it won't hop over any pieces
  }
}
