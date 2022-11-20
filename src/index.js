import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import './index.css'

const Square = (props) => {
  return (
    <button 
      className="square" 
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}
  
const Board = (props) =>  {
  const renderSquare = (i) => {
    return (
      <Square 
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />);
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}
const Game = () => {
  const [state, setState] = useState({
    history: [{
      squares: Array(9).fill(null),
    }],
    xIsNext: true,
    stepNumber: 0,
  });

  const handleClick = (i) => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1].squares;
    const squares = current.slice();
    if (calculateWinner(squares) || squares[i] ) {
      return;
    }
    squares[i] = state.xIsNext? 'X' : 'O';
    setState({
      history: history.concat([{squares: squares}]),
      xIsNext: !state.xIsNext,
      stepNumber: history.length,
    });
  }

  const jumpTo = (step) => {
    setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      history: state.history,
    });
  }
  
  const current = state.history[state.stepNumber];
  const winner = calculateWinner(current.squares);
  const moves = state.history.map((step, move) => {
    const desc = move ? `Go to move # ${move}` : `Go to game start`;
    return (
      <li key={move}>
        <button onClick={()=>{jumpTo(move)}}>{desc}</button>
      </li>
    )
  })
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (state.xIsNext ? 'X' : 'O');
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={state.xIsNext}
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{ status }</div>
        <ol>{ moves }</ol>
      </div>
    </div>
  );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

const calculateWinner = (squares) => {
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
  for (let winningCombo of lines) {
    const [a, b, c] = winningCombo;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
}