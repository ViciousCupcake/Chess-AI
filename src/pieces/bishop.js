import Piece from './piece.js';
import { isSameDiagonal, isPathClean } from '../helpers/index.js'

export default class Bishop extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"),
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
    if (squares instanceof Map) {
      const isDestEnemyOccupied = Boolean(squares.get(dest)) && squares.get(dest).player !== this.player;
      return src !== dest && isPathClean(this.getSrcToDestPath(src, dest), squares) && isSameDiagonal(src, dest) && (!squares.get(dest) || isDestEnemyOccupied);
    }
    else {
      const isDestEnemyOccupied = Boolean(squares[dest]) && squares[dest].player !== this.player;
      return src !== dest && isPathClean(this.getSrcToDestPath(src, dest), squares) && isSameDiagonal(src, dest) && (!squares[dest] || isDestEnemyOccupied);
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
    const diagonalDictionaryTLBR = require('../dictionaries/diagonalTopLeftBottomRight.json');
    const diagonalDictionaryTRBL = require('../dictionaries/diagonalTopRightBottomLeft.json');
    if (!!diagonalDictionaryTLBR[src]) {
      Object.keys(diagonalDictionaryTLBR[src]).forEach((current) => {
        current = Number(current);
        if (this.isMovePossible(src, current, squares)) {
          possibleMoves.push(current);
        }
      });
    }
    if (!!diagonalDictionaryTRBL[src]) {
      Object.keys(diagonalDictionaryTRBL[src]).forEach((current) => {
        current = Number(current);
        if (this.isMovePossible(src, current, squares)) {
          possibleMoves.push(current);
        }
      });
    }
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
    let path = [], pathStart, pathEnd, incrementBy;
    if (src > dest) {
      pathStart = dest;
      pathEnd = src;
    }
    else {
      pathStart = src;
      pathEnd = dest;
    }
    if (Math.abs(src - dest) % 9 === 0) {
      incrementBy = 9;
      pathStart += 9;
    }
    else {
      incrementBy = 7;
      pathStart += 7;
    }

    for (let i = pathStart; i < pathEnd; i += incrementBy) {
      path.push(i);
    }
    return path;
  }
}
