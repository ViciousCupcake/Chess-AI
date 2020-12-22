import Piece from './piece.js';
import { isSameRow, isValidIndex } from '../helpers'

export default class Knight extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"),
      3);
  }
  /**
   * returns true if a move is possible
   * @param {number} src - starting position
   * @param {number} dest - ending position
   * @param {Piece[]} squares - array representing locations of chess pieces
   * @returns {boolean} if a move is possible
   */
  isMovePossible(src, dest, squares) {
    const possibleDifferences = [-17, -10, 6, 15, -15, -6, 10, 17];
    return possibleDifferences.reduce((total, currentDiff) => {
      return total ||
        (src + currentDiff === dest &&
          !isSameRow(src, dest) &&
          this.isBetweenLeftRightBoundary(src, dest) &&
          (!squares[dest] /* not null*/ || squares[src].player !== squares[dest].player));
    }, false);
    /*return ((src - 17 === dest && !isSameRow(src, dest) && squares[src].player !== squares[dest].player) ||
      (src - 10 === dest && !isSameRow(src, dest)) ||
      (src + 6 === dest && !isSameRow(src, dest)) ||
      (src + 15 === dest && !isSameRow(src, dest)) ||
      (src - 15 === dest && !isSameRow(src, dest)) ||
      (src - 6 === dest && !isSameRow(src, dest)) ||
      (src + 10 === dest && !isSameRow(src, dest)) ||
      (src + 17 === dest && !isSameRow(src, dest)))*/
  }

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
   * always returns empty array because of jumping
   * @return {[]}
   */
  getSrcToDestPath() {
    return [];
  }
}
