import React from 'react';
import { GrReactjs, GrHeroku } from 'react-icons/gr';


import '../index.css';
import Board from './board.js';
import King from '../pieces/king'
import FallenSoldierBlock from './fallen-soldier-block.js';
import { initialiseChessBoard, getInitialSoldierIndices } from '../helpers/board-initialiser.js';
import minimaxRunner from '../helpers/minimax';
import Knight from '../pieces/knight';
import Pawn from '../pieces/pawn';
import Bishop from '../pieces/bishop';
import Queen from '../pieces/queen';
import Rook from '../pieces/rook';
import Piece from '../pieces/piece';

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: initialiseChessBoard(),
      whiteFallenSoldiers: [],
      blackFallenSoldiers: [],
      whiteAliveSoldiers: getInitialSoldierIndices(1),
      blackAliveSoldiers: getInitialSoldierIndices(2),
      player: 1,
      sourceSelection: -1,
      status: '',
      turn: 'white',
      score: '0',
      bestSrc: 'N/A',
      bestDest: 'N/A',
      computations: 'N/A',
      depth: 4
    }
  }
  handleClick(i) {
    const squares = [...this.state.squares];
    if (!!squares[i] && squares[i] instanceof Piece) {
      //console.log(squares[i].getPossibleMoves(i, squares));
      /*console.log(squares[i].getValue());
      console.log("White");
      console.log(this.state.whiteAliveSoldiers);
      console.log("Black");
      console.log(this.state.blackAliveSoldiers);*/

      //squares[i].isBetweenLeftRightBoundary(0,0);
    }
    if (this.state.sourceSelection === -1) { // If no piece is already selected (i.e. first click)
      if (!squares[i] || squares[i].player !== this.state.player) { // If player selected null piece or a piece that isn't under control of player
        this.setState({ status: "Wrong selection. Choose player " + this.state.player + " pieces." });
        if (squares[i]) {
          squares[i].style = { ...squares[i].style, backgroundColor: "" };
        }
      }
      else {
        squares[i].style = { ...squares[i].style, backgroundColor: "#856312" }; // Emerald from http://omgchess.blogspot.com/2015/09/chess-board-color-schemes.html
        this.setState({
          status: "Choose destination for the selected piece",
          sourceSelection: i
        })
      }
      return
    }

    squares[this.state.sourceSelection].style = { ...squares[this.state.sourceSelection].style, backgroundColor: "" };

    // Prevent moving piece on top of another piece of the same color
    if (squares[i] && squares[i].player === this.state.player) {
      this.setState({
        status: "Wrong selection. Choose valid source and destination again.",
        sourceSelection: -1,
      });
    }
    else {

      const whiteFallenSoldiers = [];
      const blackFallenSoldiers = [];
      const whiteAliveSoldiers = this.state.whiteAliveSoldiers;
      const blackAliveSoldiers = this.state.blackAliveSoldiers;
      var index = 1000;

      const isMovePossible = squares[this.state.sourceSelection].isMovePossible(this.state.sourceSelection, i, squares);
      if (isMovePossible) {
        if (squares[i] !== null) {
          if (squares[i].player === 1) {
            whiteFallenSoldiers.push(squares[i]);
            // Remove dead piece from aliveSoldiers array
            whiteAliveSoldiers.delete(i);
          }
          else {
            blackFallenSoldiers.push(squares[i]);
            // Remove dead piece from aliveSoldiers array
            blackAliveSoldiers.delete(i);
          }
          if (squares[i] instanceof King) {
            console.log("Game over");
            this.setState(oldState => ({
              sourceSelection: -1,
              squares,
              whiteFallenSoldiers: [...oldState.whiteFallenSoldiers, ...whiteFallenSoldiers],
              blackFallenSoldiers: [...oldState.blackFallenSoldiers, ...blackFallenSoldiers],
              status: this.state.turn.charAt(0).toUpperCase() + this.state.turn.slice(1) + " wins! Game Over!" // Capitalize the player name
            }));
            return;
          }
        }

        squares[i] = squares[this.state.sourceSelection];
        squares[this.state.sourceSelection] = null;
        // remove sourceSelection add I (i.e. update aliveSoldiers arrays)
        if (this.state.player === 1) { // White
          whiteAliveSoldiers.delete(this.state.sourceSelection);
          whiteAliveSoldiers.add(i);
        }
        else if (this.state.player === 2) { // Black
          blackAliveSoldiers.delete(this.state.sourceSelection);
          blackAliveSoldiers.add(i);
        }

        const isCheckMe = this.isCheckForPlayer(squares, this.state.player);

        // TODO: Fix ischeckmate, problem is that if king is check, you can move king but no other pieces.
        /*if (isCheckMe) {
          this.setState(oldState => ({
            status: "Wrong selection. Choose valid source and destination again. Now you have a check!",
            sourceSelection: -1,
          }))
        } else*/
        {
          let player = this.state.player === 1 ? 2 : 1;
          let turn = this.state.turn === 'white' ? 'black' : 'white';
          // Probably minimax algorithm here or at end of function
          // Let being checked be very bad when assigning score          
          this.setState(oldState => ({
            sourceSelection: -1,
            squares,
            whiteFallenSoldiers: [...oldState.whiteFallenSoldiers, ...whiteFallenSoldiers],
            blackFallenSoldiers: [...oldState.blackFallenSoldiers, ...blackFallenSoldiers],
            whiteAliveSoldiers: whiteAliveSoldiers,
            blackAliveSoldiers: blackAliveSoldiers,
            player,
            status: '',
            turn
          }));
          //console.log(squares);

          //setTimeout(minimaxRunner, 50, "hello", "world", this, squares, whiteAliveSoldiers, blackAliveSoldiers);

          if (player === 1) {
            setTimeout(minimaxRunner, 1000, squares,
              this.state.whiteAliveSoldiers, this.state.blackAliveSoldiers,
              this.state.whiteFallenSoldiers, this.state.blackFallenSoldiers,
              this.state.depth, 1, this);
          }
          else {
            setTimeout(minimaxRunner, 1000, squares,
              this.state.whiteAliveSoldiers, this.state.blackAliveSoldiers,
              this.state.whiteFallenSoldiers, this.state.blackFallenSoldiers,
              this.state.depth, 2, this);
          }
        }
      }
      else {
        this.setState({
          status: "Wrong selection. Choose valid source and destination again- impossible move.",
          sourceSelection: -1,
        });
      }
    }
  }

  getKingPosition(squares, player) {
    return squares.reduce((acc, curr, i) =>
      acc || //King may be only one, if we had found it, returned his position
      ((curr //current squre mustn't be a null
        && (curr.getPlayer() === player)) //we are looking for aspecial king 
        && (curr instanceof King)
        && i), // returned position if all conditions are completed
      null)
  }

  isCheckForPlayer(squares, player) {
    const opponent = player === 1 ? 2 : 1
    const playersKingPosition = this.getKingPosition(squares, player)
    const canPieceKillPlayersKing = (piece, i) => piece.isMovePossible(playersKingPosition, i, squares)
    return squares.reduce((acc, curr, idx) =>
      acc ||
      (curr &&
        (curr.getPlayer() === opponent) && canPieceKillPlayersKing(curr, idx)
        && true),
      false)
  }

  render() {
    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={this.state.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="game-bottom-box">
              <div className="float-child">
                <h3 className="turn-label">Turn</h3>
                <div id="player-turn-box" style={{ backgroundColor: this.state.turn }}>
                </div>
              </div>

              <div className="float-child console-text">
                <p>
                  Best Starting Position: {this.state.bestSrc}
                  <br></br>
                  Best Ending Position: {this.state.bestDest}
                  <br></br>
                  Computations Performed: {this.state.computations}
                  <br></br>
                  Recursive Depth: {this.state.depth}
                </p>
              </div>
            </div>
            <div className="game-status">{this.state.status}</div>

            <div className="fallen-soldier-block">

              {<FallenSoldierBlock
                whiteFallenSoldiers={this.state.whiteFallenSoldiers}
                blackFallenSoldiers={this.state.blackFallenSoldiers}
              />
              }
            </div>

          </div>
        </div>

        <div className="icons-attribution">
          <div>
            <div className="tech-used">
              <p>
              Created by Jonathan Xu using <span className="react-icon"><GrReactjs /> React</span> and deployed to <span className="heroku-icon"><GrHeroku /> Heroku</span>.
              </p>
              <p>
                <a href="https://github.com/ViciousCupcake/Chess-AI" target="_blank" rel="noreferrer">Source Code</a>
              </p>
            </div>
            <div>
              <small> Chess Icons And Favicon (extracted) By <a href="https://en.wikipedia.org/wiki/User:Cburnett" >en:User:Cburnett</a> [
              <a href="http://www.gnu.org/copyleft/fdl.html" target="_blank" rel="noreferrer">GFDL</a>, <a href="http://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC-BY-SA-3.0</a>,
              <a href="http://opensource.org/licenses/bsd-license.php" target="_blank" rel="noreferrer">BSD</a> or <a href="http://www.gnu.org/licenses/gpl.html" target="_blank" rel="noreferrer">GPL</a>],
              <span> </span><a href="https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces" target="_blank" rel="noreferrer">via Wikimedia Commons</a>.</small>
            </div>
            <div>
              <small> Chess Board Created by <a href="https://www.techighness.com" target="_blank" rel="noreferrer">Talha Awan</a> [<a href="https://mit-license.org" target="_blank" rel="noreferrer">MIT License</a>]</small>
            </div>
          </div>
        </div>
      </div>


    );
  }
}

