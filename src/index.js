import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      style={
        props.selected
          ? { borderWidth: "3px", lineHeight: "32px" }
          : { borderWidth: "1px" }
      }
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        selected={this.props.squares[10] === i || (this.props.win && this.props.win.indexOf(i)!=-1)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  generateRow(r) {
    const places = [0, 1, 2];
    return places.map((p) => this.renderSquare(p + 3 * r));
  }

  render() {
    const rows = [0, 1, 2];
    return rows.map((r) => (
      <div className="board-row">{this.generateRow(r)}</div>
    ));
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(10).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    squares[10] = i;
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const isXO = move % 2 === 0 ? "O" : "X";
      const posPlay = step.squares[10];
      const row = Math.floor(posPlay / 3) + 1;
      const col = (posPlay % 3) + 1;
      const desc = move
        ? "Go to move #" + move + ": " + isXO + " in " + col + ":" + row
        : "Go to game start";
      return (
        <li key={move}>
          <button className="listBtn" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    let win = null;
    if (winner) {
      status = "Winner " + winner.winner;
      win = winner.lines;
    } else if (this.state.stepNumber==9){
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            win={win}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ({
        winner:squares[a],
        lines: [a,b,c],
      });
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
