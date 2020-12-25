import React from 'react';

import '../index.css';
import Square from './square.js';

export default class FallenSoldierBlock extends React.Component {

  renderSquare(square, i, squareShade) {
    return <Square
      key={i}
      keyVal={i}
      piece={square}
      style={square.style}
    />
  }

  render() {
    return (
      <div>
        <div className="board-row indiv-fallen-block">{this.props.whiteFallenSoldiers.map((ws, index) =>
          this.renderSquare(ws, index)
        )}</div>
        <br></br>
        <div className="board-row indiv-fallen-block">{this.props.blackFallenSoldiers.map((bs, index) =>
          this.renderSquare(bs, index)
        )}</div>
      </div>
    );
  }
}

