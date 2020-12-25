import Piece from './piece.js';
import { isSameRow, isSameColumn, isSameDiagonal, isPathClean, isValidIndex } from '../helpers/index.js'

export default class Queen extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg"),
      9);
  }

  isMovePossible(src, dest, squares) {
    if (squares instanceof Map) {
      const isDestEnemyOccupied = Boolean(squares.get(dest)) && squares.get(dest).player !== this.player;
      return src !== dest && (!squares.get(dest) || isDestEnemyOccupied) && isPathClean(this.getSrcToDestPath(src, dest), squares) && (isSameDiagonal(src, dest) || isSameRow(src, dest) || isSameColumn(src, dest));
    }
    else {
      const isDestEnemyOccupied = Boolean(squares[dest]) && squares[dest].player !== this.player;
      return src !== dest && (!squares[dest] || isDestEnemyOccupied) && isPathClean(this.getSrcToDestPath(src, dest), squares) && (isSameDiagonal(src, dest) || isSameRow(src, dest) || isSameColumn(src, dest));
    }

  }

  getPossibleMoves(src, squares) {
    const possibleMoves = [];
    var dest = 1000;
    // column
    for (dest = src % 8; isValidIndex(dest); dest += 8) {
      if (this.isMovePossible(src, dest, squares)) {
        possibleMoves.push(dest);
      }
    }

    // row
    for (dest = Math.floor(src / 8) * 8; dest < (Math.floor(src / 8) * 8 + 8); dest++) {
      if (this.isMovePossible(src, dest, squares)) {
        possibleMoves.push(dest);
      }
    }

    // diagonal
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
   * get path between src and dest (src and dest exclusive)
   * @param  {num} src  
   * @param  {num} dest 
   * @return {[array]}      
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
    if (Math.abs(src - dest) % 8 === 0 && isSameColumn(src, dest)) {
      incrementBy = 8;
      pathStart += 8;
    }
    else if (Math.abs(src - dest) % 9 === 0 && isSameDiagonal(src, dest)) {
      incrementBy = 9;
      pathStart += 9;
    }
    else if (Math.abs(src - dest) % 7 === 0 && isSameDiagonal(src, dest)) {
      incrementBy = 7;
      pathStart += 7;
    }
    else {
      incrementBy = 1;
      pathStart += 1;
    }

    for (let i = pathStart; i < pathEnd; i += incrementBy) {
      path.push(i);
    }
    return path;
  }
}