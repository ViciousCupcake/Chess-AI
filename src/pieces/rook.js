import Piece from './piece.js';
import { isSameRow, isSameColumn, isPathClean, isValidIndex } from '../helpers'

export default class Rook extends Piece {
  constructor(player) {
    super(player,
      (player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg"),
      5);
  }

  isMovePossible(src, dest, squares) {
    if (squares instanceof Map) {
      const isDestEnemyOccupied = Boolean(squares.get(dest)) && squares.get(dest).player !== this.player;
      return src !== dest && (!squares.get(dest) || isDestEnemyOccupied) && isPathClean(this.getSrcToDestPath(src, dest), squares) && (isSameColumn(src, dest) || isSameRow(src, dest));
    }
    else {
      const isDestEnemyOccupied = Boolean(squares[dest]) && squares[dest].player !== this.player;
      return src !== dest && (!squares[dest] || isDestEnemyOccupied) && isPathClean(this.getSrcToDestPath(src, dest), squares) && (isSameColumn(src, dest) || isSameRow(src, dest));
    }
  }

  getPossibleMoves(src, squares) {
    const possibleMoves = [];
    // column
    // TODO: Optimize by using while loop starting from src and going outwards until reaching a piece
    var dest = 1000;
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
