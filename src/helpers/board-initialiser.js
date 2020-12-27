import Bishop from '../pieces/bishop.js';
import King from '../pieces/king.js';
import Knight from '../pieces/knight.js';
import Pawn from '../pieces/pawn.js';
import Queen from '../pieces/queen.js';
import Rook from '../pieces/rook.js';

/**
 * Initializes the board and places the chess pieces where they belong
 * @returns {Piece[]} An array representing the pieces that were generated
 */
export const initialiseChessBoard = () => {
  const squares = Array(64).fill(null);

  for (let i = 8; i < 16; i++) {
    squares[i] = new Pawn(2);
    squares[i + 40] = new Pawn(1);
  }
  squares[0] = new Rook(2);
  squares[7] = new Rook(2);
  squares[56] = new Rook(1);
  squares[63] = new Rook(1);

  squares[1] = new Knight(2);
  squares[6] = new Knight(2);
  squares[57] = new Knight(1);
  squares[62] = new Knight(1);

  squares[2] = new Bishop(2);
  squares[5] = new Bishop(2);
  squares[58] = new Bishop(1);
  squares[61] = new Bishop(1);

  squares[3] = new Queen(2);
  squares[4] = new King(2);

  squares[59] = new Queen(1);
  squares[60] = new King(1);

  return squares;
}

/**
 * Generates an Set representing the initial locations of pieces for a given player 
 * @param {Number} player - A number representing the piece to get the initial soldier indices (1 -> white, 2 -> black)
 * @returns {Set<Number>} The initial locations of the pieces for a given player
 */
export const getInitialSoldierIndices = (player) => {
  const output = new Set();
  var index = 1000;
  if(player === 2){
    for(index = 0; index < 16; index++){
      output.add(index);
    }
  }
  else if(player === 1){
    for(index = 48; index < 64; index++){
      output.add(index);
    }
  }
  return output;
}