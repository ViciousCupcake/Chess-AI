import Piece from './piece.js';
import { isSameDiagonal, isPathClean } from '../helpers'

export default class Bishop extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"),
      3);
  }

  isMovePossible(src, dest, squares) {
    const isDestEnemyOccupied = Boolean(squares[dest]) && squares[dest].player !== this.player;
    return src !== dest && isPathClean(this.getSrcToDestPath(src, dest), squares) && isSameDiagonal(src, dest) && (!squares[dest] || isDestEnemyOccupied);
  }

  getPossibleMoves(src, squares) {
    const possibleMoves = [];
    const diagonalDictionaryTLBR = require('../dictionaries/diagonalTopLeftBottomRight.json');
    const diagonalDictionaryTRBL = require('../dictionaries/diagonalTopRightBottomLeft.json');
    //console.log(Object.keys(diagonalDictionaryTLBR[src]));
    Object.keys(diagonalDictionaryTLBR[src]).forEach((current) => {
      current = Number(current);
      if (this.isMovePossible(src, current, squares)) {
        possibleMoves.push(current);
      }
    });
    Object.keys(diagonalDictionaryTRBL[src]).forEach((current) => {
      current = Number(current);
      if (this.isMovePossible(src, current, squares)) {
        possibleMoves.push(current);
      }
    });
    return possibleMoves;
  }

  getValue(){
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
