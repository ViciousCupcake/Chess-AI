import React from 'react';

import '../index.css';
import Square from './square.js';

export default class Board extends React.Component {

  renderSquare(i, squareShade, possibleMoveTint) {
    return <Square
      key={i}
      keyVal={i}
      style={this.props.squares[i] ? this.props.squares[i].style : null}
      shade={squareShade}
      tint={possibleMoveTint}
      onClick={() => this.props.onClick(i)}
    />
  }

  render() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      const squareRows = [];
      for (let j = 0; j < 8; j++) {
        const squareShade = (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j)) ? "light-square" : "dark-square";
        squareRows.push(this.renderSquare((i * 8) + j, squareShade, this.props.isPossibleMove[(i * 8) + j] ? "possible-move" : ""));
      }
      board.push(<div className="board-row" key={i}>{squareRows}</div>)
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}


function isEven(num) {
  return num % 2 === 0
}