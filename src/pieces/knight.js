import Piece from './piece.js';
import { isSameRow, isValidIndex } from '../helpers/index.js'

export default class Knight extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"),
      3);
  }
  /**
   * returns true if a move is possible
   * @param {number} src - starting position, represented as an index from 0..63
   * @param {number} dest - ending position, represented as an index from 0..63
   * @param {Piece[]|Map} squares - array or map representing locations of chess pieces
   * @returns {Boolean} if a move is possible
   */
  isMovePossible(src, dest, squares) {
    const possibleDifferences = [-17, -10, 6, 15, -15, -6, 10, 17];
    if (squares instanceof Map) {
      return possibleDifferences.reduce((total, currentDiff) => {
        return total ||
          (src + currentDiff === dest &&
            !isSameRow(src, dest) &&
            this.isBetweenLeftRightBoundary(src, dest) &&
            (!squares.get(dest) /* not null*/ || squares.get(src).player !== squares.get(dest).player));
      }, false);
    }
    else {
      return possibleDifferences.reduce((total, currentDiff) => {
        return total ||
          (src + currentDiff === dest &&
            !isSameRow(src, dest) &&
            this.isBetweenLeftRightBoundary(src, dest) &&
            (!squares[dest] /* not null*/ || squares[src].player !== squares[dest].player));
      }, false);
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
    const possibleDifferences = [-17, -10, 6, 15, -15, -6, 10, 17];
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
   * returns true if knight doesn't pass through the left or right boundary (i.e. knight doesnt jump from the left side to the right side)
   * @param {number} src - Initial position
   * @param {number} dest - Ending position
   */
  isBetweenLeftRightBoundary(src, dest) {
    const rowColDiffTable = require('../dictionaries/knightMapping.json');
    var destRow = Math.floor(dest / 8); // Integer division
    var destCol = dest % 8;
    var srcRow = Math.floor(src / 8);
    var srcCol = src % 8;

    return (rowColDiffTable[dest - src] && rowColDiffTable[dest - src]['row'] === (destRow - srcRow) && rowColDiffTable[dest - src]['col'] === (destCol - srcCol));
  }

  /**
   * Generate an array of the indices that the piece will travel through between src and dest (src and dest exclusive)
   * @param  {number} src - starting position, represented as an index from 0..63
   * @param  {number} src - ending position, represented as an index from 0..63
   * @return {number[]} The indicies that the piece will travel through
   */
  getSrcToDestPath() {
    return [];
  }
}
